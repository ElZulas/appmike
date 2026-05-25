"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 ring-teal-600/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50";

type Props = {
  onBack: () => void;
};

export function ProfileEditor({ onBack }: Props) {
  const { user, profile, profileError, updateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName ?? "");
    setPhone(profile.phone ?? "");
    setDeliveryAddress(profile.deliveryAddress ?? "");
  }, [profile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        displayName,
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
      });
      setMessage("Perfil actualizado.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
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
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Editar perfil e información</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Correo: <strong>{profile?.email || user?.email}</strong> (no editable aquí)
      </p>

      {profileError ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          {profileError}{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => refreshProfile().catch(() => {})}
          >
            Reintentar
          </button>
        </p>
      ) : null}

      <form onSubmit={save} className="mt-6 max-w-md space-y-3">
        <input
          type="text"
          placeholder="Nombre"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={fieldClass}
        />
        <input
          type="tel"
          required
          placeholder="Celular"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />
        <textarea
          placeholder="Dirección de entrega"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          rows={3}
          className={fieldClass}
        />
        {message ? (
          <p className="text-sm text-teal-800 dark:text-teal-300">{message}</p>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
