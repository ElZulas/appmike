"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-teal-600/20 focus:ring-4 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50";

type Mode = "login" | "register";

type Props = {
  mode?: Mode;
  title?: string;
  onSuccess?: () => void;
};

export function AuthForm({ mode: initialMode = "login", title, onSuccess }: Props) {
  const { login, register, firebaseReady } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!firebaseReady) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
        Falta configurar Firebase en <code className="text-xs">web/.env.local</code> (variables{" "}
        <code className="text-xs">NEXT_PUBLIC_FIREBASE_*</code>). Consúltalas en Firebase Console →
        Configuración del proyecto → Tu app web.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!phone.trim()) {
          throw new Error("El número de celular es obligatorio");
        }
        await register({
          email,
          password,
          phone: phone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          displayName: displayName.trim(),
        });
      }
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      setError(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {title ? <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3> : null}

      <div className="mb-4 flex gap-1 rounded-lg bg-zinc-200/80 p-1 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-2 text-sm font-semibold ${
            mode === "login"
              ? "bg-white text-teal-900 shadow-sm dark:bg-zinc-700 dark:text-teal-100"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md py-2 text-sm font-semibold ${
            mode === "register"
              ? "bg-white text-teal-900 shadow-sm dark:bg-zinc-700 dark:text-teal-100"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" ? (
          <input
            type="text"
            placeholder="Nombre (opcional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={fieldClass}
          />
        ) : null}

        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />

        {mode === "register" ? (
          <>
            <input
              type="tel"
              required
              placeholder="Celular (10 dígitos)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
            <input
              type="text"
              placeholder="Dirección de entrega (opcional por ahora)"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className={fieldClass}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              La dirección puedes completarla después en Editar perfil. El celular se guarda en cada
              pedido para aclaraciones.
            </p>
          </>
        ) : null}

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-teal-800 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60 dark:bg-teal-700 dark:hover:bg-teal-600"
        >
          {loading ? "Espera…" : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
