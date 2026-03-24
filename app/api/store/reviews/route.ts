import { createProductReview, getProductReviews, loadCommerceSnapshot } from "@/lib/commerce";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      productId?: string;
      author?: string;
      rating?: number;
      comment?: string;
    };

    if (!payload.productId || !payload.author || !payload.comment || !payload.rating) {
      return Response.json({ message: "Product, name, rating, and comment are required." }, { status: 400 });
    }

    const review = await createProductReview({
      productId: payload.productId,
      author: payload.author,
      rating: payload.rating,
      comment: payload.comment
    });

    const snapshot = await loadCommerceSnapshot();
    const summary = getProductReviews(snapshot, payload.productId);

    return Response.json(
      {
        message: "Review submitted successfully.",
        review,
        summary
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to submit review." },
      { status: 500 }
    );
  }
}
