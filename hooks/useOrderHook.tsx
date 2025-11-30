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
  offerPrice: number;
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

  const { mutate: placeOrder } = useMutation({
    mutationFn: async () => {
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart Empty");
      }

      if (!selectedAddressId) {
        throw new Error("Undefined Address");
      }

      const token = await getToken();

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ selectedAddressId }),
      });

      if (!res.ok) {
        let errorJson: any = null;
        try {
          errorJson = await res.json();
        } catch { }

        throw new Error(errorJson?.message || "Failed to create order");
      }
      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      const { checkoutUrl } = data;
      if (checkoutUrl) {
        router.push(checkoutUrl);
      }
      else {
        throw new Error("Invalid Checkout URL");
      }
    },

    onError: (error) => {
      let message: string = "";
      if (error.message === "Cart Empty") { message = "Your Cart is empty." }
      else if (error.message === "Undefined Address") { message = "Select address or add a new one to proceed" }
      toast({
        title: error.message,
        description: message,
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
    myOrders,
    myOrdersLoading,
    refetchMyOrders,
    isRefetchingMyOrders
  }
}

export default useOrderHook