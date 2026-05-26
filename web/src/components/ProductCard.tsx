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
    <article className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
          <CatalogIcon name={p.categoryIcon} className="text-teal-800 dark:text-teal-300" />
        </div>
        <div className="min-w-0 flex-1">
          {p.highlightOffer ? (
            <span className="mb-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Oferta estimada
            </span>
          ) : null}
          <h2 className="font-bold leading-snug text-zinc-900 dark:text-zinc-50">{p.name}</h2>
          <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {p.shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800/80">
        <div className="flex justify-between gap-2 text-zinc-600 dark:text-zinc-400">
          <span>Precio tienda (est.)</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {formatMxn(p.storePriceMxn)}
          </span>
        </div>
        <div className="mt-1 flex justify-between gap-2 text-zinc-600 dark:text-zinc-400">
          <span>Comisión servicio ({pct} %)</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{formatMxn(fee)}</span>
        </div>
        <hr className="my-2 border-zinc-200 dark:border-zinc-600" />
        <div className="flex justify-between gap-2 font-semibold">
          <span className="text-zinc-900 dark:text-zinc-100">Total estimado</span>
          <span className="text-teal-800 dark:text-teal-300">{formatMxn(totalEstimatedMxn(p))}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          {p.available ? (
            <>
              <span className="mt-0.5 text-teal-600 dark:text-teal-400">✓</span>
              <span>Disponible (estimado)</span>
            </>
          ) : (
            <>
              <span className="mt-0.5 text-red-600 dark:text-red-400">✕</span>
              <span className="text-red-700 dark:text-red-300">Sin stock (estimado)</span>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={!p.available}
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-teal-100 px-3 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-900 dark:text-teal-100 dark:hover:bg-teal-800"
        >
          <ShoppingCart size={18} strokeWidth={1.75} />
          Agregar
        </button>
      </div>
    </article>
  );
}
