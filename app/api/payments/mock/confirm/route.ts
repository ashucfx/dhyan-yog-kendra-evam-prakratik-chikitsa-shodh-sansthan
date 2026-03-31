import { updateOrderPaymentStatus } from "@/lib/commerce";

export async function POST(request: Request) {
  try {
    const { orderId } = (await request.json()) as { orderId?: string };

    if (!orderId) {
      return Response.json({ message: "Order id is required." }, { status: 400 });
    }

    await updateOrderPaymentStatus(orderId, "captured", "paid", "mock-payment");
    return Response.json({ message: "Mock payment confirmed successfully." }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to confirm payment." },
      { status: 500 }
    );
  }
}
