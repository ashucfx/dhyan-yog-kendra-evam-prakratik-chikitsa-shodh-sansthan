"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { CommerceProduct, CommerceSettings } from "@/lib/commerce";
import { formatStoreCurrency } from "@/lib/commerce-ui";
import { useCart } from "@/app/components/cart-provider";

export function CartClient({ products, settings }: { products: CommerceProduct[]; settings: CommerceSettings }) {
  const { items, loading, authenticated, removeItem, updateQuantity } = useCart();

  const cartItems = useMemo(
    () =>
      items
        .map((item) => {
          const product =
            products.find((entry) => entry.id === item.productId) ??
            products.find((entry) => entry.slug === item.productId);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item): item is { product: CommerceProduct; quantity: number } => Boolean(item)),
    [items, products]
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);

  return (
    <section className="section checkout-layout page-end-section">
      <div className="commerce-panel">
        <div className="section-heading narrow">
          <p className="eyebrow">Cart</p>
          <h1 className="page-title">Review the products you want to buy.</h1>
        </div>

        {!authenticated && !loading ? (
          <p className="guest-cart-hint admin-copy">
            You are browsing as a guest.{" "}
            <Link className="inline-link" href="/auth/sign-in?redirectTo=/cart">
              Sign in
            </Link>{" "}
            to sync this cart across devices.
          </p>
        ) : null}

        <div className="commerce-list">
          {loading ? (
            <p className="admin-copy">Loading your cart...</p>
          ) : cartItems.length ? (
            cartItems.map(({ product, quantity }) => (
              <div className="commerce-list-item" key={product.id}>
                <div className="cart-line">
                  <div className="cart-thumb">
                    <Image src={product.image} alt={product.name} fill className="product-image" sizes="80px" />
                  </div>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{formatStoreCurrency(product.salePrice, settings)}</p>
                  </div>
                </div>
                <div className="commerce-list-side cart-line-actions">
                  <button className="button button-secondary button-small" type="button" onClick={() => void updateQuantity(product.id, quantity - 1)}>
                    -
                  </button>
                  <span className="entity-chip entity-chip-dark">{quantity}</span>
                  <button className="button button-secondary button-small" type="button" onClick={() => void updateQuantity(product.id, quantity + 1)}>
                    +
                  </button>
                  <button className="button button-secondary button-small" type="button" onClick={() => void removeItem(product.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-copy">Your cart is empty.</p>
          )}
        </div>
      </div>

      <div className="commerce-panel">
        <div className="commerce-status-card">
          <div>
            <strong>Subtotal</strong>
            <p>{formatStoreCurrency(subtotal, settings)}</p>
          </div>
          <span className="status-pill status-neutral">{cartItems.length} products</span>
        </div>
        <Link className="button" href={authenticated ? "/checkout" : "/auth/sign-in?redirectTo=/checkout"}>
          {authenticated ? "Proceed to Checkout" : "Sign in to Checkout"}
        </Link>
      </div>
    </section>
  );
}
