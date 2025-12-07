import { useQuery } from "@tanstack/react-query";

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
}

function useProductHook() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/product/list");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load products");
      }
      return data.products as Product[];
    },
  });

  return {
    products,
    productsLoading,
  };
}

export default useProductHook;
