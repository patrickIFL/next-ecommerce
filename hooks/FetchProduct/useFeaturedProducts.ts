import { useQuery } from "@tanstack/react-query";

export function useFeaturedProducts() {
    const {data:featuredProducts, isLoading:featuredProductsLoading} = useQuery({
      queryKey: ["featured-products"],
      queryFn: async () => {
        const res = await fetch("/api/product/list/featured");
        const data = await res.json();
  
        if (!res.ok || !data.success) {
          throw new Error(data.message);
        }
  
        return data.products;
      },
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });
  return {
    featuredProducts,
    featuredProductsLoading
  }
}
