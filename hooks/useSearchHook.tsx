import useSearchStore from "@/stores/useSearchStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
}

function useSearchHook(query?: string) {
  const router = useRouter();
  const { searchQuery: storeQuery } = useSearchStore();
  const queryParam = query ?? storeQuery;

  const { data: searchResults, isFetching: searchLoading, refetch: search } =
    useQuery({
      queryKey: ["searchResults"],
      queryFn: async () => {
        const res = await fetch(`/api/product/search?q=${queryParam}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load search data");
        }
        return data.results;
      },
      enabled: false,
      retry: false,
    });

  const handleSearch = async (q?: string) => {
    const searchVal = q ?? storeQuery;
    if (!searchVal.trim()) return;
    search();
    router.push(`/${searchVal}/products`);
  };

  return {
    searchResults,
    searchLoading,
    search,
    handleSearch,
  };
}


export default useSearchHook;