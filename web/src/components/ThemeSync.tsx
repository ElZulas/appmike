"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

/** Aplica el tema guardado en el perfil del usuario. */
export function ThemeSync() {
  const { profile } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (profile?.settings?.theme) {
      setTheme(profile.settings.theme);
    }
  }, [profile?.settings?.theme, setTheme]);

  return null;
}
