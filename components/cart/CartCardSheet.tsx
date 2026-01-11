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

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

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

  const productImageIndex = variant?.imageIndex ?? 0;

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
    <div className="flex gap-3 rounded-md bg-accent p-3 shadow-sm">
      {/* IMAGE */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image?.[productImageIndex] ?? "/placeholder.png"}
          alt={product.name}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col justify-between">
        {/* NAME + QUANTITY */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {product.name}
            </p>

            {variant && (
              <p className="truncate text-xs text-foreground/50">
                {variant.name.split(" - ")[0].trim()}
              </p>
            )}
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-2 text-sm shrink-0">
            {isEditing && (
              <button onClick={decrement}>
                <ChevronLeft size={18} />
              </button>
            )}

            <span className="w-6 text-center">×{quantity}</span>

            {isEditing && (
              <button onClick={increment}>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* PRICE + ACTIONS */}
        <div className="flex items-end justify-between">
          <div className="text-xs text-foreground/70 pb-1">
            {currency}
            {formatMoney(unitPrice)} / pc
          </div>

          <div className="flex flex-col items-end">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs flex gap-1 items-center text-foreground p-1 hover:bg-accent rounded-md"
              >
                <SquarePen size={12} />
                Edit
              </button>
            )}

            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={remove}
                  className="text-destructive text-xs flex gap-1 items-center p-1 hover:bg-accent rounded-md"
                >
                  <Trash2 size={12} />
                  Delete
                </button>

                <button
                  onClick={() => {
                    if (quantity !== item.quantity) {
                      updateQuantity(quantity);
                    }
                    setIsEditing(false);
                  }}
                  className="text-success text-xs flex gap-1 items-center p-1 hover:bg-accent rounded-md"
                >
                  <SquareCheckBig size={12} />
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default CartCard;
