import { useQuery } from "@tanstack/react-query";

export function useProductsPage(page: number) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(`/api/product/list?page=${page}&limit=10`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      return data.products;
    },
    placeholderData: (previousData) => previousData, // ✅ v5 equivalent
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
