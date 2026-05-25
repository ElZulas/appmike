import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type admin from "firebase-admin";

const API_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function isFirebaseCredentialsConfigured(): boolean {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

/** Cuenta de servicio: JSON en env (Render), archivo local (.env) o FIREBASE_* sueltas. */
export function loadServiceAccount(): admin.ServiceAccount {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    return JSON.parse(inline) as admin.ServiceAccount;
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    const absolute = isAbsolute(credentialsPath)
      ? credentialsPath
      : resolve(API_ROOT, credentialsPath);
    return JSON.parse(readFileSync(absolute, "utf8")) as admin.ServiceAccount;
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    } as admin.ServiceAccount;
  }

  throw new Error(
    "Firebase no configurado. Usa GOOGLE_APPLICATION_CREDENTIALS (local), FIREBASE_SERVICE_ACCOUNT_JSON (Render) o FIREBASE_*.",
  );
}
