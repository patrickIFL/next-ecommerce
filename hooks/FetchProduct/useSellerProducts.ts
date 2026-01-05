import useUserStore from "@/stores/useUserStore";
import { useQuery } from "@tanstack/react-query";

export function useSellerProducts() {
  const { isSeller } = useUserStore();

  return useQuery({
    queryKey: ["sellerProducts"],
    enabled: isSeller,
    queryFn: async () => {
      const res = await fetch("/api/product/seller-list", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      return data.products;
    },
  });
}
