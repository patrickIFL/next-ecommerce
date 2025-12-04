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

function useSearchHook() {
    const router = useRouter();
  const { searchQuery } = useSearchStore();

  const { data:searchResults, isFetching:searchLoading, refetch:search } = useQuery({
    queryKey: ["searchResults"],
    queryFn: async () => {
      const res = await fetch(`/api/product/search/${searchQuery}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load search data");
      }
      return data.results as Product[];
    },
    enabled: false,
    retry: false
  });

  const handleSearch = async () => {
    if(!searchQuery.trim() || searchQuery === "") return;
    search();
    router.push(`/${searchQuery}/products`)
}
  return {
    searchResults, 
    searchLoading,
    search,
    handleSearch
  };
}

export default useSearchHook;