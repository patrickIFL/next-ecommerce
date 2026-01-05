import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "@/hooks/useProductHook";

export function useIndividualFetch(id: string) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductType>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/product/fetch/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load product");
      }

      return data.product;
    },
    enabled: !!id,
  });

  return {
    product,
    isLoading,
    error,
  };
}
