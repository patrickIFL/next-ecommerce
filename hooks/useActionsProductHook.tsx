/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function useActionsProductHook({ product }: { product: any }) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleArchive = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-archive/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Archive failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  const toggleSale = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-sale/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Sale failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-featured/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Feature failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  return {
    // ✅ DERIVED STATE (single source of truth)
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    onSale: product.isOnSale,

    // loading states
    isDeleting,
    isTogglingArchive: toggleArchive.isPending,
    isTogglingSale: toggleSale.isPending,
    isTogglingFeatured: toggleFeatured.isPending,

    // actions
    deleteProduct,
    toggleArchive: toggleArchive.mutateAsync,
    toggleSale: toggleSale.mutateAsync,
    toggleFeatured: toggleFeatured.mutateAsync,
  };
}

export default useActionsProductHook;
