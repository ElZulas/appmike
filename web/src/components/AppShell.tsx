"use client";

import Link from "next/link";
import { Package, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { useAuth } from "@/contexts/AuthContext";
import { CatalogClient } from "./CatalogClient";
import { OrdersSection } from "./OrdersSection";
import { SessionSection } from "./session/SessionSection";

type Tab = "catalog" | "orders" | "session";

type Props = {
  initialProducts: CatalogProduct[];
  initialTab?: Tab;
};

export function AppShell({ initialProducts, initialTab = "catalog" }: Props) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [ordersRefresh, setOrdersRefresh] = useState(0);

  function onOrderCreated() {
    setOrdersRefresh((n) => n + 1);
    setTab("orders");
  }

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
      active
        ? "bg-white text-teal-900 shadow-sm dark:bg-zinc-700 dark:text-teal-100"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    }`;

  return (
    <div className="min-h-full bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">SuperSocio</h1>
            <Link
              href="/"
              className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-300"
            >
              Inicio
            </Link>
          </div>
          <nav className="flex flex-wrap gap-1 rounded-lg bg-zinc-200/80 p-1 dark:bg-zinc-800 sm:ml-4">
            <button type="button" onClick={() => setTab("catalog")} className={tabClass(tab === "catalog")}>
              <Package size={16} />
              Catálogo
            </button>
            <button type="button" onClick={() => setTab("orders")} className={tabClass(tab === "orders")}>
              <ShoppingBag size={16} />
              Mis pedidos
            </button>
            <button type="button" onClick={() => setTab("session")} className={tabClass(tab === "session")}>
              <User size={16} />
              Sesión
            </button>
          </nav>
          <span className="hidden text-xs font-semibold text-teal-800 dark:text-teal-300 sm:ml-auto sm:inline">
            {user ? user.email : "Invitado"} · Mérida
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "catalog" ? (
          <CatalogClient initialProducts={initialProducts} onOrderCreated={onOrderCreated} />
        ) : null}
        {tab === "orders" ? (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight">Mis pedidos</h2>
            <p className="mt-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Crea el pedido sin pagar; luego paga todo o ítem por ítem. Teléfono de contacto guardado en
              cada pedido.
            </p>
            <OrdersSection refreshKey={ordersRefresh} />
          </>
        ) : null}
        {tab === "session" ? <SessionSection /> : null}
      </main>
    </div>
  );
}
