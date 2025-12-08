'use client';

import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartCard from "@/components/CartCard";
import { useEffect } from "react";
import useCartHook from "@/hooks/useCartHook";
import { MoveLeft } from "lucide-react";

const Cart = () => {
  const router = useRouter();
  const { cartItems, refetchCart, getCartTotal } = useCartHook();

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const cartAmount = getCartTotal(cartItems);

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  // todo: to optimize the use of functions, create a edit button just like the mobile app.

  return (
    <div className="mt-16 flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
          <p className="text-2xl md:text-3xl text-foreground/80">
            Your <span className="font-medium text-primary">Cart</span>
          </p>
          <p className="text-lg md:text-xl text-foreground/80">{cartCount} Items</p>
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
              {cartItems.map(item => (
                <CartCard key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/all/products")}
          className="group flex items-center mt-6 gap-2 text-primary cursor-pointer"
        >
          <MoveLeft className="group-hover:-translate-x-1 transition" color={"var(--primary)"} />
          Continue Shopping
        </button>
      </div>

      <OrderSummary cartCount={cartCount} cartAmount={cartAmount} />
    </div>
  );
};

export default Cart;
