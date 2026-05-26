"use client";

import { Download, Smartphone } from "lucide-react";
import { APP_NAME } from "@/lib/brand";
import { useEffect, useState } from "react";

const APK_PATH = "/downloads/super-socio.apk";

type Props = {
  /** Apariencia cuando esta sección está en la landing (sigue al tema de la página). */
  landingSurface?: "light" | "dark";
};

export function MobileAppSection({ landingSurface = "dark" }: Props) {
  const [android, setAndroid] = useState(false);
  const [mobile, setMobile] = useState(false);
  const L = landingSurface === "light";

  useEffect(() => {
    const ua = navigator.userAgent;
    setMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(ua));
    setAndroid(/Android/i.test(ua));
  }, []);

  return (
    <section
      id="app-movil"
      className={
        L
          ? "border-t border-teal-100 bg-gradient-to-b from-white to-teal-50/40 py-20"
          : "border-t border-zinc-800/80 bg-zinc-900/40 py-20 backdrop-blur-sm"
      }
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex-1 text-center lg:text-left">
            <div
              className={
                L
                  ? "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 ring-1 ring-teal-200/80 lg:mx-0"
                  : "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/25 lg:mx-0"
              }
            >
              <Smartphone size={28} />
            </div>
            <h2
              className={
                L
                  ? "text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl"
                  : "text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl"
              }
            >
              App móvil {APP_NAME}
            </h2>
            <p
              className={
                L
                  ? "mt-4 max-w-xl text-zinc-600 lg:mx-0"
                  : "mt-4 max-w-xl text-zinc-400 lg:mx-0"
              }
            >
              Mismo catálogo y carrito que la web, optimizado para Android. Si abres esta página desde tu
              celular, instala el APK y listo.
            </p>
            {mobile && !android ? (
              <p
                className={
                  L ? "mt-3 text-sm text-amber-800" : "mt-3 text-sm text-amber-200/90"
                }
              >
                En iPhone usa la tienda web por ahora; la app en App Store viene después.
              </p>
            ) : null}
          </div>

          <div className="w-full max-w-md space-y-4">
            <a
              href={APK_PATH}
              download
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 px-6 py-5 text-lg font-bold text-zinc-950 shadow-lg shadow-teal-500/25 transition hover:scale-[1.01]"
            >
              <Download size={22} />
              Descargar APK (Android)
            </a>

            <div
              className={
                L
                  ? "rounded-2xl border border-zinc-200 bg-white p-5 text-left text-sm text-zinc-600 shadow-sm"
                  : "rounded-2xl border border-zinc-700 bg-zinc-950/80 p-5 text-left text-sm text-zinc-400"
              }
            >
              <p
                className={
                  L ? "font-semibold text-zinc-900" : "font-semibold text-zinc-200"
                }
              >
                Instalación en Android
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Descarga el archivo.</li>
                <li>
                  Si el navegador pregunta, permite{" "}
                  <strong className={L ? "text-zinc-800" : "text-zinc-300"}>
                    instalar apps desconocidas
                  </strong>{" "}
                  para Chrome o tu gestor de archivos.
                </li>
                <li>Abre el APK y confirma instalar.</li>
                <li>La app ya apunta a la API en producción (Render).</li>
              </ol>
            </div>

            <p
              className={
                L
                  ? "text-center text-xs text-zinc-500 lg:text-left"
                  : "text-center text-xs text-zinc-500 lg:text-left"
              }
            >
              Google Play y App Store · próximamente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
