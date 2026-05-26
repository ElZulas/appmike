import type { Order } from "../types.js";

type PayPalTokenResponse = { access_token: string };

type PayPalLink = { href: string; rel: string; method: string };

type PayPalCreateOrderResponse = {
  id: string;
  status: string;
  links: PayPalLink[];
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ id: string; status: string }>;
    };
    custom_id?: string;
  }>;
};

function baseUrl(): string {
  const mode = process.env.PAYPAL_MODE ?? "sandbox";
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID?.trim() && process.env.PAYPAL_CLIENT_SECRET?.trim(),
  );
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!clientId || !secret) {
    throw new Error("PayPal no configurado: faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en api/.env");
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Language": "en_US",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    const mode = process.env.PAYPAL_MODE ?? "sandbox";
    let hint =
      "Revisa Client ID y Secret en developer.paypal.com → Apps & Credentials (misma pestaña Sandbox o Live que PAYPAL_MODE).";
    if (err.includes("invalid_client")) {
      hint +=
        " Suele ser Secret incorrecto, credenciales de otro entorno, o Secret regenerado (copia el nuevo).";
    }
    throw new Error(`PayPal auth falló (${mode}): ${err}. ${hint}`);
  }

  const data = (await res.json()) as PayPalTokenResponse;
  return data.access_token;
}

export type CheckoutSession = {
  paypalOrderId: string;
  approvalUrl: string;
};

export async function createCheckoutForOrder(order: Order): Promise<CheckoutSession> {
  const webBase = process.env.WEB_PUBLIC_URL ?? "http://localhost:3000";
  const amount = order.amountDueMxn > 0 ? order.amountDueMxn : order.totalEstimatedMxn;

  if (amount <= 0) {
    throw new Error("Este pedido no tiene saldo pendiente");
  }

  const token = await getAccessToken();
  const value = amount.toFixed(2);

  const res = await fetch(`${baseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          custom_id: order.id,
          description: `Pedido Club Peninsular Express #${order.id.slice(0, 8)}`,
          amount: {
            currency_code: "MXN",
            value,
          },
        },
      ],
      application_context: {
        brand_name: "Club Peninsular Express",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${webBase}/pago/exito?order_id=${order.id}`,
        cancel_url: `${webBase}/pago/error?order_id=${order.id}`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal no creó el pago: ${err}`);
  }

  const data = (await res.json()) as PayPalCreateOrderResponse;
  const approve = data.links.find((l) => l.rel === "approve");

  if (!data.id || !approve?.href) {
    throw new Error("PayPal no devolvió URL de aprobación");
  }

  return { paypalOrderId: data.id, approvalUrl: approve.href };
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<PayPalCaptureResponse> {
  const token = await getAccessToken();

  const res = await fetch(`${baseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`No se pudo capturar el pago PayPal: ${err}`);
  }

  return (await res.json()) as PayPalCaptureResponse;
}

export function extractOrderIdFromCapture(capture: PayPalCaptureResponse): string | null {
  const unit = capture.purchase_units?.[0];
  return unit?.custom_id ?? null;
}

export function extractCaptureId(capture: PayPalCaptureResponse): string | null {
  return capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? capture.id ?? null;
}

type PayPalOrderDetails = {
  id: string;
  status: string;
  purchase_units?: Array<{ custom_id?: string }>;
};

/** Consulta estado de una orden PayPal (requiere OAuth en servidor). */
export async function getPayPalOrder(paypalOrderId: string): Promise<PayPalOrderDetails> {
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v2/checkout/orders/${paypalOrderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`No se pudo consultar PayPal: ${err}`);
  }
  return (await res.json()) as PayPalOrderDetails;
}

export async function confirmPayPalForOrder(
  orderId: string,
  paypalOrderId: string,
): Promise<{ verified: boolean; status: string }> {
  try {
    const details = await getPayPalOrder(paypalOrderId);
    const customId = details.purchase_units?.[0]?.custom_id;
    if (customId && customId !== orderId) {
      throw new Error("La orden PayPal no corresponde a este pedido");
    }
    const ok = details.status === "COMPLETED" || details.status === "APPROVED";
    return { verified: ok, status: details.status };
  } catch (err) {
    if (process.env.PAYPAL_TRUST_CLIENT_CAPTURE === "true") {
      return { verified: true, status: "CLIENT_CAPTURED" };
    }
    throw err;
  }
}
