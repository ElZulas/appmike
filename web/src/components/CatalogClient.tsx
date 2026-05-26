"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/api";
import type { CatalogProduct } from "@/lib/catalog";
import { CartDrawer, type CartLine } from "./CartDrawer";
import { ProductCard } from "./ProductCard";

type Props = {
  initialProducts: CatalogProduct[];
  onOrderCreated?: () => void;
};

const CART_STORAGE_KEY = "supersocio-cart-v1";

type StoredCartLine = { productId: string; quantity: number };

export function CatalogClient({ initialProducts, onOrderCreated }: Props) {
  const { user, getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q),
    );
  }, [initialProducts, query]);

  const count = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  useEffect(() => {
    if (!initialProducts.length) {
      setCartHydrated(true);
      return;
    }
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        setCartHydrated(true);
        return;
      }
      const saved = JSON.parse(raw) as StoredCartLine[];
      const byId = new Map(initialProducts.map((p) => [p.id, p]));
      const restored: CartLine[] = [];
      for (const row of saved) {
        const product = byId.get(row.productId);
        if (product && row.quantity > 0) {
          restored.push({ product, quantity: row.quantity });
        }
      }
      if (restored.length) setLines(restored);
    } catch {
      /* ignore corrupt storage */
    }
    setCartHydrated(true);
  }, [initialProducts]);

  useEffect(() => {
    if (!cartHydrated) return;
    const payload: StoredCartLine[] = lines.map((l) => ({
      productId: l.product.id,
      quantity: l.quantity,
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  }, [lines, cartHydrated]);

  function add(p: CatalogProduct) {
    if (!p.available) return;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === p.id);
      if (i === -1) return [...prev, { product: p, quantity: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + 1 };
      return next;
    });
  }

  function inc(id: string) {
    setLines((prev) =>
      prev.map((l) => (l.product.id === id ? { ...l, quantity: l.quantity + 1 } : l)),
    );
  }

  function dec(id: string) {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === id);
      if (i === -1) return prev;
      const l = prev[i];
      if (l.quantity <= 1) return prev.filter((_, j) => j !== i);
      return prev.map((x, j) => (j === i ? { ...x, quantity: x.quantity - 1 } : x));
    });
  }

  function remove(id: string) {
    setLines((prev) => prev.filter((l) => l.product.id !== id));
  }

  async function handleCheckout() {
    if (lines.length === 0) return;
    if (!user) {
      setCheckoutMessage("Inicia sesión en la pestaña Sesión para crear pedidos.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutMessage(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
      const order = await createOrder(token, {
        items: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      });
      setCheckoutMessage(
        `Pedido #${order.id.slice(0, 8)} creado sin pago. Ve a Mis pedidos para pagar.`,
      );
      setLines([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartOpen(false);
      onOrderCreated?.();
    } catch (e) {
      setCheckoutMessage(e instanceof Error ? e.message : "Error al crear pedido");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <>
      {initialProducts.length === 0 ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
          No hay productos: arranca el API con{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/60">
            cd api && npm run dev
          </code>
        </div>
      ) : null}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <ShoppingCart size={18} />
          Carrito
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1 text-[11px] font-bold text-white dark:bg-teal-500 dark:text-zinc-950">
              {count}
            </span>
          ) : null}
        </button>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Catálogo estimado
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Precios y existencias son referencia interna. El total se ajusta al validar el ticket en
        caja.
      </p>

      <label className="mt-6 block">
        <span className="sr-only">Buscar</span>
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none ring-teal-600/20 placeholder:text-zinc-400 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </label>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => add(p)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Sin resultados.</p>
      ) : null}

      <CartDrawer
        open={cartOpen}
        lines={lines}
        onClose={() => setCartOpen(false)}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutMessage={checkoutMessage}
      />
    </>
  );
}
