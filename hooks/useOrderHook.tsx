/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import useCartHook from "./useCartHook";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import useAddressStore from "@/stores/useAddressStore";
import { useToast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice: number;
  image: string[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  province: string;
  city: string;
  area: string;
  zipcode: string;
}

export interface Order {
  id: string;
  userId: string;
  shippingAddressId: string | null;

  amount: number;
  isPaid: boolean;
  shippingMethod: string;
  orderDate: string; // ISO date string returned by Prisma

  // user: UserData;
  shippingAddress: Address | null;
  items: OrderItem[];
}

function useOrderHook() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();
  const { cartItems } = useCartHook();
  const { selectedAddressId } = useAddressStore()

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async () => {
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart Empty");
      }

      if (!selectedAddressId) {
        throw new Error("Undefined Address");
      }

      const token = await getToken();

      // 🔐 Send variant-aware payload
      const payload = {
        selectedAddressId,
        platform: "web",
        items: cartItems.map((item) => ({
          productId: item.product,
          variantId: item.variant ?? null, // ✅ nullable
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.message || "Failed to create order");
      }

      return res.json();
    },

    onSuccess: (data) => {
      if (!data.checkoutUrl) {
        throw new Error("Invalid Checkout URL");
      }
      router.push(data.checkoutUrl);
    },

    onError: (error: any) => {
      let description = "";

      if (error.message === "Cart Empty") {
        description = "Your cart is empty.";
      } else if (error.message === "Undefined Address") {
        description = "Please select a shipping address.";
      }

      toast({
        title: error.message,
        description,
        variant: "destructive",
      });
    },
  });

  const { data: myOrders, isLoading: myOrdersLoading, refetch: refetchMyOrders, isRefetching: isRefetchingMyOrders } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await fetch("/api/order/fetch")
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }
      return data.orders;
    }
  })
  return {
    placeOrder,
    isPending,
    myOrders,
    myOrdersLoading,
    refetchMyOrders,
    isRefetchingMyOrders
  }
}

export default useOrderHook