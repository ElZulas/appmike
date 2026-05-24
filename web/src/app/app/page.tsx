import { Suspense } from "react";
import { AppShellClient } from "@/components/AppShellClient";
import type { CatalogProduct } from "@/lib/catalog";

async function loadCatalog(): Promise<CatalogProduct[]> {
  const base = process.env.API_BASE_URL ?? "http://127.0.0.1:4000";
  try {
    const res = await fetch(`${base}/v1/catalog/products`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return (await res.json()) as CatalogProduct[];
  } catch {
    return [];
  }
}

export default async function AppPage() {
  const products = await loadCatalog();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
          Cargando tienda…
        </div>
      }
    >
      <AppShellClient initialProducts={products} />
    </Suspense>
  );
}
