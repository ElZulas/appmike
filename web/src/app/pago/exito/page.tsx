"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { confirmPayPalPayment, fetchOrder } from "@/lib/api";
import { ThankYouModal } from "@/components/ThankYouModal";

function Content() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const paypalToken = params.get("token");
  const { getToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage("Falta el identificador del pedido.");
      return;
    }

    const safeOrderId = orderId;
    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | null = null;

    async function confirm() {
      if (cancelled) return;
      attemptsRef.current += 1;
      if (attemptsRef.current > 20) {
        if (pollId) clearInterval(pollId);
        setStatus("pending");
        return;
      }

      const authToken = await getToken();
      if (!authToken) {
        setStatus("pending");
        return;
      }

      try {
        if (paypalToken && attemptsRef.current === 1) {
          await confirmPayPalPayment(authToken, safeOrderId, paypalToken);
        }
        const order = await fetchOrder(authToken, safeOrderId);
        if (cancelled) return;
        if (order.fullyPaid || order.paymentStatus === "paid") {
          setStatus("paid");
          if (pollId) clearInterval(pollId);
        } else {
          setStatus("pending");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setMessage(e instanceof Error ? e.message : "No se pudo confirmar el pago");
          if (pollId) clearInterval(pollId);
        }
      }
    }

    void confirm();
    pollId = setInterval(() => void confirm(), 5000);

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
    };
  }, [orderId, paypalToken, getToken]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {status === "loading" || status === "pending" ? (
        <>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Confirmando pago con PayPal…</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Espera un momento. Si ya pagaste, el pedido se actualizará en breve.
          </p>
        </>
      ) : null}

      {status === "error" ? (
        <>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No se confirmó el pago</h1>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{message}</p>
        </>
      ) : null}

      <ThankYouModal open={status === "paid"} onClose={() => setStatus("paid")} />

      {status === "paid" ? (
        <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-400">Pago confirmado con PayPal.</p>
      ) : null}

      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default function PagoExitoPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Cargando…</p>}>
      <Content />
    </Suspense>
  );
}
