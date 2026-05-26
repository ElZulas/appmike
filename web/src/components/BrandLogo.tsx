"use client";

import Image from "next/image";
import {
  APP_NAME,
  BRAND_LOGO_DARK_BG,
  BRAND_LOGO_LIGHT_BG,
} from "@/lib/brand";
import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

/** Selecciona logo claro u oscuro según el tema resuelto (html `dark`). */
export function BrandLogo({
  className = "",
  width = 320,
  height = 88,
  priority = false,
}: Props) {
  const { resolved } = useTheme();
  const src = resolved === "dark" ? BRAND_LOGO_DARK_BG : BRAND_LOGO_LIGHT_BG;

  return (
    <Image
      src={src}
      alt={APP_NAME}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
