import { updateOrderPaymentStatus } from "@/lib/commerce";
import { capturePayPalOrder } from "@/lib/commerce-integrations";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      internalOrderId?: string;
      paypalOrderId?: string;
    };

    if (!payload.internalOrderId || !payload.paypalOrderId) {
      return Response.json({ message: "Missing PayPal capture fields." }, { status: 400 });
    }

    const capture = await capturePayPalOrder(payload.paypalOrderId);

    if (!capture) {
      await updateOrderPaymentStatus(payload.internalOrderId, "captured", "paid", payload.paypalOrderId);
      return Response.json({ message: "Mock PayPal payment captured successfully." }, { status: 200 });
    }

    await updateOrderPaymentStatus(payload.internalOrderId, "captured", "paid", capture.id);
    return Response.json(
      {
        message: "PayPal payment captured successfully.",
        captureId: capture.id,
        status: capture.status
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to capture PayPal payment." },
      { status: 500 }
    );
  }
}
