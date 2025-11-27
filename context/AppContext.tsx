"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useAuth, useUser } from "@clerk/nextjs";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
}

export interface UserData {
  name: string;
  email: string;
  image?: string;
}

type CartProduct = {
  id: string;
  name: string;
  image: string[];
  offerPrice: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

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

export type CartItems = Record<string, number>;

export interface AppContextType {
  user: any;
  currency: string;

  isSeller: boolean;
  setIsSeller: (value: boolean) => void;

  products: Product[];
  userData: UserData | null;

  handleAddToCart: (productId: string) => Promise<void>;
  handleBuyNow: (productId: string) => Promise<void>;

  cartItems: CartItem[];
  refetchCart: () => void;

  isLoading: boolean;
  updateCartQuantity: (data: { cartItemId: string; quantity: number }) => void;
  getCartTotal: (items: CartItem[]) => number;
  addAddress: (address: any) => void,
  addAddressLoading: boolean,

  addresses: Address[];
  addressesLoading: boolean,
  setSelectedAddressId: (id: string | null) => void
  refetchAddress: () => void
}


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return ctx;
};

interface ProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: ProviderProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const currency =
    process.env.NEXT_PUBLIC_CURRENCY === "PHP" ? "₱" : "";

  const [isSeller, setIsSeller] = useState<boolean>(false);

  const { mutateAsync: handleAddToCart } = useMutation({
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

  const { mutateAsync: handleBuyNow } = useMutation({
    mutationFn: async (productId: string) => {
      await handleAddToCart(productId);
    },
    onSuccess: () => router.push("/checkout"),
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/product/list");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load products");
      }
      return data.products as Product[];
    },
  });

  const { mutate: addAddress, isPending: addAddressLoading } = useMutation({
    mutationFn: async (address) => {
      const token = await getToken()
      const res = await fetch("/api/user/add-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data.message)
      toast({
        title: "✅ Success",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      console.log(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { data: addresses = [], refetch: refetchAddress, isRefetching: addressesLoading }
    = useQuery({
      queryKey: ["addresses"],
      queryFn: async () => {
        const token = await getToken();
        const res = await fetch("/api/user/get-address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load user data");
        }

        return data.addresses as Address[];
      },
    });

  const { data: userData } = useQuery({
    queryKey: ["userData", user?.id],
    enabled: !!user, // prevents running before login
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load user data");
      }

      toast({
        title: "👋 Welcome",
        description: `Hello, ${data.user.name}`,
      });

      return data.user as UserData;
    },
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

  const { mutate: placeOrder } = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) {
        throw new Error("No address selected");
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
        const err = await res.text();
        throw new Error(err || "Failed to create order");
      }

      return res.json();
    },

    onSuccess: (data) => {
      console.log("Order created:", data);
    },

    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });


  const getCartTotal: any = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price = item.product.offerPrice ?? 0;
      const qty = item.quantity ?? 0;
      return total + price * qty;
    }, 0);
  };

  const value: AppContextType = {
    user,
    currency,

    isSeller,
    setIsSeller,

    products,
    userData: userData ?? null,

    handleAddToCart,
    handleBuyNow,

    getCartTotal,
    cartItems,
    refetchCart,
    isLoading,
    updateCartQuantity,
    addAddress,
    addAddressLoading,

    addresses,
    addressesLoading,
    setSelectedAddressId,
    refetchAddress

  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
