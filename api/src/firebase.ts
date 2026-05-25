import admin from "firebase-admin";
import type { Auth } from "firebase-admin/auth";
import { isFirebaseCredentialsConfigured, loadServiceAccount } from "./firebaseCredentials.js";

let initialized = false;

export function isFirebaseConfigured(): boolean {
  return isFirebaseCredentialsConfigured();
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
      "Firebase no configurado. Local: GOOGLE_APPLICATION_CREDENTIALS en api/.env. Render: FIREBASE_SERVICE_ACCOUNT_JSON con el JSON completo.",
    );
  }
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
  });
  initialized = true;
}
