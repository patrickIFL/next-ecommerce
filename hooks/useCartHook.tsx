/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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

type AddToCartPayloadWithImage = AddToCartPayload & {
  image: string;
};


function useCartHook() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ================= ADD TO CART ================= */
  const { mutateAsync: handleAddToCart, isPending: addToCartLoading } =
    useMutation({
      mutationFn: async (payload: AddToCartPayloadWithImage) => {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      },
     onSuccess: (data, variables) => {
  queryClient.invalidateQueries({ queryKey: ["cartItems"] });


toast(() => (
  <div className="flex items-center gap-4">
    <Image
        src={variables.image}
        alt={data.cartItem.product.name}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover border border-border"
      />

  <span>
    Added to Cart!
  </span>
    <Button className="cursor-pointer" variant={"ghost"} onClick={() => router.push("/cart")}>
      View Cart
    </Button>
  </div>
));

},

      onError: (error: any) => toast.error(error.message),
    });

  /* ================= BUY NOW ================= */
  const { mutateAsync: handleBuyNow, isPending: buyNowLoading } = useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => router.push("/cart"),
    onError: (error: any) => toast.error(error.message),
  });

  /* ================= FETCH CART ================= */
  const {
    data: cartItems = [],
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useQuery<CartItem[]>({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await fetch("/api/cart/get", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return [];
      return data.cartItems;
    },
  });

  /* ================= UPDATE QUANTITY ================= */
  const { mutate: updateCartQuantity } = useMutation({
    mutationFn: async (data: { cartItemId: string; quantity: number }) => {
      const res = await fetch(`/api/cart/update/${data.cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: data.quantity }),
        credentials: "include",
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


