"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";
import { AppShell } from "./AppShell";

type Tab = "catalog" | "orders" | "session";

function parseTab(value: string | null): Tab {
  if (value === "orders" || value === "session") return value;
  return "catalog";
}

type Props = {
  initialProducts: CatalogProduct[];
};

export function AppShellClient({ initialProducts }: Props) {
  const searchParams = useSearchParams();
  const [initialTab] = useState(() => parseTab(searchParams.get("tab")));

  return <AppShell initialProducts={initialProducts} initialTab={initialTab} />;
}
