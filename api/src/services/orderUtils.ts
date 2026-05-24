import type { OrderItem, PaymentStatus } from "../types.js";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function itemServiceFee(store: number, rate: number): number {
  return round2(store * rate);
}

export function lineTotalForItem(
  storePriceMxn: number,
  serviceFeeRate: number,
  quantity: number,
): number {
  const unit = round2(storePriceMxn + itemServiceFee(storePriceMxn, serviceFeeRate));
  return round2(unit * quantity);
}

export function getDisplayLabel(paymentStatus: PaymentStatus, delivered: boolean): string {
  if (paymentStatus === "unpaid") return "Sin pagar";
  if (paymentStatus === "partial") return "Pago parcial";
  if (delivered) return "Pagado, Entregado";
  return "Pagado, en reparto";
}

export function computePaymentSummary(items: OrderItem[]) {
  const amountPaidMxn = round2(
    items.filter((i) => i.paid).reduce((s, i) => s + i.lineTotalMxn, 0),
  );
  const totalEstimatedMxn = round2(items.reduce((s, i) => s + i.lineTotalMxn, 0));
  const amountDueMxn = round2(totalEstimatedMxn - amountPaidMxn);

  let paymentStatus: PaymentStatus = "unpaid";
  if (amountPaidMxn > 0 && amountDueMxn > 0) paymentStatus = "partial";
  if (amountDueMxn <= 0 && items.length > 0) paymentStatus = "paid";

  return { amountPaidMxn, amountDueMxn, totalEstimatedMxn, paymentStatus };
}
