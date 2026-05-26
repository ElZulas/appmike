"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  Moon,
  Receipt,
  Shield,
  Store,
  Sun,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileAppSection } from "@/components/MobileAppSection";
import { MobileDownloadBanner } from "@/components/MobileDownloadBanner";
import { APP_NAME } from "@/lib/brand";
import { useTheme } from "@/contexts/ThemeContext";

const features = [
  {
    icon: Store,
    title: "Club sin membresía",
    body: "Costco, Sam's y más — tu socio compra con su pase y te lo manda.",
  },
  {
    icon: Receipt,
    title: "Precio transparente",
    body: "Estimado en app + comisión desglosada. El ticket de caja manda al final.",
  },
  {
    icon: Clock,
    title: "Última milla en Mérida",
    body: "Geocerca, disponibilidad y entrega pensados para tu colonia.",
  },
  {
    icon: Shield,
    title: "Mandado legal",
    body: "Servicio de compra y entrega, no reventa rara ni catálogo robado.",
  },
];

export function LandingPage() {
  const { resolved, setTheme } = useTheme();
  const isLight = resolved === "light";

  return (
    <div
      className={
        isLight
          ? "relative min-h-full overflow-hidden bg-zinc-50 text-zinc-900"
          : "relative min-h-full overflow-hidden bg-zinc-950 text-zinc-50"
      }
    >
      <div
        className={`pointer-events-none absolute inset-0 ${isLight ? "opacity-90" : "opacity-60"}`}
        aria-hidden
        style={{
          background: isLight
            ? "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.2), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(16, 185, 129, 0.12), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(6, 182, 212, 0.08), transparent)"
            : "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(16, 185, 129, 0.2), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(6, 182, 212, 0.15), transparent)",
        }}
      />
      <div
        className={
          isLight
            ? "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]"
            : "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        }
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 flex-col gap-2 rounded-lg outline-none ring-teal-500/40 focus-visible:ring-2 sm:flex-row sm:items-center sm:gap-4"
        >
          <BrandLogo
            width={320}
            height={88}
            className="h-12 w-auto max-w-[min(320px,85vw)] object-contain sm:h-14 sm:max-w-[min(340px,70vw)]"
            priority
          />
          <span
            className={
              isLight
                ? "max-w-[16rem] text-lg font-black leading-tight tracking-tight text-zinc-900 sm:max-w-xs sm:text-xl"
                : "max-w-[16rem] text-lg font-black leading-tight tracking-tight text-white sm:max-w-xs sm:text-xl"
            }
          >
            {APP_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={
              isLight
                ? "rounded-full p-2.5 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900"
                : "rounded-full p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            }
            aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
          >
            {isLight ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
          </button>
          <Link
            href="/app?tab=session"
            className={
              isLight
                ? "rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 sm:px-4"
                : "rounded-full px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white sm:px-4"
            }
          >
            Iniciar sesión
          </Link>
          <a
            href="#app-movil"
            className={
              isLight
                ? "hidden rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 max-[480px]:inline"
                : "hidden rounded-full px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white max-[480px]:inline"
            }
          >
            App
          </a>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/25 transition hover:bg-teal-400 sm:gap-2"
          >
            Ir a la tienda
            <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-16">
          <p
            className={
              isLight
                ? "mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-800"
                : "mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-200"
            }
          >
            <MapPin size={14} />
            Mérida · mandado inteligente
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Que onda,{" "}
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-emerald-300 dark:to-cyan-300">
              ¿tu mandado?
            </span>
            , sin fila ni membresía.
          </h1>
          <p
            className={
              isLight
                ? "mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl"
                : "mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl"
            }
          >
            Arma tu carrito con precios estimados, un socio compra en el club y te lo deja en la puerta.
            Sin fotos raras de Costco en internet — catálogo propio, ticket manda.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 px-8 py-4 text-base font-bold text-zinc-950 shadow-xl shadow-teal-500/30 transition hover:scale-[1.02] hover:shadow-teal-400/40 active:scale-[0.98]"
            >
              Empezar a comprar
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/app?tab=session"
              className={
                isLight
                  ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-8 py-4 text-base font-bold text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
                  : "inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-600 bg-zinc-900/80 px-8 py-4 text-base font-bold text-zinc-100 backdrop-blur transition hover:border-zinc-500 hover:bg-zinc-800"
              }
            >
              Iniciar sesión
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className={
                isLight
                  ? "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                  : "rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-teal-500/30 hover:bg-zinc-900"
              }
            >
              <div
                className={
                  isLight
                    ? "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700"
                    : "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300"
                }
              >
                <Icon size={20} />
              </div>
              <h2
                className={
                  isLight ? "font-bold text-zinc-900" : "font-bold text-zinc-100"
                }
              >
                {title}
              </h2>
              <p
                className={
                  isLight
                    ? "mt-2 text-sm leading-relaxed text-zinc-600"
                    : "mt-2 text-sm leading-relaxed text-zinc-400"
                }
              >
                {body}
              </p>
            </article>
          ))}
        </section>

        <MobileAppSection landingSurface={isLight ? "light" : "dark"} />
      </main>

      <MobileDownloadBanner surface={isLight ? "light" : "dark"} />

      <footer
        className={
          isLight
            ? "relative z-10 border-b border-zinc-200 pb-24 pt-8 text-center text-sm text-zinc-500 sm:border-b-0 sm:pb-8"
            : "relative z-10 border-b border-zinc-800 pb-24 pt-8 text-center text-sm text-zinc-500 sm:border-b-0 sm:pb-8"
        }
      >
        {APP_NAME} · servicio de mandado · Mérida
      </footer>
    </div>
  );
}
