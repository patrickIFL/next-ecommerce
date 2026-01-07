export type Variant = {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  imageIndex: number;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  image: string[];
  variations?: string[];
  search_keys?: string[];
  sku?: string;
  stock?: number;
  isOnSale: boolean;
  variants: Variant[];
}

export type ProductType = {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  category: string;
  brand: string;
  image: string[];
  search_keys: string[];
  isOnSale: boolean;
  variants: Variant[];
  type: "SIMPLE" | "VARIATION";
  stock?: number | null;
  attributes: string[];
};

export type VariationsMap = {
  varA?: string[] | null;
  varB?: string[] | null;
};