/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function useActionsProductHook() {
  const queryClient = useQueryClient();

  /* ================== HELPERS ================== */

  const updateProductInCache = (
    productId: string,
    updater: (p: any) => any
  ) => {
    queryClient.setQueryData<any[]>(["sellerProducts"], (old = []) =>
      old.map((p) => (p.id === productId ? updater(p) : p))
    );
  };

  /* ================== DELETE ================== */

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete product");
      }
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });

      const previous = queryClient.getQueryData(["sellerProducts"]);

      queryClient.setQueryData<any[]>(["sellerProducts"], (old = []) =>
        old.filter((p) => p.id !== productId)
      );

      return { previous };
    },

    onError: (err: any, _id, ctx) => {
      queryClient.setQueryData(["sellerProducts"], ctx?.previous);
      toast.error(err.message || "Delete failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  /* ================== ARCHIVE ================== */

  const archiveMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/product/toggle-archive/${productId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Archive failed");
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });

      const previous = queryClient.getQueryData(["sellerProducts"]);

      updateProductInCache(productId, (p) => ({
        ...p,
        isArchived: !p.isArchived,
      }));

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["sellerProducts"], ctx?.previous);
      toast.error("Failed to toggle archive");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  /* ================== SALE ================== */

  const saleMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/product/toggle-sale/${productId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Sale failed");
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });

      const previous = queryClient.getQueryData(["sellerProducts"]);

      updateProductInCache(productId, (p) => ({
        ...p,
        isOnSale: !p.isOnSale,
      }));

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["sellerProducts"], ctx?.previous);
      toast.error("Failed to toggle sale");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  /* ================== FEATURE ================== */

  const featureMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/product/toggle-featured/${productId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Feature failed");
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["sellerProducts"] });

      const previous = queryClient.getQueryData(["sellerProducts"]);

      updateProductInCache(productId, (p) => ({
        ...p,
        isFeatured: !p.isFeatured,
      }));

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(["sellerProducts"], ctx?.previous);
      toast.error("Failed to toggle featured");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });

  /* ================== RETURN ================== */

  return {

    // loading flags
    isDeleting: deleteMutation.isPending,
    isTogglingArchive: archiveMutation.isPending,
    isTogglingSale: saleMutation.isPending,
    isTogglingFeatured: featureMutation.isPending,

    // actions
    deleteProduct: deleteMutation.mutateAsync,
    toggleArchive: archiveMutation.mutateAsync,
    toggleSale: saleMutation.mutateAsync,
    toggleFeatured: featureMutation.mutateAsync,
  };
}

export default useActionsProductHook;
