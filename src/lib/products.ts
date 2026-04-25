import sofa from "@/assets/product-sofa.jpg";
import table from "@/assets/product-table.jpg";
import umbrella from "@/assets/product-umbrella.jpg";
import lights from "@/assets/product-lights.jpg";
import plant from "@/assets/product-plant.jpg";
import decking from "@/assets/product-decking.jpg";
import pergola from "@/assets/product-pergola.jpg";
import chair from "@/assets/product-chair.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "sofa-modular",
    name: "Sofá modular de exterior Naterial Odyssea",
    brand: "Naterial",
    price: 499,
    oldPrice: 649,
    image: sofa,
    category: "Sofás de exterior",
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: "table-teca",
    name: "Mesa de jardín de madera de teca Solis 200x100",
    brand: "Naterial",
    price: 329,
    image: table,
    category: "Mesas de jardín",
    rating: 4.7,
    reviews: 87,
    inStock: true,
  },
  {
    id: "umbrella-aluminio",
    name: "Parasol de aluminio inclinable Ø 300 cm beige",
    brand: "Naterial",
    price: 119,
    oldPrice: 159,
    image: umbrella,
    category: "Parasoles",
    rating: 4.3,
    reviews: 215,
    inStock: true,
  },
  {
    id: "lights-string",
    name: "Guirnalda luminosa exterior 10 m 20 bombillas LED",
    brand: "Inspire",
    price: 24.95,
    image: lights,
    category: "Iluminación exterior",
    rating: 4.6,
    reviews: 432,
    inStock: true,
  },
  {
    id: "plant-olivo",
    name: "Olivo en maceta de terracota Ø 35 cm",
    brand: "Vivero",
    price: 79,
    image: plant,
    category: "Plantas y jardín",
    rating: 4.4,
    reviews: 64,
    inStock: true,
  },
  {
    id: "decking-composite",
    name: "Tarima sintética composite color teca 1 m²",
    brand: "Blooma",
    price: 39.5,
    oldPrice: 49,
    image: decking,
    category: "Suelos exterior",
    rating: 4.2,
    reviews: 311,
    inStock: true,
  },
  {
    id: "pergola-aluminio",
    name: "Pérgola de aluminio bioclimática 3x3 m blanca",
    brand: "Naterial",
    price: 1299,
    image: pergola,
    category: "Pérgolas",
    rating: 4.8,
    reviews: 42,
    inStock: true,
  },
  {
    id: "chair-rattan",
    name: "Sillón de ratán sintético con cojín Marbella",
    brand: "Naterial",
    price: 159,
    oldPrice: 199,
    image: chair,
    category: "Sillones de exterior",
    rating: 4.5,
    reviews: 176,
    inStock: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
