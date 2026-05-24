"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeSetting } from "@/lib/users";

type ThemeContextValue = {
  theme: ThemeSetting;
  setTheme: (t: ThemeSetting) => void;
  resolved: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: ThemeSetting): "light" | "dark" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({
  children,
  initialTheme = "system",
}: {
  children: ReactNode;
  initialTheme?: ThemeSetting;
}) {
  const [theme, setThemeState] = useState<ThemeSetting>(initialTheme);
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  const setTheme = useCallback((t: ThemeSetting) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("super_socio_theme", t);
    }
  }, []);

  useEffect(() => {
    const r = resolveTheme(theme);
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = () => setResolved(resolveTheme("system"));
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, resolved }), [theme, setTheme, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
