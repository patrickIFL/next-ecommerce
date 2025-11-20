"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ---------------------------
   TYPES
----------------------------*/

// Product type (adjust fields to match your dummy data)
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
}

// User type (adjust as needed)
export interface UserData {
  name: string;
  email: string;
  image?: string;
}

// Cart: itemId -> quantity
export type CartItems = Record<string, number>;

/* ---------------------------
   CONTEXT VALUE TYPE
----------------------------*/

export interface AppContextType {
  user: any;
  currency: string;

  isSeller: boolean;
  setIsSeller: (value: boolean) => void;

  products: Product[];
  fetchProductData: () => Promise<void>;

  userData: UserData | null;
  fetchUserData: () => Promise<void>;

  cartItems: CartItems;
  setCartItems: (items: CartItems) => void;

  addToCart: (id: string) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;

  getCartCount: () => number;
  getCartAmount: () => number;
}

/* ---------------------------
   CREATE CONTEXT
----------------------------*/

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return ctx;
};

/* ---------------------------
   PROVIDER
----------------------------*/

interface ProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: ProviderProps) => {
  const { user } = useUser();

  const currency =
    process.env.NEXT_PUBLIC_CURRENCY === "PHP" ? "₱" : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItems>({});

  /* ---------------------------
      DATA FETCHING
   ----------------------------*/
  const fetchProductData = async () => {
    setProducts(productsDummyData as Product[]);
  };

 const fetchUserData = async () => {
    setUserData(userDummyData as UserData);
}


  /* ---------------------------
      CART FUNCTIONS
   ----------------------------*/

  const addToCart = async (itemId: string) => {
    const cart = { ...cartItems };
    cart[itemId] = (cart[itemId] || 0) + 1;
    setCartItems(cart);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const cart = { ...cartItems };

    if (quantity === 0) delete cart[itemId];
    else cart[itemId] = quantity;

    setCartItems(cart);
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) {
        total += product.offerPrice * cartItems[id];
      }
    }
    return Number(total.toFixed(2));
  };

  /* ---------------------------
      EFFECTS
   ----------------------------*/
  useEffect(() => {
  const load = async () => {
    await Promise.all([
      fetchProductData(),
      fetchUserData()
    ]);
  };
  load();
}, [user]);


/* ---------------------------
      CONTEXT VALUE
   ----------------------------*/
  const value: AppContextType = {
    user,
    currency,

    isSeller,
    setIsSeller,

    products,
    fetchProductData,

    userData,
    fetchUserData,

    cartItems,
    setCartItems,

    addToCart,
    updateCartQuantity,

    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
