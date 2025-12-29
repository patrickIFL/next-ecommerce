/* eslint-disable @typescript-eslint/no-explicit-any*/
import useUserStore from "@/stores/useUserStore";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  price: number;
  salePrice?: number | null;
  category: string;
  image: string[];
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

function useProductHook() {
  const { getToken } = useAuth();
  const {isSeller } = useUserStore();

  const { data: products = [], isLoading: productsLoading } = useQuery<
    ProductType[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/product/list");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load products");
      }

      return data.products;
    },
  });

  const { data: sellerProducts, isLoading: sellerProductsIsLoading } = useQuery<
    ProductType[]
  >({
    queryKey: ["sellerProducts"],
    enabled: isSeller,
    queryFn: async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/product/seller-list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.success) {
          toast.error(data.message);
          return [];
        }

        return data.products;
      } catch (error: any) {
        toast.error(error.message);
        return [];
      }
    },
  });

  return {
    products,
    productsLoading,
    sellerProducts,
    sellerProductsIsLoading,
  };
}

export default useProductHook;
