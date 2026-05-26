"use client";

import { X } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { formatMxn, serviceFeeMxn, totalEstimatedMxn } from "@/lib/catalog";
import { CatalogIcon } from "./CatalogIcon";

export type CartLine = { product: CatalogProduct; quantity: number };

type Props = {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  checkoutLoading?: boolean;
  checkoutMessage?: string | null;
};

function lineTotals(lines: CartLine[]) {
  let store = 0;
  let service = 0;
  for (const l of lines) {
    store += l.product.storePriceMxn * l.quantity;
    service += serviceFeeMxn(l.product) * l.quantity;
  }
  return { store, service, total: store + service };
}

export function CartDrawer({
  open,
  lines,
  onClose,
  onInc,
  onDec,
  onRemove,
  onCheckout,
  checkoutLoading = false,
  checkoutMessage,
}: Props) {
  const { store, service, total } = lineTotals(lines);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="fixed inset-0 z-40 bg-black/35 md:bg-black/25"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Carrito</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="flex-1 px-4 py-8 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Agrega productos desde el catálogo. Los precios son estimados; el total final se confirma
            con el ticket.
          </p>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-zinc-100 px-2 dark:divide-zinc-800">
              {lines.map((l) => (
                <li key={l.product.id} className="flex gap-3 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    <CatalogIcon name={l.product.categoryIcon} className="text-teal-800 dark:text-teal-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-zinc-900 dark:text-zinc-50">
                      {l.product.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatMxn(l.product.storePriceMxn)} + {formatMxn(serviceFeeMxn(l.product))}{" "}
                      c/u
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded border border-zinc-200 px-2 py-1 text-sm text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        onClick={() => onDec(l.product.id)}
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {l.quantity}
                      </span>
                      <button
                        type="button"
                        className="rounded border border-zinc-200 px-2 py-1 text-sm text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        onClick={() => onInc(l.product.id)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-2 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                        onClick={() => onRemove(l.product.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/80">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal tienda (est.)</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{formatMxn(store)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Comisión servicio (est.)</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {formatMxn(service)}
                  </span>
                </div>
                <hr className="my-2 border-zinc-200 dark:border-zinc-600" />
                <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-50">
                  <span>Total estimado</span>
                  <span className="text-teal-800 dark:text-teal-300">{formatMxn(total)}</span>
                </div>
              </div>
              <button
                type="button"
                disabled={checkoutLoading}
                onClick={onCheckout}
                className="mt-4 w-full rounded-lg bg-teal-800 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                {checkoutLoading ? "Creando pedido…" : "Crear pedido (sin pagar)"}
              </button>
              {checkoutMessage ? (
                <p className="mt-2 text-center text-xs text-teal-800 dark:text-teal-300">
                  {checkoutMessage}
                </p>
              ) : (
                <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  El pedido se guarda sin pago. Paga en la pestaña Mis pedidos.
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
