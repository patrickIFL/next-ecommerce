import { ProductType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type SellerProductsResponse = {
  products: ProductType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export default function useSellerProducts({
  sellerId,
  page,
}: {
  sellerId: string;
  page: number;
}) {
  const { data, isLoading: sellerProductsIsLoading } =
    useQuery<SellerProductsResponse>({
      queryKey: ["sellerProducts", sellerId, page],
      queryFn: async () => {
        const res = await fetch(
          `/api/product/seller-list/${sellerId}?page=${page}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message);
        }

        return data;
      },
      staleTime: 1000 * 60 * 5,
      placeholderData: (previousData) => previousData,
    });

  return {
    sellerProducts: data?.products ?? [],
    pagination: data?.pagination,
    sellerProductsIsLoading,
  };
}
