// types/cart.ts

export interface CartProduct {
  id: string;
  name: string;
  image: string[];
  price: number;
  salePrice?: number | null;
  isOnSale: boolean;
}

export interface CartVariant {
  id: string;
  name: string;
  price?: number | null;
  salePrice?: number | null;
  stock: number;
  imageIndex: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
  variant?: CartVariant | null;
}
