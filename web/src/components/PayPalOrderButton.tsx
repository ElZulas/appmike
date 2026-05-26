"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/brand";
import { confirmPayPalPayment } from "@/lib/api";
import type { Order } from "@/lib/orders";

const clientId = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "").trim();

type Props = {
  order: Order;
  onPaid: () => void;
  onError: (message: string) => void;
};

function PayPalLoadError() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-xs leading-relaxed text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
      <p className="font-semibold">PayPal no reconoce tu Client ID</p>
      <p className="mt-1">
        En{" "}
        <a
          className="underline"
          href="https://developer.paypal.com/dashboard/applications/sandbox"
          target="_blank"
          rel="noreferrer"
        >
          developer.paypal.com
        </a>{" "}
        crea una app <strong>nueva</strong> (Sandbox), copia el Client ID con el botón copiar y
        pégalo en <code className="rounded bg-red-100 px-1">api/.env</code> y{" "}
        <code className="rounded bg-red-100 px-1">web/.env.local</code> (mismo valor). Reinicia
        API y web.
      </p>
      <p className="mt-1 text-red-700 dark:text-red-300">
        Verifica: <code className="rounded bg-red-100 px-1">cd api && npm run check:paypal-client</code>
      </p>
    </div>
  );
}

function Buttons({ order, onPaid, onError }: Props) {
  const [{ isResolved, isRejected }] = usePayPalScriptReducer();
  const { getToken } = useAuth();
  const amount =
    order.amountDueMxn > 0 ? order.amountDueMxn : order.totalEstimatedMxn;

  if (isRejected) {
    return <PayPalLoadError />;
  }

  if (!isResolved) {
    return <p className="text-xs text-zinc-500">Cargando PayPal…</p>;
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
      disabled={amount <= 0}
      createOrder={(_data, actions) =>
        actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: order.id,
              description: `Pedido ${APP_NAME} #${order.id.slice(0, 8)}`,
              amount: {
                currency_code: "MXN",
                value: amount.toFixed(2),
              },
            },
          ],
        })
      }
      onApprove={async (data, actions) => {
        try {
          await actions.order?.capture();
          const token = await getToken();
          if (!token) throw new Error("Sesión expirada");
          await confirmPayPalPayment(token, order.id, data.orderID);
          onPaid();
        } catch (e) {
          onError(e instanceof Error ? e.message : "No se completó el pago");
        }
      }}
      onError={() => onError("PayPal canceló o falló el pago")}
    />
  );
}

export function PayPalOrderButton(props: Props) {
  if (!clientId) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Falta NEXT_PUBLIC_PAYPAL_CLIENT_ID en web/.env.local
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "MXN",
        intent: "capture",
        components: "buttons",
      }}
    >
      <Buttons {...props} />
    </PayPalScriptProvider>
  );
}
