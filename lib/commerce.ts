import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

export type PaymentProviderStatus = "planned" | "active" | "disabled";

export type CommerceSettings = {
  currencyCode: string;
  currencySymbol: string;
  supportEmail: string;
  supportPhone: string;
  payments: {
    provider: string;
    status: PaymentProviderStatus;
    description: string;
  }[];
  shippingPartners: {
    name: string;
    status: PaymentProviderStatus;
    coverage: string;
  }[];
};

export type CommerceCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type CommerceProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  badge: string;
  image: string;
  gallery?: string[];
  basePrice: number;
  salePrice: number;
  stock: number;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  videoUrl?: string;
  reviews?: {
    author: string;
    rating: number;
    comment: string;
  }[];
  benefits: string[];
};

export type CommerceOffer = {
  id: string;
  title: string;
  description: string;
  kind: string;
  discountType: "percent" | "flat";
  discountValue: number;
  active: boolean;
};

export type CommerceCoupon = {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minimumOrderAmount: number;
  active: boolean;
};

export type CommerceOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  fulfillmentStatus: string;
  paymentProvider: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
};

export type CommerceShipment = {
  id: string;
  orderId: string;
  partner: string;
  awb: string;
  status: string;
  trackingUrl: string;
};

export type CommerceOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CommerceSnapshot = {
  settings: CommerceSettings;
  categories: CommerceCategory[];
  products: CommerceProduct[];
  offers: CommerceOffer[];
  coupons: CommerceCoupon[];
  orders: CommerceOrder[];
  orderItems: CommerceOrderItem[];
  shipments: CommerceShipment[];
  source: "supabase" | "local";
};

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  sku: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  badge: string;
  image: string;
  gallery: string[];
  basePrice: number;
  salePrice: number;
  stock: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  videoUrl: string;
  reviews: {
    author: string;
    rating: number;
    comment: string;
  }[];
  benefits: string[];
};

export type OfferInput = {
  id?: string;
  title: string;
  description: string;
  kind: string;
  discountType: "percent" | "flat";
  discountValue: number;
  active: boolean;
};

export type CouponInput = {
  id?: string;
  code: string;
  description: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minimumOrderAmount: number;
  active: boolean;
};

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CheckoutItemInput[];
  couponCode?: string;
  paymentProvider: "Razorpay" | "PayPal";
};

const commerceDataFile = join(process.cwd(), "data", "commerce.json");

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function readLocalSnapshot() {
  const content = await readFile(commerceDataFile, "utf8");
  const snapshot = JSON.parse(content) as Omit<CommerceSnapshot, "source">;
  return {
    ...snapshot,
    source: "local" as const
  };
}

async function writeLocalSnapshot(snapshot: Omit<CommerceSnapshot, "source">) {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(commerceDataFile, JSON.stringify(snapshot, null, 2), "utf8");
}

async function readSupabaseSnapshot(): Promise<CommerceSnapshot | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    const [settingsResult, categoriesResult, productsResult, offersResult, couponsResult, ordersResult, orderItemsResult, shipmentsResult] =
      await Promise.all([
        supabase.from("store_settings").select("currency_code, currency_symbol, support_email, support_phone").limit(1).maybeSingle(),
        supabase.from("categories").select("id, slug, name, description").order("name"),
        supabase
          .from("products")
          .select(
            "id, slug, name, sku, category_slug, short_description, description, badge, image_url, gallery, base_price, sale_price, stock, featured, rating, review_count, video_url, reviews, benefits"
          )
          .order("featured", { ascending: false })
          .order("name"),
        supabase.from("offers").select("id, title, description, kind, discount_type, discount_value, active").order("title"),
        supabase
          .from("coupons")
          .select("id, code, description, discount_type, discount_value, minimum_order_amount, active")
          .order("code"),
        supabase
          .from("orders")
          .select(
            "id, customer_name, customer_email, status, fulfillment_status, payment_provider, payment_status, subtotal, discount, shipping, total, created_at"
          )
          .order("created_at", { ascending: false })
          .limit(12),
        supabase
          .from("order_items")
          .select("id, order_id, product_id, product_name, sku, quantity, unit_price, total_price")
          .limit(100),
        supabase.from("shipments").select("id, order_id, partner, awb, status, tracking_url").order("id", { ascending: false }).limit(12)
      ]);

    const results = [settingsResult, categoriesResult, productsResult, offersResult, couponsResult, ordersResult, orderItemsResult, shipmentsResult];
    const firstError = results.find((result) => result.error)?.error;

    if (firstError) {
      throw new Error(firstError.message);
    }

    const settings = settingsResult.data
      ? {
          currencyCode: settingsResult.data.currency_code,
          currencySymbol: settingsResult.data.currency_symbol,
          supportEmail: settingsResult.data.support_email,
          supportPhone: settingsResult.data.support_phone,
          payments: [
            {
              provider: "Razorpay",
              status: (process.env.RAZORPAY_KEY_ID ? "active" : "planned") as PaymentProviderStatus,
              description: "Primary domestic gateway for UPI, cards, netbanking, and wallets."
            },
            {
              provider: "PayPal",
              status: (process.env.PAYPAL_CLIENT_ID ? "active" : "planned") as PaymentProviderStatus,
              description: "Secondary gateway for international customers."
            }
          ],
          shippingPartners: [
            {
              name: "Shiprocket",
              status: (process.env.SHIPROCKET_EMAIL ? "active" : "planned") as PaymentProviderStatus,
              coverage: "India"
            }
          ]
        }
      : null;

    if (!settings) {
      return null;
    }

    return {
      settings,
      categories: (categoriesResult.data ?? []).map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description ?? ""
      })),
      products: (productsResult.data ?? []).map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        sku: item.sku,
        categorySlug: item.category_slug,
        shortDescription: item.short_description,
        description: item.description ?? "",
        badge: item.badge ?? "",
        image: item.image_url,
        gallery: Array.isArray(item.gallery) ? item.gallery : [item.image_url],
        basePrice: item.base_price,
        salePrice: item.sale_price,
        stock: item.stock,
        featured: item.featured,
        rating: item.rating ?? 4.7,
        reviewCount: item.review_count ?? 0,
        videoUrl: item.video_url ?? "",
        reviews: Array.isArray(item.reviews) ? item.reviews : [],
        benefits: Array.isArray(item.benefits) ? item.benefits : []
      })),
      offers: (offersResult.data ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        kind: item.kind,
        discountType: item.discount_type,
        discountValue: item.discount_value,
        active: item.active
      })),
      coupons: (couponsResult.data ?? []).map((item) => ({
        id: item.id,
        code: item.code,
        description: item.description ?? "",
        discountType: item.discount_type,
        discountValue: item.discount_value,
        minimumOrderAmount: item.minimum_order_amount,
        active: item.active
      })),
      orders: (ordersResult.data ?? []).map((item) => ({
        id: item.id,
        customerName: item.customer_name,
        customerEmail: item.customer_email,
        customerPhone: undefined,
        status: item.status,
        fulfillmentStatus: item.fulfillment_status,
        paymentProvider: item.payment_provider,
        paymentStatus: item.payment_status,
        subtotal: item.subtotal,
        discount: item.discount,
        shipping: item.shipping,
        total: item.total,
        couponCode: undefined,
        shippingAddress: undefined,
        createdAt: item.created_at
      })),
      orderItems: (orderItemsResult.data ?? []).map((item) => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price
      })),
      shipments: (shipmentsResult.data ?? []).map((item) => ({
        id: item.id,
        orderId: item.order_id,
        partner: item.partner,
        awb: item.awb,
        status: item.status,
        trackingUrl: item.tracking_url
      })),
      source: "supabase"
    };
  } catch {
    return null;
  }
}

export async function loadCommerceSnapshot() {
  const supabaseSnapshot = await readSupabaseSnapshot();
  if (supabaseSnapshot) {
    return supabaseSnapshot;
  }

  return readLocalSnapshot();
}

export async function listStoreProducts() {
  const snapshot = await loadCommerceSnapshot();
  return snapshot.products;
}

export async function getStoreProduct(slug: string) {
  const snapshot = await loadCommerceSnapshot();
  return snapshot.products.find((product) => product.slug === slug) ?? null;
}

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function sanitizeCurrency(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function ensureBenefits(value: string[]) {
  return value.map((item) => sanitizeText(item)).filter(Boolean);
}

function ensureGallery(value: string[]) {
  return value.map((item) => item.trim()).filter(Boolean);
}

function ensureReviews(
  value: {
    author: string;
    rating: number;
    comment: string;
  }[]
) {
  return value
    .map((review) => ({
      author: sanitizeText(review.author),
      rating: sanitizeCurrency(review.rating),
      comment: sanitizeText(review.comment)
    }))
    .filter((review) => review.author && review.comment);
}

function cloneLocalSnapshot(snapshot: CommerceSnapshot): Omit<CommerceSnapshot, "source"> {
  return {
    settings: snapshot.settings,
    categories: snapshot.categories,
    products: snapshot.products,
    offers: snapshot.offers,
    coupons: snapshot.coupons,
    orders: snapshot.orders,
    orderItems: snapshot.orderItems,
    shipments: snapshot.shipments
  };
}

function buildOrderId() {
  return `order-${Date.now()}`;
}

function getShippingCharge(subtotal: number) {
  return subtotal >= 1499 ? 0 : 120;
}

export async function upsertProduct(input: ProductInput) {
  const payload = {
    id: input.id || crypto.randomUUID(),
    slug: sanitizeSlug(input.slug || input.name),
    name: sanitizeText(input.name),
    sku: sanitizeText(input.sku).toUpperCase(),
    categorySlug: sanitizeSlug(input.categorySlug),
    shortDescription: sanitizeText(input.shortDescription),
    description: input.description.trim(),
    badge: sanitizeText(input.badge),
    image: input.image.trim(),
    gallery: ensureGallery(input.gallery.length ? input.gallery : [input.image.trim()]),
    basePrice: sanitizeCurrency(input.basePrice),
    salePrice: sanitizeCurrency(input.salePrice),
    stock: sanitizeCurrency(input.stock),
    featured: Boolean(input.featured),
    rating: Number.isFinite(input.rating) ? Math.max(0, Math.min(5, input.rating)) : 4.7,
    reviewCount: sanitizeCurrency(input.reviewCount),
    videoUrl: input.videoUrl.trim(),
    reviews: ensureReviews(input.reviews),
    benefits: ensureBenefits(input.benefits)
  } satisfies CommerceProduct;

  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from("products").upsert({
      id: payload.id,
      slug: payload.slug,
      name: payload.name,
      sku: payload.sku,
      category_slug: payload.categorySlug,
      short_description: payload.shortDescription,
      description: payload.description,
      badge: payload.badge,
      image_url: payload.image,
      gallery: payload.gallery,
      base_price: payload.basePrice,
      sale_price: payload.salePrice,
      stock: payload.stock,
      featured: payload.featured,
      rating: payload.rating,
      review_count: payload.reviewCount,
      video_url: payload.videoUrl || null,
      reviews: payload.reviews,
      benefits: payload.benefits,
      active: true
    });

    if (error) {
      throw new Error(error.message);
    }

    return payload;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  const existingIndex = local.products.findIndex((item) => item.id === payload.id);

  if (existingIndex >= 0) {
    local.products[existingIndex] = payload;
  } else {
    local.products.unshift(payload);
  }

  await writeLocalSnapshot(local);
  return payload;
}

export async function deleteProduct(productId: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.products = local.products.filter((item) => item.id !== productId);
  local.orderItems = local.orderItems.filter((item) => item.productId !== productId);
  await writeLocalSnapshot(local);
}

export async function upsertOffer(input: OfferInput) {
  const payload = {
    id: input.id || crypto.randomUUID(),
    title: sanitizeText(input.title),
    description: input.description.trim(),
    kind: sanitizeSlug(input.kind),
    discountType: input.discountType,
    discountValue: sanitizeCurrency(input.discountValue),
    active: Boolean(input.active)
  } satisfies CommerceOffer;

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("offers").upsert({
      id: payload.id,
      title: payload.title,
      description: payload.description,
      kind: payload.kind,
      discount_type: payload.discountType,
      discount_value: payload.discountValue,
      active: payload.active
    });
    if (error) {
      throw new Error(error.message);
    }
    return payload;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  const index = local.offers.findIndex((item) => item.id === payload.id);
  if (index >= 0) {
    local.offers[index] = payload;
  } else {
    local.offers.unshift(payload);
  }
  await writeLocalSnapshot(local);
  return payload;
}

export async function deleteOffer(offerId: string) {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("offers").delete().eq("id", offerId);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }
  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.offers = local.offers.filter((item) => item.id !== offerId);
  await writeLocalSnapshot(local);
}

export async function upsertCoupon(input: CouponInput) {
  const payload = {
    id: input.id || crypto.randomUUID(),
    code: sanitizeText(input.code).toUpperCase(),
    description: input.description.trim(),
    discountType: input.discountType,
    discountValue: sanitizeCurrency(input.discountValue),
    minimumOrderAmount: sanitizeCurrency(input.minimumOrderAmount),
    active: Boolean(input.active)
  } satisfies CommerceCoupon;

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("coupons").upsert({
      id: payload.id,
      code: payload.code,
      description: payload.description,
      discount_type: payload.discountType,
      discount_value: payload.discountValue,
      minimum_order_amount: payload.minimumOrderAmount,
      active: payload.active
    });
    if (error) {
      throw new Error(error.message);
    }
    return payload;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  const index = local.coupons.findIndex((item) => item.id === payload.id);
  if (index >= 0) {
    local.coupons[index] = payload;
  } else {
    local.coupons.unshift(payload);
  }
  await writeLocalSnapshot(local);
  return payload;
}

export async function deleteCoupon(couponId: string) {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("coupons").delete().eq("id", couponId);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }
  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.coupons = local.coupons.filter((item) => item.id !== couponId);
  await writeLocalSnapshot(local);
}

export async function createCommerceOrder(input: CreateOrderInput) {
  const snapshot = await loadCommerceSnapshot();
  const matchedItems = input.items
    .map((item) => {
      const product = snapshot.products.find((entry) => entry.id === item.productId);
      if (!product || item.quantity <= 0 || product.stock < item.quantity) {
        return null;
      }

      return {
        product,
        quantity: item.quantity
      };
    })
    .filter((item): item is { product: CommerceProduct; quantity: number } => Boolean(item));

  if (!matchedItems.length) {
    throw new Error("No valid order items were provided.");
  }

  const subtotal = matchedItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const normalizedCouponCode = input.couponCode?.trim().toUpperCase() ?? "";
  const coupon = input.couponCode
    ? snapshot.coupons.find((item) => item.active && item.code === normalizedCouponCode)
    : null;
  const discount =
    coupon && subtotal >= coupon.minimumOrderAmount
      ? coupon.discountType === "percent"
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue
      : 0;
  const shipping = getShippingCharge(subtotal - discount);
  const total = Math.max(0, subtotal - discount + shipping);
  const orderId = buildOrderId();
  const createdAt = new Date().toISOString();

  const order: CommerceOrder = {
    id: orderId,
    customerName: sanitizeText(input.customerName),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    status: "pending_payment",
    fulfillmentStatus: "awaiting_payment",
    paymentProvider: input.paymentProvider,
    paymentStatus: "created",
    subtotal,
    discount,
    shipping,
    total,
    couponCode: coupon?.code ?? undefined,
    shippingAddress: input.shippingAddress,
    createdAt
  };

  const orderItems = matchedItems.map((item) => ({
    id: crypto.randomUUID(),
    orderId,
    productId: item.product.id,
    productName: item.product.name,
    sku: item.product.sku,
    quantity: item.quantity,
    unitPrice: item.product.salePrice,
    totalPrice: item.product.salePrice * item.quantity
  })) satisfies CommerceOrderItem[];

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error: orderError } = await supabase.from("orders").insert({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: input.customerPhone.trim(),
      status: order.status,
      fulfillment_status: order.fulfillmentStatus,
      payment_provider: order.paymentProvider,
      payment_status: order.paymentStatus,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      coupon_code: coupon?.code ?? null,
      shipping_address: input.shippingAddress
    });
    if (orderError) {
      throw new Error(orderError.message);
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        id: item.id,
        order_id: item.orderId,
        product_id: item.productId,
        product_name: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice
      }))
    );
    if (itemsError) {
      throw new Error(itemsError.message);
    }

    return { order, orderItems, coupon };
  }

  const local = cloneLocalSnapshot(snapshot);
  local.orders.unshift(order);
  local.orderItems.unshift(...orderItems);
  local.products = local.products.map((product) => {
    const selected = matchedItems.find((item) => item.product.id === product.id);
    if (!selected) {
      return product;
    }
    return {
      ...product,
      stock: Math.max(0, product.stock - selected.quantity)
    };
  });
  await writeLocalSnapshot(local);
  return { order, orderItems, coupon };
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string, status: string) {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status
      })
      .eq("id", orderId);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.orders = local.orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          paymentStatus,
          status
        }
      : order
  );
  await writeLocalSnapshot(local);
}

export async function updateOrderFulfillment(orderId: string, fulfillmentStatus: string) {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("orders").update({ fulfillment_status: fulfillmentStatus }).eq("id", orderId);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.orders = local.orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          fulfillmentStatus
        }
      : order
  );
  await writeLocalSnapshot(local);
}

export async function createShipmentRecord(orderId: string, partner: string, awb: string, trackingUrl: string, status = "created") {
  const shipment: CommerceShipment = {
    id: crypto.randomUUID(),
    orderId,
    partner: sanitizeText(partner),
    awb: sanitizeText(awb),
    status: sanitizeSlug(status).replace(/-/g, "_"),
    trackingUrl: trackingUrl.trim()
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("shipments").insert({
      id: shipment.id,
      order_id: shipment.orderId,
      partner: shipment.partner,
      awb: shipment.awb,
      status: shipment.status,
      tracking_url: shipment.trackingUrl
    });
    if (error) {
      throw new Error(error.message);
    }
    return shipment;
  }

  const snapshot = await loadCommerceSnapshot();
  const local = cloneLocalSnapshot(snapshot);
  local.shipments.unshift(shipment);
  await writeLocalSnapshot(local);
  return shipment;
}

export function formatCurrency(amount: number, settings: CommerceSettings) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: settings.currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getProductCategoryName(product: CommerceProduct, categories: CommerceCategory[]) {
  return categories.find((category) => category.slug === product.categorySlug)?.name ?? "General";
}

export function getDiscountPercent(product: CommerceProduct) {
  if (product.salePrice >= product.basePrice) {
    return 0;
  }

  return Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100);
}

export function getCommerceOverview(snapshot: CommerceSnapshot) {
  const paidOrders = snapshot.orders.filter((order) => order.paymentStatus === "captured");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const activeProducts = snapshot.products.filter((product) => product.stock > 0).length;
  const lowStockProducts = snapshot.products.filter((product) => product.stock > 0 && product.stock <= 12).length;
  const activeOffers = snapshot.offers.filter((offer) => offer.active).length;
  const activeCoupons = snapshot.coupons.filter((coupon) => coupon.active).length;
  const activeShipments = snapshot.shipments.filter((shipment) => shipment.status !== "delivered").length;

  return {
    revenue,
    activeProducts,
    lowStockProducts,
    activeOffers,
    activeCoupons,
    activeShipments
  };
}
