import type { CommerceCoupon } from "@/lib/commerce";

export type CouponValidationResult = {
  valid: boolean;
  reason?: string;
  coupon: CommerceCoupon | null;
  discount: number;
};

export type ShippingEstimate = {
  valid: boolean;
  serviceable: boolean;
  postalCode: string;
  zone?: string;
  shippingCharge: number;
  etaLabel?: string;
  message: string;
};

const storeOriginPostalCode = "127021";

export function isValidIndianPostalCode(postalCode: string) {
  return /^[1-9]\d{5}$/.test(postalCode.trim());
}

function getPincodeZone(postalCode: string) {
  const digit = postalCode[0];

  if (postalCode.startsWith("127")) {
    return {
      key: "local",
      etaLabel: "1 to 2 days",
      baseCharge: 60
    };
  }

  if (digit === "1" || digit === "2") {
    return {
      key: "north",
      etaLabel: "2 to 4 days",
      baseCharge: 90
    };
  }

  if (digit === "3" || digit === "4") {
    return {
      key: "west-central",
      etaLabel: "3 to 5 days",
      baseCharge: 120
    };
  }

  if (digit === "5" || digit === "6") {
    return {
      key: "south",
      etaLabel: "4 to 6 days",
      baseCharge: 150
    };
  }

  return {
    key: "east-northeast",
    etaLabel: "5 to 7 days",
    baseCharge: 180
  };
}

export function calculateShippingCharge(amountAfterDiscount: number, postalCode?: string) {
  if (amountAfterDiscount <= 0) {
    return 0;
  }

  if (amountAfterDiscount >= 1499) {
    return 0;
  }

  if (!postalCode || !isValidIndianPostalCode(postalCode)) {
    return 120;
  }

  return getPincodeZone(postalCode).baseCharge;
}

export function estimateShippingForPostalCode(postalCode: string, subtotal: number): ShippingEstimate {
  const normalizedPostalCode = postalCode.trim();

  if (!isValidIndianPostalCode(normalizedPostalCode)) {
    return {
      valid: false,
      serviceable: false,
      postalCode: normalizedPostalCode,
      shippingCharge: 0,
      message: "Enter a valid 6-digit Indian pincode."
    };
  }

  const zone = getPincodeZone(normalizedPostalCode);
  const shippingCharge = calculateShippingCharge(subtotal, normalizedPostalCode);

  return {
    valid: true,
    serviceable: true,
    postalCode: normalizedPostalCode,
    zone: zone.key,
    etaLabel: zone.etaLabel,
    shippingCharge,
    message:
      normalizedPostalCode === storeOriginPostalCode
        ? `Delivery is available from our ${storeOriginPostalCode} dispatch location.`
        : `Delivery is available to ${normalizedPostalCode}.`
  };
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
