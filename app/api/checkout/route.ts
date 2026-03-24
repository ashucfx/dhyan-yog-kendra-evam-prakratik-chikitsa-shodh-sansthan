import { createCommerceOrder } from "@/lib/commerce";
import { createPayPalOrder, createRazorpayOrder } from "@/lib/commerce-integrations";
import { getAuthenticatedUser } from "@/lib/auth-user";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ message: "Please sign in before checkout." }, { status: 401 });
    }

    const payload = (await request.json()) as Parameters<typeof createCommerceOrder>[0];

    if (!payload.customerName || !payload.customerEmail || !payload.customerPhone || !payload.items?.length) {
      return Response.json({ message: "Customer details and order items are required." }, { status: 400 });
    }

    if (!emailRegex.test(payload.customerEmail.trim().toLowerCase())) {
      return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const result = await createCommerceOrder({
      ...payload,
      userId: user.id
    });
    const origin = new URL(request.url).origin;

    if (payload.paymentProvider === "Razorpay") {
      const gatewayOrder = await createRazorpayOrder(result.order.total * 100, result.order.id);
      return Response.json(
        {
          message: "Order created successfully.",
          order: result.order,
          orderItems: result.orderItems,
          gateway: gatewayOrder
            ? {
                provider: "Razorpay",
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: gatewayOrder.id,
                amount: gatewayOrder.amount,
                currency: gatewayOrder.currency
              }
            : {
                provider: "Razorpay",
                mock: true,
                orderId: result.order.id,
                amount: result.order.total * 100,
                currency: "INR"
              }
        },
        { status: 201 }
      );
    }

    const paypalOrder = await createPayPalOrder({
      orderId: result.order.id,
      total: Number((result.order.total / 85).toFixed(2)),
      currencyCode: "USD",
      returnUrl: `${origin}/checkout?internal_order=${result.order.id}`,
      cancelUrl: `${origin}/checkout?internal_order=${result.order.id}&paypal_cancel=1`
    });

    return Response.json(
      {
        message: "Order created successfully.",
        order: result.order,
        orderItems: result.orderItems,
        gateway: paypalOrder
          ? {
              provider: "PayPal",
              orderId: paypalOrder.id,
              status: paypalOrder.status,
              approveLink: paypalOrder.links?.find((link) => link.rel === "approve")?.href ?? ""
            }
          : {
              provider: "PayPal",
              mock: true,
              orderId: result.order.id
            }
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to create order." },
      { status: 500 }
    );
  }
}
