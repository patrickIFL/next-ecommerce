import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  SquareCheckBig,
  SquarePen,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { CartItem } from "@/types/cart";

interface CartCardProps {
  item: CartItem;
}

function CartCard({ item }: CartCardProps) {
  const { updateCartQuantity } = useCartHook();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditing, setIsEditing] = useState(false);

  const product = item.product;
  const variant = item.variant ?? null;

  /* ================= SYNC ================= */
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  /* ================= PRICE RESOLUTION ================= */
  const unitPrice: number = (() => {
    if (variant) {
      return product.isOnSale
        ? variant.salePrice ?? variant.price ?? 0
        : variant.price ?? 0;
    }

    return product.isOnSale
      ? product.salePrice ?? product.price ?? 0
      : product.price ?? 0;
  })();

  const totalPrice = formatMoney((unitPrice ?? 0) * quantity);

  const productImageIndex = variant ? variant.imageIndex : 0;

  /* ================= ACTIONS ================= */
  const updateQuantity = useCallback(
    (newQuantity: number) => {
      updateCartQuantity({
        cartItemId: item.id,
        quantity: newQuantity,
      });
    },
    [item.id, updateCartQuantity]
  );

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const remove = () => updateQuantity(0);

  return (
    <tr>
      {/* PRODUCT */}
      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
          <Image
            src={product.image?.[productImageIndex] ?? "/placeholder.png"}
            alt={product.name}
            className="w-16 h-auto object-cover"
            width={1280}
            height={720}
          />
        </div>

        <div className="text-sm flex flex-col">
          <p className="text-foreground">{product.name}</p>

          {variant && (
            <p className="text-xs text-foreground/50">
              {variant.name.split(" - ")[0].trim()}
            </p>
          )}
        </div>
      </td>

      {/* UNIT PRICE */}
      <td className="py-4 md:px-4 px-1 text-foreground/80">
        {currency}
        {formatMoney(unitPrice)} / pc
      </td>

      {/* QUANTITY */}
      <td className="py-4 md:px-4 px-1">
        <div className="flex items-center justify-center gap-2">
          {isEditing && (
            <button onClick={decrement}>
              <ChevronLeft size={20} />
            </button>
          )}

          <p className="text-foreground">{quantity}</p>

          {isEditing && (
            <button onClick={increment}>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </td>

      {/* TOTAL */}
      <td className="py-4 md:px-4 px-1 text-foreground text-center">
        {currency}
        {totalPrice}
      </td>

      {/* ACTIONS */}
      <td className="py-4 md:px-4 px-1 text-foreground">
        <div className="flex flex-col">
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-7 flex gap-2 justify-start"
              variant="ghost"
            >
              <SquarePen size={12} />
              Edit
            </Button>
          )}

          {isEditing && (
            <>
              <Button
                onClick={() => {
                  if (quantity !== item.quantity) {
                    updateQuantity(quantity);
                  }
                  setIsEditing(false);
                }}
                className="h-7 flex gap-2 justify-start text-success hover:text-success/80"
                variant="ghost"
              >
                <SquareCheckBig size={12} />
                Done
              </Button>

              <Button
                onClick={remove}
                className="h-7 flex gap-2 justify-start text-destructive hover:text-destructive/80"
                variant="ghost"
              >
                <Trash2 size={12} />
                Delete
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default CartCard;
