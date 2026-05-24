import "dotenv/config";
import { isFirebaseConfigured } from "./firebase.js";
import { seedProductsFromSample } from "./services/products.js";

async function main() {
  if (!isFirebaseConfigured()) {
    console.error(
      "Falta configuración Firebase. Copia api/.env.example a api/.env y define las variables.",
    );
    process.exit(1);
  }

  const count = await seedProductsFromSample();
  console.log(`Listo: ${count} productos en Firestore (colección "products").`);
}

main().catch((err: { code?: number; message?: string }) => {
  console.error(err?.message ?? err);
  if (err?.code === 16 || String(err?.message).includes("UNAUTHENTICATED")) {
    console.error(
      "\nCredenciales inválidas o revocadas. Firebase Console → appmike → Configuración →",
      "Cuentas de servicio → Generar nueva clave → actualiza GOOGLE_APPLICATION_CREDENTIALS en api/.env",
    );
  }
  if (String(err?.message).includes("NOT_FOUND")) {
    console.error("\nCrea Firestore en la consola antes del seed (ver firebase/README.md).");
  }
  process.exit(1);
});
