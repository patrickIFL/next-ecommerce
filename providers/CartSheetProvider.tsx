"use client";

import { CartSheet } from "@/components/CartSheet";
import { useCartUI } from "@/stores/useCartUI";

export function CartSheetProvider() {
  const { open, closeCart } = useCartUI();

  return (
    <CartSheet
      open={open}
      onOpenChange={(v) => {
        if (!v) closeCart();
      }}
    >
      {/* Invisible trigger — required by Radix */}
      <span />
    </CartSheet>
  );
}
