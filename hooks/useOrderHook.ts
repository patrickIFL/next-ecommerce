/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import useCartHook from "./useCartHook";
import { useRouter } from "next/navigation";
import useAddressStore from "@/stores/useAddressStore";
import { toast } from "react-hot-toast";
// import { OrderItem } from "@/src/generated/prisma";
import { OrderItem } from "@/lib/types";

function useOrderHook() {
  const router = useRouter();
  const { cartItems } = useCartHook();
  const { selectedAddressId } = useAddressStore()

  const { mutate: placeOrder, isPending:isPlacingOrder } = useMutation({
    mutationFn: async () => {
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart Empty");
      }

      if (!selectedAddressId) {
        throw new Error("Undefined Address");
      }
      // 🔐 Send variant-aware payload
      const payload = {
        selectedAddressId,
        platform: "web",
        items: cartItems.map((item) => ({
          productId: item.product.id, // from item.product
          variantId: item.variant ?? null,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
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

      toast.error(description || error.message);
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

  const { mutate: orderItemAdvance } = useMutation({
  mutationFn: async (orderItemId: string) => {
    const res = await fetch("/api/order-item/advance", {
      method: "POST",
      body: JSON.stringify({ orderItemId }),
    })

    if (!res.ok) throw new Error("Failed")
  },
})


  type OrderCategory = "PENDING" | "TO_SHIP" | "TO_RECEIVE" | "TO_RATE"

function deriveCategory(items: OrderItem[]): OrderCategory {
  if (items.some(i => i.fulfillmentStatus === "AWAITING_CONFIRMATION")) {
    return "PENDING"
  }

  if (items.some(i =>
    ["PREPARING", "READY_FOR_PICKUP"].includes(i.fulfillmentStatus)
  )) {
    return "TO_SHIP"
  }

  if (items.some(i =>
    ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(i.fulfillmentStatus)
  )) {
    return "TO_RECEIVE"
  }

  return "TO_RATE"
}

// src/services/orderItem.service.ts

  return {
    placeOrder,
    isPlacingOrder,
    myOrders,
    myOrdersLoading,
    refetchMyOrders,
    isRefetchingMyOrders,

    orderItemAdvance,
    deriveCategory
  }
}

export default useOrderHook