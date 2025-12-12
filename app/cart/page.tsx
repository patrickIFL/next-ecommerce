'use client';

import OrderSummary from "@/components/OrderSummary";
import { useRouter } from "next/navigation";
import CartCard from "@/components/CartCard";
import { useEffect } from "react";
import useCartHook from "@/hooks/useCartHook";
import { MoveLeft, ShoppingCart } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";

const Cart = () => {
  const router = useRouter();
  const { cartItems, cartLoading, refetchCart, getCartTotal } = useCartHook();

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const cartAmount = getCartTotal(cartItems);

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  // Decide what to show in the cart content
  let cartContent;

  if (cartLoading) {
    cartContent = (
      <tr>
        <td colSpan={4} className="text-center">
          <Loading />
        </td>
      </tr>
    );
  } else if (cartItems.length === 0 && !cartLoading) {
    cartContent = (
      <tr>
        <td colSpan={4}>
          <EmptyState
            icon={ShoppingCart}
            title="Your Cart is Empty"
            description="Check our wide range of items and find great deals."
          />
        </td>
      </tr>
    );
  } else {
    cartContent = cartItems.map(item => (
      <CartCard key={item.id} item={item} />
    ));
  }

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
              {cartContent}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/all/products")}
          className="cursor-pointer group flex items-center mt-6 gap-2 text-primary"
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
