import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useWishlist() {

  const queryClient = useQueryClient();
  const {getToken} = useAuth();
  
  const {data: wishlist = []} = useQuery<string[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/wishlist/get",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();
      return data.wishlist;
    },
  });

  const {mutateAsync: toggleWishlist, isPending} = useMutation({

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
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wishlist/toggle/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist");
      return productId;
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(
        ["wishlist"],
        context?.previousWishlist
      );
    },

  });;

  return {  
    wishlist,
    toggleWishlist,
    isPending
  };
}

