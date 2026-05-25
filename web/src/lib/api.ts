import type { CatalogProduct } from "./catalog";
import type { Order } from "./orders";
import type { UserProfile } from "./users";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000";
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Error en la solicitud");
  }
  return data as T;
}

async function authFetch(path: string, token: string, init?: RequestInit): Promise<Response> {
  const url = `${apiBase()}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      `No se pudo conectar con la API (${apiBase()}). En Vercel revisa NEXT_PUBLIC_API_BASE_URL; en Render, CORS_ORIGIN con tu dominio .vercel.app`,
    );
  }
  return res;
}

export async function fetchMyProfile(token: string): Promise<UserProfile> {
  const res = await authFetch("/v1/users/me", token);
  return parseJson<UserProfile>(res);
}

export async function updateMyProfile(
  token: string,
  body: Partial<{
    phone: string;
    deliveryAddress: string;
    displayName: string;
    settings: Partial<UserProfile["settings"]>;
  }>,
): Promise<UserProfile> {
  const res = await authFetch("/v1/users/me", token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return parseJson<UserProfile>(res);
}

export async function createOrder(
  token: string,
  payload: { items: { productId: string; quantity: number }[] },
): Promise<Order> {
  const res = await authFetch("/v1/orders", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseJson<Order>(res);
}

export async function fetchOrders(token: string): Promise<Order[]> {
  const res = await authFetch("/v1/orders", token, { cache: "no-store" });
  return parseJson<Order[]>(res);
}

export async function fetchOrder(token: string, orderId: string): Promise<Order> {
  const res = await authFetch(`/v1/orders/${orderId}`, token, { cache: "no-store" });
  return parseJson<Order>(res);
}

export type CheckoutResponse = {
  paypalOrderId: string;
  approvalUrl: string;
};

export async function createPayPalCheckout(
  token: string,
  orderId: string,
): Promise<CheckoutResponse> {
  const res = await authFetch(`/v1/orders/${orderId}/checkout`, token, { method: "POST" });
  return parseJson<CheckoutResponse>(res);
}

/** Confirma pago tras botones PayPal en el navegador (recomendado). */
export async function confirmPayPalPayment(
  token: string,
  orderId: string,
  paypalOrderId: string,
): Promise<Order> {
  const res = await authFetch(`/v1/orders/${orderId}/confirm-paypal`, token, {
    method: "POST",
    body: JSON.stringify({ paypalOrderId }),
  });
  return parseJson<Order>(res);
}

/** Captura en servidor (requiere Secret válido en api/.env). */
export async function capturePayPalPayment(
  token: string,
  orderId: string,
  paypalOrderId: string,
): Promise<Order> {
  const res = await authFetch(`/v1/orders/${orderId}/capture-paypal`, token, {
    method: "POST",
    body: JSON.stringify({ paypalOrderId }),
  });
  return parseJson<Order>(res);
}

export async function setOrderDelivered(
  orderId: string,
  token: string,
  delivered: boolean,
): Promise<Order> {
  const res = await authFetch(`/v1/orders/${orderId}/delivered`, token, {
    method: "PATCH",
    body: JSON.stringify({ delivered }),
  });
  return parseJson<Order>(res);
}

export type { CatalogProduct };
