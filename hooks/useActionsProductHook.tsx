/* eslint-disable @typescript-eslint/no-explicit-any */

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function useActionsProduct({product}: {product: any}) {
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const [onSale, setOnSale] = useState(product.isOnSale);
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();


  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed Delete product");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { mutateAsync: toggleArchive, isPending: isTogglingArchive } = useMutation({
      mutationFn: async (productId: string) => {
        const token = await getToken();
        const res = await fetch(`/api/product/toggle-archive/${productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to toggle archive product");
        return data;
      },
      onSuccess: (data: any) => {
        // Update local state immediately
        setIsArchived(data.product.isArchived);

        // Optionally, refresh the query so other components stay in sync
        queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
      },
      onError: (error: any) =>
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        }),
    });

  const { mutateAsync: toggleSale, isPending: isTogglingSale } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-sale/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to toggle archive product");
      return data;
    },
    onSuccess: (data: any) => {
      // Update local state immediately
      setOnSale(data.product.isOnSale);

      // Optionally, refresh the query so other components stay in sync
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { mutateAsync: toggleFeatured, isPending: isTogglingFeatured } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-featured/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to toggle archive product");
      return data;
    },
    onSuccess: (data: any) => {
      // Update local state immediately
      setIsFeatured(data.product.isFeatured);

      // Optionally, refresh the query so other components stay in sync
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });
  return {
    isFeatured, 
    isArchived, 
    onSale, 
    isDeleting, 
    isTogglingArchive, 
    isTogglingSale, 
    isTogglingFeatured, 

    deleteProduct, 
    toggleArchive, 
    toggleSale, 
    toggleFeatured
  }
}

export default useActionsProduct