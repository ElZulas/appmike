import "dotenv/config";

const id = process.env.PAYPAL_CLIENT_ID?.trim() ?? "";
const secret = process.env.PAYPAL_CLIENT_SECRET?.trim() ?? "";
const mode = process.env.PAYPAL_MODE ?? "sandbox";
const base =
  mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const auth = Buffer.from(`${id}:${secret}`).toString("base64");
const res = await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

const body = await res.text();
console.log(`mode=${mode} status=${res.status}`);
console.log(body);
