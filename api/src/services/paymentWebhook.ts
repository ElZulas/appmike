import { capturePayPalOrder, extractCaptureId, extractOrderIdFromCapture } from "./paypal.js";
import { markOrderFullyPaid } from "./orders.js";

/** PayPal webhook (PAYMENT.CAPTURE.COMPLETED, etc.) */
export async function processPayPalWebhook(body: unknown): Promise<void> {
  const payload = body as Record<string, unknown>;
  const eventType = String(payload.event_type ?? "");

  if (eventType === "CHECKOUT.ORDER.APPROVED") {
    const resource = payload.resource as { id?: string } | undefined;
    if (resource?.id) {
      const capture = await capturePayPalOrder(resource.id);
      const orderId = extractOrderIdFromCapture(capture);
      if (orderId && capture.status === "COMPLETED") {
        await markOrderFullyPaid(orderId, {
          method: "paypal",
          paypalOrderId: resource.id,
          paypalCaptureId: extractCaptureId(capture) ?? undefined,
        });
      }
    }
    return;
  }

  if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
    const resource = payload.resource as { id?: string; custom_id?: string } | undefined;
    const orderId = resource?.custom_id;
    if (orderId) {
      await markOrderFullyPaid(orderId, {
        method: "paypal",
        paypalCaptureId: resource?.id,
      });
    }
  }
}
