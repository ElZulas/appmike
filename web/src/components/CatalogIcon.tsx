import type { LucideIcon } from "lucide-react";
import {
  Battery,
  Coffee,
  Droplets,
  Drumstick,
  Egg,
  Home,
  Layers,
  Milk,
  Package,
  Sandwich,
  Sparkles,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Wheat,
  Home,
  Droplets,
  Drumstick,
  Milk,
  Egg,
  Sparkles,
  Layers,
  Coffee,
  Sandwich,
  Battery,
};

export function CatalogIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Package;
  return <Icon className={className} size={26} strokeWidth={1.75} />;
}
