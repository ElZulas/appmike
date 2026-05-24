/** Catálogo MVP (datos propios; precios estimados). */
export type CatalogProduct = {
  id: string;
  name: string;
  shortDescription: string;
  /** Nombre del icono para el cliente web (lucide). */
  categoryIcon: string;
  storePriceMxn: number;
  serviceFeeRate: number;
  available: boolean;
  highlightOffer?: boolean;
};

const rate = 0.12;

export const catalogProducts: CatalogProduct[] = [
  {
    id: "1",
    name: "Aceite vegetal 4 L",
    shortDescription: "Envase estándar club",
    categoryIcon: "UtensilsCrossed",
    storePriceMxn: 189,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "2",
    name: "Arroz blanco 10 kg",
    shortDescription: "Bolsa",
    categoryIcon: "Wheat",
    storePriceMxn: 298,
    serviceFeeRate: rate,
    available: true,
    highlightOffer: true,
  },
  {
    id: "3",
    name: "Papel higiénico 30 rollos",
    shortDescription: "Paquete familiar",
    categoryIcon: "Home",
    storePriceMxn: 429,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "4",
    name: "Agua purificada 24 botellas",
    shortDescription: "500 ml c/u",
    categoryIcon: "Droplets",
    storePriceMxn: 165,
    serviceFeeRate: rate,
    available: false,
  },
  {
    id: "5",
    name: "Pollo entero congelado",
    shortDescription: "Por kg aprox.",
    categoryIcon: "Drumstick",
    storePriceMxn: 95,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "6",
    name: "Leche entera 6 pack",
    shortDescription: "1 L c/u",
    categoryIcon: "Milk",
    storePriceMxn: 142,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "7",
    name: "Huevo blanco 30 pzas",
    shortDescription: "Charola",
    categoryIcon: "Egg",
    storePriceMxn: 118,
    serviceFeeRate: rate,
    available: true,
    highlightOffer: true,
  },
  {
    id: "8",
    name: "Detergente líquido 4.43 L",
    shortDescription: "Concentrado",
    categoryIcon: "Sparkles",
    storePriceMxn: 389,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "9",
    name: "Servilletas 12 paquetes",
    shortDescription: "Cocina",
    categoryIcon: "Layers",
    storePriceMxn: 249,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "10",
    name: "Café molido 1.36 kg",
    shortDescription: "Bolsa",
    categoryIcon: "Coffee",
    storePriceMxn: 312,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "11",
    name: "Pan integral 2 bolsas",
    shortDescription: "Congelable",
    categoryIcon: "Sandwich",
    storePriceMxn: 89,
    serviceFeeRate: rate,
    available: true,
  },
  {
    id: "12",
    name: "Pilas alcalinas AA 48 pzas",
    shortDescription: "Multipack",
    categoryIcon: "Battery",
    storePriceMxn: 519,
    serviceFeeRate: rate,
    available: true,
  },
];
