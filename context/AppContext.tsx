"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/

import { productsDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from 'axios';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useToast } from '@/components/ui/use-toast'

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
  const { getToken } = useAuth();
  const { toast } = useToast()

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
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products as Product[]);
      }
      else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive'
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  };

  const fetchUserData = async () => {
    const token = await getToken();
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
        toast({
          title: '👋 Welcome',
          description: `Hello, ${data.user.name}`,
          variant: 'default'
        })
      }
      else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive'
        })
      }
      // fix tanstack functions
      // currently, it runs on use effect

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
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
