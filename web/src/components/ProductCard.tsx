"use client";

import { ShoppingCart } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { formatMxn, serviceFeeMxn, totalEstimatedMxn } from "@/lib/catalog";
import { CatalogIcon } from "./CatalogIcon";

type Props = {
  product: CatalogProduct;
  onAdd: () => void;
};

export function ProductCard({ product: p, onAdd }: Props) {
  const fee = serviceFeeMxn(p);
  const pct = Math.round(p.serviceFeeRate * 100);

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
          <CatalogIcon name={p.categoryIcon} className="text-teal-800" />
        </div>
        <div className="min-w-0 flex-1">
          {p.highlightOffer ? (
            <span className="mb-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
              Oferta estimada
            </span>
          ) : null}
          <h2 className="font-bold leading-snug text-zinc-900">{p.name}</h2>
          <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">{p.shortDescription}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-sm">
        <div className="flex justify-between gap-2 text-zinc-600">
          <span>Precio tienda (est.)</span>
          <span className="font-medium text-zinc-800">{formatMxn(p.storePriceMxn)}</span>
        </div>
        <div className="mt-1 flex justify-between gap-2 text-zinc-600">
          <span>Comisión servicio ({pct} %)</span>
          <span className="font-medium text-zinc-800">{formatMxn(fee)}</span>
        </div>
        <hr className="my-2 border-zinc-200" />
        <div className="flex justify-between gap-2 font-semibold">
          <span className="text-zinc-900">Total estimado</span>
          <span className="text-teal-800">{formatMxn(totalEstimatedMxn(p))}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start gap-1.5 text-xs text-zinc-600">
          {p.available ? (
            <>
              <span className="mt-0.5 text-teal-600">✓</span>
              <span>Disponible (estimado)</span>
            </>
          ) : (
            <>
              <span className="mt-0.5 text-red-600">✕</span>
              <span className="text-red-700">Sin stock (estimado)</span>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={!p.available}
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-teal-100 px-3 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={18} strokeWidth={1.75} />
          Agregar
        </button>
      </div>
    </article>
  );
}
