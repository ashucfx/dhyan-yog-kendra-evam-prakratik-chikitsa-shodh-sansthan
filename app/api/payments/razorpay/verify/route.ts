import { updateOrderPaymentStatus } from "@/lib/commerce";
import { verifyRazorpayPaymentSignature } from "@/lib/commerce-integrations";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      internalOrderId?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    };

    if (!payload.internalOrderId || !payload.razorpayOrderId || !payload.razorpayPaymentId || !payload.razorpaySignature) {
      return Response.json({ message: "Missing Razorpay verification fields." }, { status: 400 });
    }

    const valid = verifyRazorpayPaymentSignature({
      orderId: payload.razorpayOrderId,
      paymentId: payload.razorpayPaymentId,
      signature: payload.razorpaySignature
    });

    if (!valid) {
      return Response.json({ message: "Razorpay signature verification failed." }, { status: 400 });
    }

    await updateOrderPaymentStatus(payload.internalOrderId, "captured", "paid");

    return Response.json({ message: "Payment verified successfully." }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 500 }
    );
  }
}
