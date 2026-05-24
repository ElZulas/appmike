"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  Receipt,
  Shield,
  Smartphone,
  Sparkles,
  Store,
} from "lucide-react";

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
  return (
    <div className="relative min-h-full overflow-hidden bg-zinc-950 text-zinc-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(16, 185, 129, 0.2), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(6, 182, 212, 0.15), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
            <Sparkles size={18} />
          </span>
          SuperSocio
        </span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/app?tab=session"
            className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/25 transition hover:bg-teal-400"
          >
            Ir a la tienda
            <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-200">
            <MapPin size={14} />
            Mérida · mandado inteligente
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            ¿Qué pedo?{" "}
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Tu mandado
            </span>
            , sin fila ni membresía.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-600 bg-zinc-900/80 px-8 py-4 text-base font-bold text-zinc-100 backdrop-blur transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-teal-500/30 hover:bg-zinc-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                <Icon size={20} />
              </div>
              <h2 className="font-bold text-zinc-100">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
            </article>
          ))}
        </section>

        <section
          id="app-movil"
          className="border-t border-zinc-800/80 bg-zinc-900/40 py-20 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 text-center sm:px-6 lg:flex-row lg:text-left">
            <div className="flex-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/25 lg:mx-0">
                <Smartphone size={28} />
              </div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Llévalo en el bolsillo</h2>
              <p className="mt-4 max-w-xl text-zinc-400 lg:mx-0">
                La app Flutter ya está en marcha: mismo catálogo, carrito y flujo que la web. Mientras
                publicamos en tiendas, compila desde <code className="text-teal-300">mobile/</code> o pide
                el APK de prueba al equipo.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-4 opacity-90 transition hover:border-zinc-500"
                aria-disabled
                title="Próximamente en Google Play"
              >
                <span className="text-left">
                  <span className="block text-[10px] uppercase tracking-wide text-zinc-500">
                    Próximamente
                  </span>
                  <span className="text-lg font-bold">Google Play</span>
                </span>
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 px-6 py-4 opacity-90 transition hover:border-zinc-500"
                aria-disabled
                title="Próximamente en App Store"
              >
                <span className="text-left">
                  <span className="block text-[10px] uppercase tracking-wide text-zinc-500">
                    Próximamente
                  </span>
                  <span className="text-lg font-bold">App Store</span>
                </span>
              </a>
              <p className="text-xs text-zinc-500">
                Desarrollo:{" "}
                <code className="text-zinc-400">cd mobile && flutter run --dart-define=API_BASE_URL=…</code>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        SuperSocio · servicio de mandado · Mérida
      </footer>
    </div>
  );
}
