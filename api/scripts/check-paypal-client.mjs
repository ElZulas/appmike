/**
 * Valida que PayPal reconozca tu Client ID (mismo error que en el navegador).
 * Uso: node scripts/check-paypal-client.mjs
 */
import "dotenv/config";

const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
if (!clientId) {
  console.error("Falta PAYPAL_CLIENT_ID en api/.env");
  process.exit(1);
}

const params = new URLSearchParams({
  "client-id": clientId,
  currency: "MXN",
  intent: "capture",
  components: "buttons",
});

const url = `https://www.paypal.com/sdk/js?${params}`;
console.log("Comprobando Client ID con PayPal…");
console.log("(primeros 20 chars)", clientId.slice(0, 20) + "…");

const res = await fetch(url);
const text = await res.text();

if (res.ok && text.includes("paypal")) {
  console.log("OK — PayPal reconoce este Client ID. Reinicia la web (npm run dev).");
  process.exit(0);
}

console.error("FALLO — PayPal NO reconoce este Client ID.");
console.error("Crea una app NUEVA en https://developer.paypal.com/dashboard/applications/sandbox");
console.error("Copia el Client ID con el botón copiar y pégalo en api/.env y web/.env.local");
if (text.includes("not recognized")) {
  console.error("\nRespuesta PayPal:", text.slice(0, 300));
}
process.exit(1);
