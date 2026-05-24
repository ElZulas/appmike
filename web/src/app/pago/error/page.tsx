import Link from "next/link";

export default function PagoErrorPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Pago no completado</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Puedes intentar de nuevo desde Mis pedidos.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
