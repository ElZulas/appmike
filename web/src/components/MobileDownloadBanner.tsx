"use client";

import { Download, Smartphone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const APK_PATH = "/downloads/super-socio.apk";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

type Props = {
  surface?: "light" | "dark";
};

export function MobileDownloadBanner({ surface = "dark" }: Props) {
  const [visible, setVisible] = useState(false);
  const [android, setAndroid] = useState(false);
  const L = surface === "light";

  useEffect(() => {
    setVisible(isMobileDevice());
    setAndroid(isAndroid());
  }, []);

  if (!visible) return null;

  return (
    <div
      className={
        L
          ? "fixed inset-x-0 bottom-0 z-50 border-t border-teal-200 bg-white/95 p-4 shadow-2xl shadow-zinc-300/40 backdrop-blur-md sm:hidden"
          : "fixed inset-x-0 bottom-0 z-50 border-t border-teal-500/40 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md sm:hidden"
      }
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        className={
          L
            ? "absolute right-3 top-3 rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            : "absolute right-3 top-3 rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        }
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <div
          className={
            L
              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700"
              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300"
          }
        >
          <Smartphone size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={
              L ? "text-sm font-bold text-zinc-900" : "text-sm font-bold text-zinc-50"
            }
          >
            ¿En el celular?
          </p>
          <p
            className={
              L ? "mt-0.5 text-xs text-zinc-600" : "mt-0.5 text-xs text-zinc-400"
            }
          >
            {android
              ? "Descarga la app Android (APK) o sigue en la web."
              : "Usa la tienda web o descarga en Android."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {android ? (
              <a
                href={APK_PATH}
                download
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-zinc-950"
              >
                <Download size={16} />
                Descargar APK
              </a>
            ) : null}
            <Link
              href="/app"
              className={
                L
                  ? "inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800"
                  : "inline-flex items-center rounded-xl border border-zinc-600 px-4 py-2.5 text-xs font-semibold text-zinc-200"
              }
            >
              Abrir tienda web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
