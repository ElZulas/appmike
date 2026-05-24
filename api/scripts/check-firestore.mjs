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

const credPath = resolveCredentialsPath(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const hasEnvVars =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (!credPath && !hasEnvVars) {
  console.error("❌ Falta GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_* en api/.env");
  process.exit(1);
}

try {
  if (credPath) {
    const sa = JSON.parse(readFileSync(credPath, "utf8"));
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    console.log(`✓ Credenciales: ${credPath}`);
    console.log(`  Proyecto: ${sa.project_id}`);
    console.log(`  Cuenta: ${sa.client_email}`);
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log(`✓ Credenciales por variables (proyecto ${process.env.FIREBASE_PROJECT_ID})`);
  }

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
