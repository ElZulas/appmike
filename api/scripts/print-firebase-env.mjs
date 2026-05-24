/**
 * Lee el JSON de cuenta de servicio y muestra variables para pegar en Render.
 * Uso (desde api/): npm run env:firebase
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? resolve(root, process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : null;

if (!credPath) {
  console.error("Define GOOGLE_APPLICATION_CREDENTIALS en api/.env apuntando al JSON.");
  process.exit(1);
}

const json = JSON.parse(readFileSync(credPath, "utf8"));
const privateKey = String(json.private_key).replace(/\n/g, "\\n");

console.log("\nPega esto en Render → Environment (no uses GOOGLE_APPLICATION_CREDENTIALS ahí):\n");
console.log(`FIREBASE_PROJECT_ID=${json.project_id}`);
console.log(`FIREBASE_CLIENT_EMAIL=${json.client_email}`);
console.log(`FIREBASE_PRIVATE_KEY="${privateKey}"`);
console.log("");
