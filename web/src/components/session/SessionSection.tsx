"use client";

import {
  LogOut,
  RefreshCw,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileEditor } from "./ProfileEditor";
import { SettingsPanel } from "./SettingsPanel";

type View = "home" | "profile" | "settings" | "switch";

export function SessionSection() {
  const { user, profile, profileError, loading, logout, refreshProfile } = useAuth();
  const [view, setView] = useState<View>("home");
  const [retrying, setRetrying] = useState(false);

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Cargando sesión…</p>;
  }

  if (view === "profile" && user) {
    return <ProfileEditor onBack={() => setView("home")} />;
  }

  if (view === "settings" && user) {
    return <SettingsPanel onBack={() => setView("home")} />;
  }

  if (view === "switch") {
    return (
      <div>
        <AuthForm
          mode="login"
          title="Cambiar sesión"
          onSuccess={() => setView("home")}
        />
        <button
          type="button"
          onClick={() => setView("home")}
          className="mt-4 text-sm text-zinc-600 underline dark:text-zinc-400"
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sesión
        </h2>
        <p className="mt-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Regístrate o inicia sesión para crear pedidos. Necesitas correo, contraseña y celular.
        </p>
        <AuthForm onSuccess={() => setView("home")} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Sesión
      </h2>

      {profileError ? (
        <div className="mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <p>{profileError}</p>
          <button
            type="button"
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              try {
                await refreshProfile();
              } catch {
                /* profileError ya actualizado */
              } finally {
                setRetrying(false);
              }
            }}
            className="mt-2 font-semibold underline disabled:opacity-60"
          >
            {retrying ? "Reintentando…" : "Reintentar cargar perfil"}
          </button>
        </div>
      ) : null}

      <div className="mt-6 max-w-md rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-start gap-3">
          <UserCircle className="shrink-0 text-teal-700 dark:text-teal-400" size={40} />
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              {profile?.displayName || user.displayName || "Usuario"}
            </p>
            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {profile?.email || user.email}
            </p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              Cel: {profile?.phone || "—"}
            </p>
            {profile?.deliveryAddress ? (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {profile.deliveryAddress}
              </p>
            ) : (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                Sin dirección de entrega — agrégala en Editar perfil
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="mt-6 flex max-w-md flex-col gap-2">
        <SessionButton icon={User} label="Editar perfil e información" onClick={() => setView("profile")} />
        <SessionButton icon={Settings} label="Configuración" onClick={() => setView("settings")} />
        <SessionButton
          icon={RefreshCw}
          label="Cambiar sesión"
          onClick={async () => {
            await logout();
            setView("switch");
          }}
        />
        <SessionButton
          icon={LogOut}
          label="Cerrar sesión"
          variant="danger"
          onClick={() => logout()}
        />
      </nav>
    </div>
  );
}

function SessionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: typeof User;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        variant === "danger"
          ? "border-red-200 bg-red-50 text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
