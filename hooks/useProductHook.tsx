import { useQuery } from '@tanstack/react-query';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
}

function useProductHook() {

  const { data: products = [] } = useQuery({
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
  }
}

export default useProductHook