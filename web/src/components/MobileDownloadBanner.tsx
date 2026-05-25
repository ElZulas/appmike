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

export function MobileDownloadBanner() {
  const [visible, setVisible] = useState(false);
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    setVisible(isMobileDevice());
    setAndroid(isAndroid());
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-teal-500/40 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md sm:hidden">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        aria-label="Cerrar"
      >
        <X size={18} />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
          <Smartphone size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-zinc-50">¿En el celular?</p>
          <p className="mt-0.5 text-xs text-zinc-400">
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
              className="inline-flex items-center rounded-xl border border-zinc-600 px-4 py-2.5 text-xs font-semibold text-zinc-200"
            >
              Abrir tienda web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
