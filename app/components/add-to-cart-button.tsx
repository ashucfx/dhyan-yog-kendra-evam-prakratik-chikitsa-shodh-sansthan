"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  productId,
  checkoutHref,
  compact = false
}: {
  productId: string;
  checkoutHref: string;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <button className={`button ${compact ? "button-small" : ""}`} type="button" onClick={handleAdd}>
        {added ? "Added" : "Add to Cart"}
      </button>
      <Link className={`button button-secondary ${compact ? "button-small" : ""}`} href={checkoutHref}>
        Buy Now
      </Link>
    </>
  );
}
