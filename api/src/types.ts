/** Producto en catálogo (colección `products`). */
export type CatalogProduct = {
  id: string;
  name: string;
  shortDescription: string;
  categoryIcon: string;
  storePriceMxn: number;
  serviceFeeRate: number;
  available: boolean;
  highlightOffer?: boolean;
  active?: boolean;
};

export type PaymentStatus = "unpaid" | "partial" | "paid";

export type PaymentMethod = "paypal" | "manual" | null;

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  storePriceMxn: number;
  serviceFeeRate: number;
  lineTotalMxn: number;
  paid: boolean;
  paidAt?: string | null;
};

export type Order = {
  id: string;
  userId: string;
  sessionId?: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  storeSubtotalMxn: number;
  serviceSubtotalMxn: number;
  totalEstimatedMxn: number;
  amountPaidMxn: number;
  amountDueMxn: number;
  paymentStatus: PaymentStatus;
  /** true = pedido marcado pagado completo (un solo movimiento en BD) */
  fullyPaid: boolean;
  paymentMethod: PaymentMethod;
  paidAt?: string | null;
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  delivered: boolean;
  deliveredAt?: string | null;
  displayLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderBody = {
  sessionId?: string;
  items: { productId: string; quantity: number }[];
};

export type SetDeliveredBody = {
  delivered: boolean;
};
