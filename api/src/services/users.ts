import { getFirestore, isFirebaseConfigured } from "../firebase.js";

export type ThemeSetting = "light" | "dark" | "system";

export type UserSettings = {
  theme: ThemeSetting;
  notificationsEnabled: boolean;
};

export type UserProfile = {
  uid: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  displayName: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
};

const COLLECTION = "users";

const defaultSettings = (): UserSettings => ({
  theme: "system",
  notificationsEnabled: true,
});

function parseDate(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date(value as string | number).toISOString();
}

function docToProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const settings = (data.settings as Record<string, unknown>) ?? {};
  return {
    uid,
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    deliveryAddress: String(data.deliveryAddress ?? ""),
    displayName: String(data.displayName ?? ""),
    settings: {
      theme: (settings.theme as ThemeSetting) ?? "system",
      notificationsEnabled: settings.notificationsEnabled !== false,
    },
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured()) return null;
  const doc = await getFirestore().collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return docToProfile(doc.id, doc.data() as Record<string, unknown>);
}

export type UpsertProfileInput = {
  phone?: string;
  deliveryAddress?: string;
  displayName?: string;
  settings?: Partial<UserSettings>;
};

export async function upsertUserProfile(
  uid: string,
  email: string,
  input: UpsertProfileInput,
): Promise<UserProfile> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firestore no configurado");
  }

  const ref = getFirestore().collection(COLLECTION).doc(uid);
  const existing = await ref.get();
  const now = new Date();

  if (!existing.exists) {
    const created = {
      email,
      phone: input.phone ?? "",
      deliveryAddress: input.deliveryAddress ?? "",
      displayName: input.displayName ?? "",
      settings: { ...defaultSettings(), ...input.settings },
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(created);
    return docToProfile(uid, created as unknown as Record<string, unknown>);
  }

  const prev = existing.data() as Record<string, unknown>;
  const prevSettings = (prev.settings as Record<string, unknown>) ?? {};
  const merged = {
    email,
    phone: input.phone !== undefined ? input.phone : String(prev.phone ?? ""),
    deliveryAddress:
      input.deliveryAddress !== undefined
        ? input.deliveryAddress
        : String(prev.deliveryAddress ?? ""),
    displayName:
      input.displayName !== undefined ? input.displayName : String(prev.displayName ?? ""),
    settings: {
      theme: input.settings?.theme ?? prevSettings.theme ?? "system",
      notificationsEnabled:
        input.settings?.notificationsEnabled ?? prevSettings.notificationsEnabled !== false,
    },
    createdAt: prev.createdAt ?? now,
    updatedAt: now,
  };

  await ref.set(merged, { merge: true });
  return docToProfile(uid, merged as unknown as Record<string, unknown>);
}

export function assertProfileComplete(profile: UserProfile): void {
  if (!profile.phone?.trim()) {
    throw new Error("Agrega tu número de celular en Sesión → Editar perfil");
  }
}
