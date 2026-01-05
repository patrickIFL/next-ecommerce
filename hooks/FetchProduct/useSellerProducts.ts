/* eslint-disable @typescript-eslint/no-explicit-any*/
import { ProductType } from "@/lib/types";
import useUserStore from "@/stores/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function useSellerProducts() {
  const { isSeller } = useUserStore();

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
    sellerProducts,
    sellerProductsIsLoading,
  };
}

export default useSellerProducts;
