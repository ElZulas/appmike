import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function resolveCredentialsPath(raw) {
  if (!raw) return null;
  return isAbsolute(raw) ? raw : resolve(apiRoot, raw);
}

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) return JSON.parse(inline);

  const credPath = resolveCredentialsPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (credPath) return JSON.parse(readFileSync(credPath, "utf8"));

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  return null;
}

const sa = loadServiceAccount();
if (!sa) {
  console.error(
    "❌ Falta Firebase: GOOGLE_APPLICATION_CREDENTIALS (local), FIREBASE_SERVICE_ACCOUNT_JSON (Render) o FIREBASE_*",
  );
  process.exit(1);
}

try {
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
    console.log("✓ Credenciales: FIREBASE_SERVICE_ACCOUNT_JSON");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log(`✓ Credenciales: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  } else {
    console.log(`✓ Credenciales por variables (proyecto ${sa.project_id})`);
  }
  console.log(`  Proyecto: ${sa.project_id}`);
  console.log(`  Cuenta: ${sa.client_email}`);

  const db = admin.firestore();
  const snap = await db.collection("products").limit(1).get();
  console.log(`✓ Firestore responde (${snap.size} doc de muestra en products)`);
  console.log("\nSiguiente paso: npm run seed");
} catch (err) {
  const code = err?.code ?? err?.details;
  console.error("\n❌ No se pudo conectar a Firestore:");
  console.error(err?.message ?? err);
  if (String(code).includes("UNAUTHENTICATED") || err?.code === 16) {
    console.error(
      "\n→ Genera una NUEVA clave en Firebase Console → Configuración → Cuentas de servicio.",
    );
  }
  if (String(err?.message).includes("NOT_FOUND")) {
    console.error("\n→ Crea la base Firestore en la consola (Build → Firestore → Crear).");
  }
  process.exit(1);
}
