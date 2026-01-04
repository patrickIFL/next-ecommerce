/* eslint-disable @typescript-eslint/no-explicit-any*/
import useUserStore from "@/stores/useUserStore";
import { useQuery } from "@tanstack/react-query";
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
  const { isSeller } = useUserStore();

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
        const res = await fetch("/api/product/seller-list", {
          method: "GET",
          credentials: "include", // safe to include if you use cookies elsewhere
        });

        if (!res.ok) {
          throw new Error("Failed to fetch seller products");
        }

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message);
          return [];
        }

        return data.products as ProductType[];
      } catch (error: any) {
        toast.error(error.message ?? "Something went wrong");
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
