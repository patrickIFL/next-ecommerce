import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useWishlist() {
  return useQuery<string[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist/get");
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();
      return data.wishlist;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wishlist/toggle/${productId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist");
      return productId;
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist =
        queryClient.getQueryData<string[]>(["wishlist"]) || [];

      queryClient.setQueryData<string[]>(["wishlist"], (old = []) =>
        old.includes(productId)
          ? old.filter(id => id !== productId)
          : [...old, productId]
      );

      return { previousWishlist };
    },

    onError: (_err, _productId, context) => {
      queryClient.setQueryData(
        ["wishlist"],
        context?.previousWishlist
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

