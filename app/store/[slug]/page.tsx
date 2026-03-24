import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/app/components/site-shell";
import { formatCurrency, getDiscountPercent, getStoreProduct, loadCommerceSnapshot } from "@/lib/commerce";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, snapshot] = await Promise.all([getStoreProduct(slug), loadCommerceSnapshot()]);

  if (!product) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="section commerce-detail-layout">
        <div className="commerce-detail-gallery">
          {(product.gallery ?? [product.image]).map((image, index) => (
            <div className={`commerce-detail-image ${index === 0 ? "primary" : ""}`} key={`${image}-${index}`}>
              <Image src={image} alt={`${product.name} preview ${index + 1}`} fill className="product-image" />
            </div>
          ))}
        </div>

        <div className="commerce-detail-copy">
          <p className="eyebrow">Product details</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          <div className="commerce-product-head">
            <span className="entity-chip entity-chip-dark">{product.rating?.toFixed(1) ?? "4.7"} / 5 rating</span>
            <span className="entity-chip entity-chip-dark">{product.reviewCount ?? 0} customer reviews</span>
          </div>
          <div className="commerce-price-row">
            <strong>{formatCurrency(product.salePrice, snapshot.settings)}</strong>
            <span>{formatCurrency(product.basePrice, snapshot.settings)}</span>
            <em>{getDiscountPercent(product)}% off</em>
          </div>
          <div className="mini-benefits">
            {product.benefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
          <div className="shopper-card-actions">
            <Link className="button" href={`/checkout?product=${product.id}`}>
              Buy This Product
            </Link>
            <Link className="button button-secondary" href="/store">
              Back to Store
            </Link>
          </div>
        </div>
      </section>

      <section className="section commerce-detail-sections page-end-section">
        <article className="commerce-panel">
          <div className="commerce-panel-heading">
            <div>
              <p className="admin-kicker">Customer reviews</p>
              <h2>What buyers are saying</h2>
            </div>
          </div>
          <div className="commerce-list">
            {(product.reviews ?? []).map((review, index) => (
              <div className="commerce-status-card" key={`${review.author}-${index}`}>
                <div>
                  <strong>{review.author}</strong>
                  <p>{review.comment}</p>
                </div>
                <span className="status-pill status-success">{review.rating} / 5</span>
              </div>
            ))}
          </div>
        </article>

        <article className="commerce-panel">
          <div className="commerce-panel-heading">
            <div>
              <p className="admin-kicker">Product video</p>
              <h2>Watch before you buy</h2>
            </div>
          </div>
          {product.videoUrl ? (
            <div className="commerce-video-shell">
              <iframe
                title={`${product.name} video`}
                src={product.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <p className="admin-copy">A product video will appear here when added.</p>
          )}
        </article>
      </section>
    </SiteShell>
  );
}
