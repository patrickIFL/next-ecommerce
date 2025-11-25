'use client';
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StepBack, StepForward } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Product = {
  id: string;
  name: string;
  image: string[];
  offerPrice: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

const Cart = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
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

  const getCartTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price = item.product.offerPrice ?? 0;
      const qty = item.quantity ?? 0;
      return total + price * qty;
    }, 0);
  };

  return (
    <div className="mt-16 flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
          <p className="text-2xl md:text-3xl text-foreground/80">
            Your <span className="font-medium text-orange-600">Cart</span>
          </p>
          <p className="text-lg md:text-xl text-foreground/80">
            {cartItems.reduce((a, i) => a + i.quantity, 0)} Items
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left">
              <tr>
                <th className="pb-6 md:px-4 px-1 text-foreground font-medium">
                  Product Details
                </th>
                <th className="pb-6 md:px-4 px-1 text-foreground font-medium">Price</th>
                <th className="pb-6 md:px-4 px-1 text-foreground font-medium">Quantity</th>
                <th className="pb-6 md:px-4 px-1 text-foreground font-medium">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => {
                const product = item.product;

                return (
                  <tr key={item.id}>
                    <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                      <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                        <Image
                          src={product.image?.[0] ?? "/placeholder.png"}
                          alt={product.name}
                          className="w-16 h-auto object-cover"
                          width={1280}
                          height={720}
                        />
                      </div>

                      <div className="text-sm hidden md:block">
                        <p className="text-foreground">{product.name}</p>
                        <button
                          className="text-xs text-orange-600 mt-1 cursor-pointer hover:underline"
                          onClick={() =>
                            updateCartQuantity({
                              cartItemId: item.id,
                              quantity: 0,
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </td>

                    <td className="py-4 md:px-4 px-1 text-foreground/80">
                      ${product.offerPrice}
                    </td>

                    <td className="py-4 md:px-4 px-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartQuantity({
                              cartItemId: item.id,
                              quantity: Math.max(0, item.quantity - 1),
                            })
                          }
                        >
                          <StepBack size={16} />
                        </button>

                        <p className="text-foreground">{item.quantity}</p>

                        <button
                          onClick={() =>
                            updateCartQuantity({
                              cartItemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <StepForward size={16} />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 md:px-4 px-1 text-foreground">
                      ${(product.offerPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/all-products")}
          className="group flex items-center mt-6 gap-2 text-orange-600"
        >
          <Image
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
          />
          Continue Shopping
        </button>
      </div>

      <OrderSummary
        cartCount={cartItems.reduce((a, i) => a + i.quantity, 0)}
        cartAmount={getCartTotal(cartItems)}
      />
    </div>
  );
};

export default Cart;
