"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeSync } from "./ThemeSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme="light">
      <AuthProvider>
        <ThemeSync />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
