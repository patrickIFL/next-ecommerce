import { useQuery } from "@tanstack/react-query";

function useCategoryHook() {
   const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/product/categories");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load categories");
      }
      return json.data;
    },
  });

  return {
    categories, categoriesLoading
  }
}

export default useCategoryHook