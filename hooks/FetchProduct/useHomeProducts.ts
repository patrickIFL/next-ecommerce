import { useQuery } from "@tanstack/react-query";

export function useHomeProducts() {
    const {data:homeProducts, isLoading:homeProductsLoading} = useQuery({
      queryKey: ["home-products"],
      queryFn: async () => {
        const res = await fetch("/api/product/list/home-products");
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
    homeProducts,
    homeProductsLoading
  }
}
