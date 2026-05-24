export type CatalogProduct = {
  id: string;
  name: string;
  shortDescription: string;
  categoryIcon: string;
  storePriceMxn: number;
  serviceFeeRate: number;
  available: boolean;
  highlightOffer?: boolean;
};

export function formatMxn(value: number): string {
  return `$${Math.round(value)} MXN`;
}

export function serviceFeeMxn(p: CatalogProduct): number {
  return Math.round(p.storePriceMxn * p.serviceFeeRate * 100) / 100;
}

export function totalEstimatedMxn(p: CatalogProduct): number {
  return Math.round((p.storePriceMxn + serviceFeeMxn(p)) * 100) / 100;
}
