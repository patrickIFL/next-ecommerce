// ==========================
// Core Domain Types
// ==========================

export type ImageList = string[];

export interface BaseProduct {
  id: string;
  name: string;
  image: ImageList;
  price: number;
  salePrice?: number | null;
  isOnSale: boolean;
}

export interface PersistedVariant {
  id: string;
  name: string;
  price: number | null;
  salePrice: number | null;
  stock: number;
  imageIndex?: number | null;
  costPrice: number | null;
}


export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};


// ==========================
// Cart Types
// ==========================

export interface CartItem {
  id: string;
  quantity: number;
  product: BaseProduct;
  variant?: PersistedVariant | null;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface AddToCartPayloadWithImage extends AddToCartPayload {
  image: string;
}

// ==========================
// Product Types
// ==========================

export interface Variant extends PersistedVariant {
  imageIndex: number | null;
}


export interface Product {
  id: string;
  name: string;
  description: string | null; // ✅ matches Prisma
  category: string;
  brand: string;
  sku?: string | null;
  image: ImageList;
  price: number | null;
  salePrice?: number | null;
  stock?: number | null;
  isOnSale: boolean | null;
  search_keys?: string[];
  variants: Variant[];
  type: string;
  attributes: string[];
}

export interface ProductType extends Product {
  type: "SIMPLE" | "VARIATION";
  attributes: string[];
}

// ==========================
// Variations
// ==========================

export type VariationsMap = {
  varA?: string[] | null;
  varB?: string[] | null;
};

export type Variation = {
  id?: string;
  name: string;
  sku: string;

  // MUST be string-only
  price: string;
  salePrice?: string | null;
  stock: string;

  imageIndex: number;
  isNew?: boolean;
};


export type VariationComboBoxProps = {
  variantName: string;
  variants: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
};

export type Supplier = {
  id: string;
  name: string;
  type: string;
  externalId?: string | null;
};
