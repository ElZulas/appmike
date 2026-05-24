import "dotenv/config";
import cors from "cors";
import express from "express";
import { isFirebaseConfigured } from "./firebase.js";
import { requireAuth, type AuthedRequest } from "./middleware/auth.js";
import {
  capturePayPalOrder,
  confirmPayPalForOrder,
  createCheckoutForOrder,
  extractCaptureId,
  isPayPalConfigured,
} from "./services/paypal.js";
import {
  createOrder,
  getOrderById,
  listOrdersByUser,
  markOrderFullyPaid,
  savePayPalOrderId,
  setOrderDelivered,
} from "./services/orders.js";
import { processPayPalWebhook } from "./services/paymentWebhook.js";
import { listProducts } from "./services/products.js";
import { getUserProfile, upsertUserProfile, type UpsertProfileInput } from "./services/users.js";
import type { CreateOrderBody, SetDeliveredBody } from "./types.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());

function clientError(res: express.Response, message: string, status = 400) {
  res.status(status).json({ error: message });
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "super-socio-api",
    firestore: isFirebaseConfigured() ? "configured" : "not_configured",
    paypal: isPayPalConfigured() ? "configured" : "not_configured",
    paypalMode: process.env.PAYPAL_MODE ?? "sandbox",
  });
});

app.get("/v1/catalog/products", async (_req, res, next) => {
  try {
    res.json(await listProducts());
  } catch (err) {
    next(err);
  }
});

app.get("/v1/users/me", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.authUser!.uid;
    const email = req.authUser!.email ?? "";
    let profile = await getUserProfile(uid);
    if (!profile) {
      profile = await upsertUserProfile(uid, email, {});
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

app.patch("/v1/users/me", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.authUser!.uid;
    const email = req.authUser!.email ?? "";
    const profile = await upsertUserProfile(uid, email, req.body as UpsertProfileInput);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

app.get("/v1/orders", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    res.json(await listOrdersByUser(req.authUser!.uid));
  } catch (err) {
    next(err);
  }
});

app.post("/v1/orders", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const order = await createOrder(
      req.authUser!.uid,
      req.authUser!.email ?? "",
      req.body as CreateOrderBody,
    );
    res.status(201).json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear pedido";
    if (
      message.includes("requieren") ||
      message.includes("obligatorio") ||
      message.includes("debe incluir") ||
      message.includes("no encontrado") ||
      message.includes("sin stock") ||
      message.includes("perfil") ||
      message.includes("celular")
    ) {
      clientError(res, message);
      return;
    }
    next(err);
  }
});

app.get("/v1/orders/:id", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      clientError(res, "Pedido no encontrado", 404);
      return;
    }
    if (order.userId !== req.authUser!.uid) {
      clientError(res, "No autorizado", 403);
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

/** Crea orden de pago en PayPal y devuelve URL de aprobación. */
app.post("/v1/orders/:id/checkout", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isPayPalConfigured()) {
      clientError(res, "PayPal no está configurado en el servidor");
      return;
    }
    const order = await getOrderById(req.params.id);
    if (!order) {
      clientError(res, "Pedido no encontrado", 404);
      return;
    }
    if (order.userId !== req.authUser!.uid) {
      clientError(res, "No autorizado", 403);
      return;
    }
    if (order.fullyPaid) {
      clientError(res, "El pedido ya está pagado");
      return;
    }

    const checkout = await createCheckoutForOrder(order);
    await savePayPalOrderId(order.id, req.authUser!.uid, checkout.paypalOrderId);

    res.json({
      paypalOrderId: checkout.paypalOrderId,
      approvalUrl: checkout.approvalUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    clientError(res, message);
  }
});

/** Tras pagar con botones PayPal en el navegador (captura hecha por PayPal JS). */
app.post("/v1/orders/:id/confirm-paypal", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const paypalOrderId = String(req.body?.paypalOrderId ?? "");
    if (!paypalOrderId) {
      clientError(res, "paypalOrderId es obligatorio");
      return;
    }

    const order = await getOrderById(req.params.id);
    if (!order) {
      clientError(res, "Pedido no encontrado", 404);
      return;
    }
    if (order.userId !== req.authUser!.uid) {
      clientError(res, "No autorizado", 403);
      return;
    }
    if (order.fullyPaid) {
      res.json(order);
      return;
    }

    const check = await confirmPayPalForOrder(order.id, paypalOrderId);
    if (!check.verified) {
      clientError(res, `Pago PayPal aún no completado (estado: ${check.status})`);
      return;
    }

    const updated = await markOrderFullyPaid(order.id, {
      userId: req.authUser!.uid,
      method: "paypal",
      paypalOrderId,
    });
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    clientError(res, message);
  }
});

/** Captura el pago al volver de PayPal (query token = paypalOrderId). */
app.post("/v1/orders/:id/capture-paypal", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const paypalOrderId = String(req.body?.paypalOrderId ?? "");
    if (!paypalOrderId) {
      clientError(res, "paypalOrderId es obligatorio");
      return;
    }

    const order = await getOrderById(req.params.id);
    if (!order) {
      clientError(res, "Pedido no encontrado", 404);
      return;
    }
    if (order.userId !== req.authUser!.uid) {
      clientError(res, "No autorizado", 403);
      return;
    }
    if (order.fullyPaid) {
      res.json(order);
      return;
    }

    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== "COMPLETED") {
      clientError(res, "El pago aún no está completado en PayPal");
      return;
    }

    const updated = await markOrderFullyPaid(order.id, {
      userId: req.authUser!.uid,
      method: "paypal",
      paypalOrderId,
      paypalCaptureId: extractCaptureId(capture) ?? undefined,
    });
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    clientError(res, message);
  }
});

app.post("/v1/orders/:id/mark-paid", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (process.env.ALLOW_MANUAL_PAY !== "true") {
      clientError(res, "Pago manual deshabilitado. Usa PayPal.");
      return;
    }
    const order = await markOrderFullyPaid(req.params.id, {
      userId: req.authUser!.uid,
      method: "manual",
    });
    res.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    if (message.includes("no encontrado") || message.includes("autorizado")) {
      clientError(res, message);
      return;
    }
    next(err);
  }
});

app.patch("/v1/orders/:id/delivered", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    res.json(
      await setOrderDelivered(req.params.id, req.authUser!.uid, req.body as SetDeliveredBody),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    if (
      message.includes("no encontrado") ||
      message.includes("autorizado") ||
      message.includes("pagados")
    ) {
      clientError(res, message);
      return;
    }
    next(err);
  }
});

app.post("/v1/webhooks/paypal", async (req, res) => {
  try {
    await processPayPalWebhook(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook PayPal:", err);
    res.status(200).send("OK");
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(port, () => {
  const fs = isFirebaseConfigured() ? "Firestore conectado" : "sin Firestore";
  const pp = isPayPalConfigured() ? `PayPal (${process.env.PAYPAL_MODE ?? "sandbox"})` : "sin PayPal";
  console.log(`API http://localhost:${port} — ${fs} — ${pp}`);
});
