import type { CommerceCoupon } from "@/lib/commerce";

export type CouponValidationResult = {
  valid: boolean;
  reason?: string;
  coupon: CommerceCoupon | null;
  discount: number;
};

export function calculateShippingCharge(amountAfterDiscount: number) {
  if (amountAfterDiscount <= 0) {
    return 0;
  }

  return amountAfterDiscount >= 1499 ? 0 : 120;
}

export function validateCouponForSubtotal(
  coupon: CommerceCoupon | null | undefined,
  subtotal: number,
  now = new Date()
): CouponValidationResult {
  if (!coupon) {
    return {
      valid: false,
      reason: "Coupon was not found.",
      coupon: null,
      discount: 0
    };
  }

  if (!coupon.active) {
    return {
      valid: false,
      reason: "This coupon is inactive.",
      coupon,
      discount: 0
    };
  }

  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return {
      valid: false,
      reason: "This coupon is not active yet.",
      coupon,
      discount: 0
    };
  }

  if (coupon.endsAt && new Date(coupon.endsAt) < now) {
    return {
      valid: false,
      reason: "This coupon has expired.",
      coupon,
      discount: 0
    };
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return {
      valid: false,
      reason: "This coupon has reached its usage limit.",
      coupon,
      discount: 0
    };
  }

  if (subtotal < coupon.minimumOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount is Rs. ${coupon.minimumOrderAmount}.`,
      coupon,
      discount: 0
    };
  }

  const rawDiscount =
    coupon.discountType === "percent"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;
  const discount = Math.max(0, Math.min(subtotal, rawDiscount));

  return {
    valid: true,
    coupon,
    discount
  };
}
