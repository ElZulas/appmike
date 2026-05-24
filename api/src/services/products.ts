import type { CatalogProduct } from "../types.js";
import { getFirestore, isFirebaseConfigured } from "../firebase.js";
import { catalogProducts } from "../catalogData.js";

const COLLECTION = "products";

function docToProduct(id: string, data: Record<string, unknown>): CatalogProduct {
  return {
    id,
    name: String(data.name ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    categoryIcon: String(data.categoryIcon ?? "Package"),
    storePriceMxn: Number(data.storePriceMxn ?? 0),
    serviceFeeRate: Number(data.serviceFeeRate ?? 0.12),
    available: Boolean(data.available ?? true),
    highlightOffer: data.highlightOffer === true,
    active: data.active !== false,
  };
}

/** Lista productos activos desde Firestore, o datos locales si Firebase no está configurado. */
export async function listProducts(): Promise<CatalogProduct[]> {
  if (!isFirebaseConfigured()) {
    return catalogProducts;
  }

  const snap = await getFirestore().collection(COLLECTION).get();

  if (snap.empty) {
    return [];
  }

  return snap.docs
    .map((d) => docToProduct(d.id, d.data() as Record<string, unknown>))
    .filter((p) => p.active !== false)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getProductById(id: string): Promise<CatalogProduct | null> {
  if (!isFirebaseConfigured()) {
    return catalogProducts.find((p) => p.id === id) ?? null;
  }

  const doc = await getFirestore().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  const p = docToProduct(doc.id, doc.data()!);
  if (p.active === false) return null;
  return p;
}

/** Carga el catálogo de ejemplo en Firestore (id del documento = id del producto). */
export async function seedProductsFromSample(): Promise<number> {
  if (!isFirebaseConfigured()) {
    throw new Error("Configura Firebase antes de ejecutar el seed.");
  }

  const db = getFirestore();
  const batch = db.batch();
  const now = new Date();

  for (const p of catalogProducts) {
    const ref = db.collection(COLLECTION).doc(p.id);
    batch.set(ref, {
      name: p.name,
      shortDescription: p.shortDescription,
      categoryIcon: p.categoryIcon,
      storePriceMxn: p.storePriceMxn,
      serviceFeeRate: p.serviceFeeRate,
      available: p.available,
      highlightOffer: p.highlightOffer ?? false,
      active: true,
      updatedAt: now,
    });
  }

  await batch.commit();
  return catalogProducts.length;
}
