import { useQuery } from "@tanstack/react-query";

export function useWishlistedProductsPage(page: number) {
  return useQuery({
    queryKey: ["sellerProductsWishlisted", page],
    queryFn: async () => {
      const res = await fetch(`/api/product/list/wishlist?page=${page}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      return data; // { products, pagination }
    },
  });
}
