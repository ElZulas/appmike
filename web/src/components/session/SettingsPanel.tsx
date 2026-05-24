"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { ThemeSetting } from "@/lib/users";

type Props = {
  onBack: () => void;
};

export function SettingsPanel({ onBack }: Props) {
  const { profile, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(
    profile?.settings.notificationsEnabled ?? true,
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        settings: {
          theme,
          notificationsEnabled: notifications,
        },
      });
      setMessage("Configuración guardada.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function onThemeChange(t: ThemeSetting) {
    setTheme(t);
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-300"
      >
        <ArrowLeft size={16} /> Volver
      </button>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Configuración</h3>

      <div className="mt-6 max-w-md space-y-6">
        <section>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tema</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onThemeChange(t)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  theme === t
                    ? "bg-teal-800 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                {t === "light" ? "Claro" : t === "dark" ? "Oscuro" : "Sistema"}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Notificaciones</h4>
          <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-600 dark:bg-zinc-800">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-200">
              Recibir avisos de pedido (próximamente push/email)
            </span>
          </label>
        </section>

        {message ? <p className="text-sm text-teal-800 dark:text-teal-300">{message}</p> : null}

        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
