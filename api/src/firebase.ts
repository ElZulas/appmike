import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const API_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
import type { Auth } from "firebase-admin/auth";

let initialized = false;

/** `true` si hay credenciales para Firebase Admin. */
export function isFirebaseConfigured(): boolean {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirestore(): admin.firestore.Firestore {
  initFirebase();
  return admin.firestore();
}

export function getAuthAdmin(): Auth {
  initFirebase();
  return admin.auth();
}

function initFirebase(): void {
  if (initialized) return;

  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase no configurado. Define GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY en api/.env",
    );
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    const absolute = isAbsolute(credentialsPath)
      ? credentialsPath
      : resolve(API_ROOT, credentialsPath);
    const serviceAccount = JSON.parse(readFileSync(absolute, "utf8")) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
    });
  }

  initialized = true;
}
