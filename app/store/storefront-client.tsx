"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CommerceCategory, CommerceProduct, CommerceSettings } from "@/lib/commerce";
import { formatStoreCurrency, getStoreDiscountPercent, getStoreProductCategoryName } from "@/lib/commerce-ui";

type StorefrontClientProps = {
  products: CommerceProduct[];
  categories: CommerceCategory[];
  settings: CommerceSettings;
};

const priceRanges = [
  { label: "All Prices", min: 0, max: Number.MAX_SAFE_INTEGER },
  { label: "Under Rs. 1,000", min: 0, max: 999 },
  { label: "Rs. 1,000 - Rs. 1,999", min: 1000, max: 1999 },
  { label: "Rs. 2,000+", min: 2000, max: Number.MAX_SAFE_INTEGER }
];

export function StorefrontClient({ products, categories, settings }: StorefrontClientProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState(priceRanges[0].label);

  const filteredProducts = useMemo(() => {
    const range = priceRanges.find((item) => item.label === priceFilter) ?? priceRanges[0];
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.shortDescription, product.description, ...(product.benefits ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = categoryFilter === "all" || product.categorySlug === categoryFilter;
      const matchesPrice = product.salePrice >= range.min && product.salePrice <= range.max;
      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [categoryFilter, priceFilter, products, query]);

  return (
    <>
      <section className="section commerce-customer-hero">
        <div className="commerce-customer-copy">
          <p className="eyebrow">Wellness store</p>
          <h1 className="page-title">Shop trusted wellness essentials chosen to support your daily practice.</h1>
          <p className="lead">
            Explore herbal support, self-care kits, yoga accessories, and guided wellness essentials designed to feel
            calm, useful, and easy to choose.
          </p>
          <div className="hero-pills">
            <span>Authentic wellness products</span>
            <span>Comfort-first accessories</span>
            <span>Home practice support</span>
          </div>
        </div>
        <div className="commerce-promo-banner">
          <p className="admin-kicker">Featured collection</p>
          <h2>Curated support for hormones, calm, comfort, and everyday wellness.</h2>
          <p>Browse premium kits, compare benefits, and open product pages for reviews, video, and full details.</p>
          <Link className="button" href="/checkout">
            Start Checkout
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading narrow">
          <p className="eyebrow">Find products easily</p>
          <h2>Search, filter by category, and narrow by price before you browse details.</h2>
        </div>
        <div className="commerce-filter-panel">
          <input
            type="search"
            placeholder="Search products, benefits, or wellness goals"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="filter-row">
            <button
              className={`filter-chip ${categoryFilter === "all" ? "active-filter" : ""}`}
              type="button"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-chip ${categoryFilter === category.slug ? "active-filter" : ""}`}
                type="button"
                onClick={() => setCategoryFilter(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="section store-section page-end-section">
        <div className="store-grid commerce-store-grid">
          {filteredProducts.map((product) => (
            <article className="store-card visual-card product-card shopper-product-card" key={product.id}>
              <div className="product-image-shell">
                <Image src={product.image} alt={product.name} fill className="product-image" />
                <span className="program-badge">{product.badge}</span>
              </div>
              <div className="commerce-product-copy">
                <div className="commerce-product-head">
                  <span className="entity-chip entity-chip-dark">{getStoreProductCategoryName(product, categories)}</span>
                  <span className="shopper-rating">
                    {product.rating?.toFixed(1) ?? "4.7"} / 5 | {product.reviewCount ?? 0} reviews
                  </span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
                <div className="commerce-price-row">
                  <strong>{formatStoreCurrency(product.salePrice, settings)}</strong>
                  <span>{formatStoreCurrency(product.basePrice, settings)}</span>
                  <em>{getStoreDiscountPercent(product)}% off</em>
                </div>
                <div className="mini-benefits">
                  {product.benefits.slice(0, 3).map((benefit) => (
                    <span key={benefit}>{benefit}</span>
                  ))}
                </div>
                <div className="shopper-card-actions">
                  <Link className="card-cta" href={`/store/${product.slug}`}>
                    View Details
                  </Link>
                  <Link className="button button-secondary button-small" href={`/checkout?product=${product.id}`}>
                    Buy Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
