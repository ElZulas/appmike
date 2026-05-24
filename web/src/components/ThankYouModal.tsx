"use client";

import { CheckCircle2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ThankYouModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[61] w-[min(100%,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-teal-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-labelledby="thanks-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-zinc-500 hover:bg-zinc-100"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="text-teal-600" size={48} strokeWidth={1.5} />
          <h2 id="thanks-title" className="mt-4 text-xl font-bold text-zinc-900">
            ¡Gracias por tu compra!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Tu pago quedó registrado. Cuando el pedido salga a reparto verás el estado{" "}
            <strong>Pagado, en reparto</strong>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-teal-800 py-3 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Entendido
          </button>
        </div>
      </div>
    </>
  );
}
