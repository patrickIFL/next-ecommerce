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
import { Button } from "../ui/button";
import { CartItem } from "@/lib/types";

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

  const productImageIndex = variant?.imageIndex ?? 0;

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
    <tr className="bg-accent">
      {/* PRODUCT */}
      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
        <div className="max-w-20 rounded-lg overflow-hidden bg-gray-500/10 p-2">
          <Image
            src={product.image?.[productImageIndex] ?? "/placeholder.png"}
            alt={product.name}
            className="min-w-16 h-16 object-cover"
            width={720}
            height={720}
          />
        </div>

        <div className="text-sm flex flex-col justify-between h-16">
          <div>
            <p className="text-foreground max-w-[200px] lg:max-w-[300px] truncate">
              {product.name}
            </p>

            {variant && (
              <p className="text-xs text-foreground/50">
                {variant.name.split(" - ")[0].trim()}
              </p>
            )}
          </div>
          <p>
            {currency}
            {formatMoney(unitPrice)} / pc
          </p>
        </div>
      </td>

      {/* QUANTITY */}
      <td className="w-35 h-20">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2">
            {isEditing && (
              <button onClick={decrement}>
                <ChevronLeft size={20} />
              </button>
            )}

            <p className="text-foreground">
              {!isEditing && "× " }
              {quantity}</p>

            {isEditing && (
              <button onClick={increment}>
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="   flex gap-1 items-center"
              >
                <SquarePen size={12} />
                Edit
              </button>
            )}

            {isEditing && (
              <>
                <button
                  onClick={remove}
                  className="  flex gap-0.5 items-center text-destructive hover:text-destructive/80"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => {
                    if (quantity !== item.quantity) {
                      updateQuantity(quantity);
                    }
                    setIsEditing(false);
                  }}
                  className="  flex gap-1 items-center text-success hover:text-success/80"
                >
                  <SquareCheckBig size={12} />
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </td>

      {/* TOTAL */}
      <td className="py-4 md:px-4 px-1 text-foreground text-center">
        {currency}
        {totalPrice}
      </td>
    </tr>
  );
}

export default CartCard;
