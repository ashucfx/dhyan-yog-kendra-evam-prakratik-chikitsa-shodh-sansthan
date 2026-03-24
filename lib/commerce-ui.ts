import type { CommerceCategory, CommerceProduct, CommerceSettings } from "@/lib/commerce";

export function formatStoreCurrency(amount: number, settings: CommerceSettings) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: settings.currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getStoreDiscountPercent(product: CommerceProduct) {
  if (product.salePrice >= product.basePrice) {
    return 0;
  }

  return Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100);
}

export function getStoreProductCategoryName(product: CommerceProduct, categories: CommerceCategory[]) {
  return categories.find((category) => category.slug === product.categorySlug)?.name ?? "General";
}
