/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type CartProduct = {
  id: string;
  name: string;
  image: string[];
  salePrice: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

export type CartItems = Record<string, number>;

function useCartHook() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: handleAddToCart, isPending: addToCartLoading } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      return data;
    },
    onSuccess: () => {
      toast({
        title: "✅ Added to Cart",
        description: "Product successfully added to cart.",
      });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { mutateAsync: handleBuyNow, isPending: buyNowLoading } = useMutation({
    mutationFn: async (productId: string) => {
      await handleAddToCart(productId);
    },
    onSuccess: () => router.push("/cart"),
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { data: cartItems = [], isLoading, refetch: refetchCart } = useQuery<CartItem[]>({
    queryKey: ['cartItems'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/cart/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return [];
      return data.cartItems as CartItem[];
    },
  });

  const { mutate: updateCartQuantity } = useMutation({
    mutationFn: async (data: { cartItemId: string; quantity: number }) => {
      const token = await getToken();
      const res = await fetch(`/api/cart/update/${data.cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: data.quantity }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });

  const getCartTotal: any = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price = item.product.salePrice ?? 0;
      const qty = item.quantity ?? 0;
      return total + price * qty;
    }, 0);
  };

  return {
    handleAddToCart,
    handleBuyNow,
    cartItems,
    isLoading,
    refetchCart,
    updateCartQuantity,
    getCartTotal,
    addToCartLoading,
    buyNowLoading
  }
}

export default useCartHook