/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type CartProduct = {
  id: string;
  name: string;
  image: string[];
  price: number;
  salePrice: number | null;
  isOnSale: boolean;
};

type CartVariant = {
  id: string;
  name: string;
  price: number | null;
  salePrice: number | null;
  stock: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
  variant?: CartVariant | null;
};

type AddToCartPayload = {
  productId: string;
  variantId?: string;
  quantity: number;
};

function useCartHook() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ================= ADD TO CART ================= */
  const { mutateAsync: handleAddToCart, isPending: addToCartLoading } =
    useMutation({
      mutationFn: async (payload: AddToCartPayload) => {
        const token = await getToken();

        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        toast({
          title: "Added to cart",
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

  /* ================= BUY NOW ================= */
  const { mutateAsync: handleBuyNow, isPending: buyNowLoading } = useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      const token = await getToken();

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => router.push("/cart"),
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  /* ================= FETCH CART ================= */
  const {
    data: cartItems = [],
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useQuery<CartItem[]>({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/cart/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return [];
      return data.cartItems;
    },
  });

  /* ================= UPDATE QUANTITY ================= */
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

  /* ================= TOTAL ================= */
  const getCartTotal = (items: CartItem[]) =>
    items.reduce((total, item) => {
      const price = item.variant
        ? item.product.isOnSale
          ? item.variant.salePrice ?? item.variant.price
          : item.variant.price
        : item.product.isOnSale
        ? item.product.salePrice ?? item.product.price
        : item.product.price;

      return total + (price ?? 0) * item.quantity;
    }, 0);

  return {
    handleAddToCart,
    handleBuyNow,
    cartItems,
    cartLoading,
    refetchCart,
    updateCartQuantity,
    getCartTotal,
    addToCartLoading,
    buyNowLoading,
  };
}

export default useCartHook;
