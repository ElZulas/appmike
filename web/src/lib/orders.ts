export type PaymentStatus = "unpaid" | "partial" | "paid";

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
  fullyPaid: boolean;
  paymentMethod?: string | null;
  paidAt?: string | null;
  delivered: boolean;
  deliveredAt?: string | null;
  displayLabel: string;
  createdAt: string;
  updatedAt: string;
};

export function orderLabelClass(label: string): string {
  if (label === "Pagado, Entregado") return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
  if (label === "Pagado, en reparto") return "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100";
  if (label === "Pago parcial") return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";
  return "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100";
}
