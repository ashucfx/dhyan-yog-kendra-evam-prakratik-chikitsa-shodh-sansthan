"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommerceProduct, CommerceProductReview, CommerceSettings } from "@/lib/commerce";
import { formatStoreCurrency, getStoreDiscountPercent } from "@/lib/commerce-ui";

type ProductDetailClientProps = {
  product: CommerceProduct;
  settings: CommerceSettings;
  initialReviews: CommerceProductReview[];
  initialRating: number;
  initialReviewCount: number;
};

type MediaItem =
  | { kind: "image"; value: string }
  | { kind: "video"; value: string };

export function ProductDetailClient({
  product,
  settings,
  initialReviews,
  initialRating,
  initialReviewCount
}: ProductDetailClientProps) {
  const mediaItems = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = (product.gallery ?? [product.image]).map((image) => ({ kind: "image", value: image }));
    if (product.videoUrl) {
      items.push({ kind: "video" as const, value: product.videoUrl });
    }
    return items;
  }, [product.gallery, product.image, product.videoUrl]);

  const [selectedMedia, setSelectedMedia] = useState<MediaItem>(mediaItems[0] ?? { kind: "image", value: product.image });
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [author, setAuthor] = useState("");
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  async function submitReview() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/store/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: product.id,
          author,
          rating: score,
          comment
        })
      });

      const result = (await response.json()) as {
        message?: string;
        review?: CommerceProductReview;
        summary?: {
          rating: number;
          reviewCount: number;
          reviews: CommerceProductReview[];
        };
      };

      if (!response.ok || !result.review || !result.summary) {
        throw new Error(result.message || "Unable to submit review.");
      }

      setReviews(result.summary.reviews);
      setRating(result.summary.rating);
      setReviewCount(result.summary.reviewCount);
      setAuthor("");
      setScore(5);
      setComment("");
      setMessageTone("success");
      setMessage(result.message || "Review submitted.");
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="section product-detail-shell">
        <div className="product-media-column">
          <div className="product-main-media">
            {selectedMedia.kind === "image" ? (
              <Image src={selectedMedia.value} alt={product.name} fill className="product-image" />
            ) : (
              <iframe
                title={`${product.name} video`}
                src={selectedMedia.value}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <div className="product-thumb-grid">
            {mediaItems.map((item, index) => (
              <button
                key={`${item.kind}-${item.value}-${index}`}
                type="button"
                className={`product-thumb-card ${selectedMedia.value === item.value ? "active-thumb" : ""}`}
                onClick={() => setSelectedMedia(item)}
              >
                {item.kind === "image" ? (
                  <Image src={item.value} alt={`${product.name} media ${index + 1}`} fill className="product-image" />
                ) : (
                  <div className="product-video-thumb">
                    <span>Video</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-column">
          <p className="shopper-category">{product.badge}</p>
          <h1>{product.name}</h1>
          <div className="product-rating-row">
            <span>{rating ? rating.toFixed(1) : "New"} / 5</span>
            <span>{reviewCount} ratings</span>
            <span>{reviews.length} comments</span>
          </div>
          <div className="commerce-price-row">
            <strong>{formatStoreCurrency(product.salePrice, settings)}</strong>
            <span>{formatStoreCurrency(product.basePrice, settings)}</span>
            <em>{getStoreDiscountPercent(product)}% off</em>
          </div>
          <p className="lead product-summary">{product.shortDescription}</p>
          <div className="mini-benefits">
            {product.benefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
          <div className="product-cta-row">
            <Link className="button" href={`/checkout?product=${product.id}`}>
              Buy Now
            </Link>
            <Link className="button button-secondary" href="/store">
              Back to Store
            </Link>
          </div>
        </div>
      </section>

      <section className="section product-detail-sections page-end-section">
        <article className="product-detail-panel">
          <h2>Description</h2>
          <p>{product.description}</p>
        </article>

        <article className="product-detail-panel">
          <h2>Highlights</h2>
          <ul className="check-list">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>

        <article className="product-detail-panel">
          <h2>Ratings and comments</h2>
          <div className="product-review-list">
            {reviews.map((review) => (
              <div className="product-review-card" key={review.id}>
                <div className="product-review-head">
                  <strong>{review.author}</strong>
                  <span>{review.rating} / 5</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="product-review-form">
            <h3>Add your review</h3>
            <input placeholder="Your name" value={author} onChange={(event) => setAuthor(event.target.value)} />
            <select value={score} onChange={(event) => setScore(Number(event.target.value))}>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
            <textarea placeholder="Write your comment" value={comment} onChange={(event) => setComment(event.target.value)} />
            {message ? <p className={`form-status form-status-${messageTone}`}>{message}</p> : null}
            <button className="button button-small" type="button" disabled={busy} onClick={submitReview}>
              {busy ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
