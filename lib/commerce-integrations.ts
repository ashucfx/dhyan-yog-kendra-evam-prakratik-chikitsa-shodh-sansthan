import { createHmac } from "node:crypto";

type PayPalOrderResponse = {
  id: string;
  status: string;
  links?: {
    href: string;
    rel: string;
    method: string;
  }[];
};

function getBasicAuthHeader(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(keyId, keySecret),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      payment_capture: 1
    })
  });

  if (!response.ok) {
    throw new Error(`Razorpay order creation failed with status ${response.status}.`);
  }

  return (await response.json()) as {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
}

export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}

function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed with status ${response.status}.`);
  }

  const result = (await response.json()) as { access_token: string };
  return result.access_token;
}

export async function createPayPalOrder({
  orderId,
  total,
  currencyCode = "USD",
  returnUrl,
  cancelUrl
}: {
  orderId: string;
  total: number;
  currencyCode?: string;
  returnUrl?: string;
  cancelUrl?: string;
}) {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      application_context:
        returnUrl && cancelUrl
          ? {
              return_url: returnUrl,
              cancel_url: cancelUrl,
              user_action: "PAY_NOW"
            }
          : undefined,
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: currencyCode,
            value: total.toFixed(2)
          }
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`PayPal order creation failed with status ${response.status}.`);
  }

  return (await response.json()) as PayPalOrderResponse;
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`PayPal order capture failed with status ${response.status}.`);
  }

  return (await response.json()) as PayPalOrderResponse;
}

export async function createShiprocketShipment(payload: Record<string, unknown>) {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!authResponse.ok) {
    throw new Error(`Shiprocket auth failed with status ${authResponse.status}.`);
  }

  const authResult = (await authResponse.json()) as { token?: string };
  if (!authResult.token) {
    throw new Error("Shiprocket token was missing from the auth response.");
  }

  const createResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authResult.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!createResponse.ok) {
    throw new Error(`Shiprocket order creation failed with status ${createResponse.status}.`);
  }

  return (await createResponse.json()) as Record<string, unknown>;
}
