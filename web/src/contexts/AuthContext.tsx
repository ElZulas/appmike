"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchMyProfile, updateMyProfile } from "@/lib/api";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/users";

type RegisterInput = {
  email: string;
  password: string;
  phone: string;
  deliveryAddress?: string;
  displayName?: string;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Parameters<typeof updateMyProfile>[1]) => Promise<UserProfile>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseClientConfigured();

  const loadProfile = useCallback(async (u: User) => {
    const token = await u.getIdToken();
    const p = await fetchMyProfile(token);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await loadProfile(u);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, [firebaseReady, loadProfile]);

  const getToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
    const token = await cred.user.getIdToken();
    const p = await updateMyProfile(token, {
      phone: input.phone,
      deliveryAddress: input.deliveryAddress ?? "",
      displayName: input.displayName ?? "",
    });
    setProfile(p);
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user);
  }, [user, loadProfile]);

  const updateProfileFn = useCallback(
    async (data: Parameters<typeof updateMyProfile>[1]) => {
      const token = await getToken();
      if (!token) throw new Error("No autenticado");
      const p = await updateMyProfile(token, data);
      setProfile(p);
      return p;
    },
    [getToken],
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      firebaseReady,
      getToken,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile: updateProfileFn,
    }),
    [
      user,
      profile,
      loading,
      firebaseReady,
      getToken,
      login,
      register,
      logout,
      refreshProfile,
      updateProfileFn,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
