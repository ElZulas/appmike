"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders, setOrderDelivered } from "@/lib/api";
import { PayPalOrderButton } from "./PayPalOrderButton";
import { formatMxn } from "@/lib/catalog";
import type { Order } from "@/lib/orders";
import { orderLabelClass } from "@/lib/orders";
import { ThankYouModal } from "./ThankYouModal";

type Props = {
  refreshKey?: number;
};

export function OrdersSection({ refreshKey = 0 }: Props) {
  const { user, getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Inicia sesión en la pestaña Sesión");
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelivered(order: Order, delivered: boolean) {
    const token = await getToken();
    if (!token) return;
    setBusyId(order.id);
    try {
      const updated = await setOrderDelivered(order.id, token, delivered);
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al actualizar entrega");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Cargando pedidos…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p className="py-12 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Inicia sesión en la pestaña <strong>Sesión</strong> para ver tus pedidos.
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="py-12 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Aún no tienes pedidos. Agrega productos al carrito y usa{" "}
        <strong>Crear pedido (sin pagar)</strong>.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {orders.map((order) => {
          const open = expandedId === order.id;
          const busy = busyId === order.id;
          const unpaid = !order.fullyPaid && order.paymentStatus !== "paid";

          return (
            <li
              key={order.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <button
                type="button"
                className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                onClick={() => setExpandedId(open ? null : order.id)}
              >
                <span className="font-mono text-xs text-zinc-500">#{order.id.slice(0, 8)}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderLabelClass(order.displayLabel)}`}
                >
                  {order.displayLabel}
                </span>
                <span className="ml-auto text-sm font-bold text-teal-800 dark:text-teal-300">
                  {formatMxn(order.totalEstimatedMxn)}
                </span>
                <span className="w-full text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(order.createdAt).toLocaleString("es-MX")}
                  {unpaid ? ` · Pendiente ${formatMxn(order.amountDueMxn)}` : null}
                  <br />
                  Contacto: {order.customerPhone}
                  {order.deliveryAddress ? ` · ${order.deliveryAddress}` : ""}
                </span>
              </button>

              {open ? (
                <div className="space-y-3 border-t border-zinc-100 px-4 py-3 dark:border-zinc-700">
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={item.productId}
                        className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900/50"
                      >
                        <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatMxn(item.lineTotalMxn)}
                        </span>
                        {order.fullyPaid || item.paid ? (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Incluido
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  {unpaid ? (
                    <div className="min-h-[45px]">
                      <PayPalOrderButton
                        order={order}
                        onPaid={() => {
                          setThankYouOpen(true);
                          void load();
                        }}
                        onError={(msg) => alert(msg)}
                      />
                    </div>
                  ) : null}

                  {order.fullyPaid || order.paymentStatus === "paid" ? (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-600">
                      <input
                        type="checkbox"
                        checked={order.delivered}
                        disabled={busy}
                        onChange={(e) => handleDelivered(order, e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-teal-700"
                      />
                      <span>
                        Marcar como entregado{" "}
                        <span className="text-zinc-500">(repartidor / demo)</span>
                      </span>
                    </label>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <ThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
    </>
  );
}
