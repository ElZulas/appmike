import type { DocumentReference } from "firebase-admin/firestore";
import type {
  CreateOrderBody,
  Order,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
  SetDeliveredBody,
} from "../types.js";
import { getFirestore, isFirebaseConfigured } from "../firebase.js";
import { getProductById } from "./products.js";
import { assertProfileComplete, getUserProfile } from "./users.js";
import {
  computePaymentSummary,
  getDisplayLabel,
  itemServiceFee,
  lineTotalForItem,
  round2,
} from "./orderUtils.js";

const COLLECTION = "orders";

function parseDate(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date(value as string | number).toISOString();
}

function normalizeItems(raw: unknown[]): OrderItem[] {
  return raw.map((row) => {
    const d = row as Record<string, unknown>;
    const store = Number(d.storePriceMxn ?? 0);
    const rate = Number(d.serviceFeeRate ?? 0.12);
    const qty = Number(d.quantity ?? 1);
    const lineTotalMxn =
      d.lineTotalMxn != null ? Number(d.lineTotalMxn) : lineTotalForItem(store, rate, qty);

    return {
      productId: String(d.productId ?? ""),
      name: String(d.name ?? ""),
      quantity: qty,
      storePriceMxn: store,
      serviceFeeRate: rate,
      lineTotalMxn,
      paid: Boolean(d.paid),
      paidAt: d.paidAt ? parseDate(d.paidAt) : null,
    };
  });
}

function docToOrder(id: string, data: Record<string, unknown>): Order {
  const items = normalizeItems((data.items as unknown[]) ?? []);
  const summary = computePaymentSummary(items);
  const paymentStatus = summary.paymentStatus;
  const delivered = Boolean(data.delivered);
  const storeSubtotalMxn = Number(data.storeSubtotalMxn ?? 0);
  const serviceSubtotalMxn = Number(data.serviceSubtotalMxn ?? 0);

  return {
    id,
    userId: String(data.userId ?? ""),
    sessionId: data.sessionId ? String(data.sessionId) : undefined,
    customerEmail: String(data.customerEmail ?? ""),
    customerPhone: String(data.customerPhone ?? ""),
    deliveryAddress: String(data.deliveryAddress ?? ""),
    items,
    storeSubtotalMxn,
    serviceSubtotalMxn,
    totalEstimatedMxn: summary.totalEstimatedMxn || Number(data.totalEstimatedMxn ?? 0),
    amountPaidMxn: summary.amountPaidMxn,
    amountDueMxn: summary.amountDueMxn,
    paymentStatus,
    fullyPaid: Boolean(data.fullyPaid ?? paymentStatus === "paid"),
    paymentMethod: (data.paymentMethod as PaymentMethod) ?? null,
    paidAt: data.paidAt ? parseDate(data.paidAt) : null,
    paypalOrderId: data.paypalOrderId
      ? String(data.paypalOrderId)
      : data.mercadoPagoPreferenceId
        ? String(data.mercadoPagoPreferenceId)
        : null,
    paypalCaptureId: data.paypalCaptureId
      ? String(data.paypalCaptureId)
      : data.mercadoPagoPaymentId
        ? String(data.mercadoPagoPaymentId)
        : null,
    delivered,
    deliveredAt: data.deliveredAt ? parseDate(data.deliveredAt) : null,
    displayLabel: getDisplayLabel(paymentStatus, delivered),
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

function assertOrderOwner(order: Order, userId: string) {
  if (order.userId !== userId) throw new Error("No autorizado");
}

export async function createOrder(userId: string, email: string, body: CreateOrderBody): Promise<Order> {
  if (!isFirebaseConfigured()) {
    throw new Error("Los pedidos requieren Firestore. Configura Firebase en api/.env");
  }
  if (!body.items?.length) {
    throw new Error("El pedido debe incluir al menos un ítem.");
  }

  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error("Completa tu perfil en la pestaña Sesión");
  }
  assertProfileComplete(profile);

  const lineItems: OrderItem[] = [];
  let storeSubtotal = 0;
  let serviceSubtotal = 0;

  for (const line of body.items) {
    if (line.quantity < 1) continue;
    const product = await getProductById(line.productId);
    if (!product) throw new Error(`Producto no encontrado: ${line.productId}`);
    if (!product.available) throw new Error(`Producto sin stock estimado: ${product.name}`);

    const lineStore = round2(product.storePriceMxn * line.quantity);
    const lineService = round2(itemServiceFee(product.storePriceMxn, product.serviceFeeRate) * line.quantity);
    const lineTotalMxn = lineTotalForItem(product.storePriceMxn, product.serviceFeeRate, line.quantity);

    lineItems.push({
      productId: product.id,
      name: product.name,
      quantity: line.quantity,
      storePriceMxn: product.storePriceMxn,
      serviceFeeRate: product.serviceFeeRate,
      lineTotalMxn,
      paid: false,
      paidAt: null,
    });

    storeSubtotal += lineStore;
    serviceSubtotal += lineService;
  }

  if (lineItems.length === 0) throw new Error("No hay ítems válidos en el pedido.");

  storeSubtotal = round2(storeSubtotal);
  serviceSubtotal = round2(serviceSubtotal);
  const summary = computePaymentSummary(lineItems);
  const now = new Date();

  const ref = getFirestore().collection(COLLECTION).doc();
  const payload = {
    userId,
    sessionId: body.sessionId ?? null,
    customerEmail: email,
    customerPhone: profile.phone.trim(),
    deliveryAddress: profile.deliveryAddress.trim(),
    items: lineItems,
    storeSubtotalMxn: storeSubtotal,
    serviceSubtotalMxn: serviceSubtotal,
    totalEstimatedMxn: summary.totalEstimatedMxn,
    amountPaidMxn: 0,
    amountDueMxn: summary.totalEstimatedMxn,
    paymentStatus: "unpaid" as PaymentStatus,
    fullyPaid: false,
    paymentMethod: null,
    paidAt: null,
    paypalOrderId: null,
    paypalCaptureId: null,
    delivered: false,
    deliveredAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(payload);
  return docToOrder(ref.id, payload as unknown as Record<string, unknown>);
}

export async function listOrdersByUser(userId: string): Promise<Order[]> {
  if (!isFirebaseConfigured()) return [];
  if (!userId.trim()) return [];

  const snap = await getFirestore().collection(COLLECTION).where("userId", "==", userId).get();

  return snap.docs
    .map((d) => docToOrder(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await getFirestore().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return docToOrder(doc.id, doc.data() as Record<string, unknown>);
}

/**
 * Marca el pedido completo como pagado en un solo write (todos los ítems + fullyPaid).
 */
export async function markOrderFullyPaid(
  orderId: string,
  options: {
    userId?: string;
    method: "paypal" | "manual";
    paypalOrderId?: string;
    paypalCaptureId?: string;
  },
): Promise<Order> {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pedido no encontrado");
  if (options.userId) assertOrderOwner(order, options.userId);
  if (order.fullyPaid || order.paymentStatus === "paid") {
    return order;
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const items = order.items.map((i) => ({
    ...i,
    paid: true,
    paidAt: i.paidAt ?? nowIso,
  }));
  const summary = computePaymentSummary(items);

  const ref = getFirestore().collection(COLLECTION).doc(orderId);
  const payload = {
    items,
    storeSubtotalMxn: order.storeSubtotalMxn,
    serviceSubtotalMxn: order.serviceSubtotalMxn,
    totalEstimatedMxn: summary.totalEstimatedMxn,
    amountPaidMxn: summary.totalEstimatedMxn,
    amountDueMxn: 0,
    paymentStatus: "paid" as PaymentStatus,
    fullyPaid: true,
    paymentMethod: options.method,
    paidAt: now,
    paypalOrderId: options.paypalOrderId ?? order.paypalOrderId ?? null,
    paypalCaptureId: options.paypalCaptureId ?? null,
    updatedAt: now,
  };

  await ref.update(payload);
  const updated = await ref.get();
  return docToOrder(updated.id, updated.data() as Record<string, unknown>);
}

export async function savePayPalOrderId(
  orderId: string,
  userId: string,
  paypalOrderId: string,
): Promise<Order> {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pedido no encontrado");
  assertOrderOwner(order, userId);

  const ref = getFirestore().collection(COLLECTION).doc(orderId);
  await ref.update({
    paypalOrderId,
    updatedAt: new Date(),
  });
  const updated = await ref.get();
  return docToOrder(updated.id, updated.data() as Record<string, unknown>);
}

export async function setOrderDelivered(
  orderId: string,
  userId: string,
  body: SetDeliveredBody,
): Promise<Order> {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pedido no encontrado");
  assertOrderOwner(order, userId);
  if (order.paymentStatus !== "paid") {
    throw new Error("Solo se puede marcar entrega en pedidos pagados por completo");
  }

  const ref = getFirestore().collection(COLLECTION).doc(orderId);
  const delivered = Boolean(body.delivered);
  const deliveredAt = delivered ? new Date() : null;

  await ref.update({
    delivered,
    deliveredAt,
    updatedAt: new Date(),
  });

  const updated = await ref.get();
  return docToOrder(updated.id, updated.data() as Record<string, unknown>);
}
