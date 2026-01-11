"use client";

import { useEffect } from "react";
import EmptyState from "@/components/common/EmptyState";
import Loading from "@/components/common/Loading";
import useCartHook from "@/hooks/useCartHook";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/lib/types";
import CartCardSheet from "./CartCardSheet";

type CartContentProps = {
  compact?: boolean;
};

const CartContent = ({ compact = false }: CartContentProps) => {
  const { cartItems, cartLoading, refetchCart } = useCartHook();

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  if (cartLoading) {
    return <Loading />;
  }

  if (!cartLoading && cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Items you add to your cart will appear here."
      />
    );
  }

  return (
    <div className={compact ? "space-y-4" : ""}>
      {cartItems.map((item) => (
        <CartCardSheet
          key={item.id}
          item={item as CartItem}
        />
      ))}
    </div>
  );
};

export default CartContent;
