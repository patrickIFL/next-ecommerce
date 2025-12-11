import useCartHook from '@/hooks/useCartHook';
import { formatMoney } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface CartProduct {
  id: string;
  name: string;
  image: string[];
  salePrice: number;
  price: number;
  isOnSale: boolean;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartCardProps {
  item: CartItem;
}

function CartCard({ item }: CartCardProps) {
  const { updateCartQuantity } = useCartHook();
  const [quantity, setQuantity] = useState(item.quantity);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  // Sync local state if item.quantity changes externally
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const updateQuantity = useCallback(
    (newQuantity: number) => {
      setQuantity(newQuantity);
      updateCartQuantity({ cartItemId: item.id, quantity: newQuantity });
    },
    [item.id, updateCartQuantity]
  );

  const increment = () => updateQuantity(quantity + 1);
  const decrement = () => updateQuantity(Math.max(0, quantity - 1));
  const remove = () => updateQuantity(0);

  const totalPrice = formatMoney( 
    (item.product.isOnSale 
    ? item.product.salePrice ? item.product.salePrice : item.product.price
    : item.product.price) * quantity
  );

  return (
    <tr>
      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
          <Image
            src={item.product.image?.[0] ?? "/placeholder.png"}
            alt={item.product.name}
            className="w-16 h-auto object-cover"
            width={1280}
            height={720}
          />
        </div>

        <div className="text-sm hidden md:block">
          <p className="text-foreground">{item.product.name}</p>
          <button
            className="text-xs text-primary mt-1 cursor-pointer hover:underline"
            onClick={remove}
          >
            Remove
          </button>
        </div>
      </td>

      <td className="py-4 md:px-4 px-1 text-foreground/80">
        {currency}{formatMoney(
          item.product.isOnSale 
          ? item.product.salePrice ? item.product.salePrice : item.product.price 
          : item.product.price)} /pc
      </td>

      <td className="py-4 md:px-4 px-1">
        <div className="flex items-center gap-2">
          <button onClick={decrement}>
            <ChevronLeft size={20} color="var(--color-foreground)" />
          </button>

          <p className="text-foreground">{quantity}</p>

          <button onClick={increment}>
            <ChevronRight size={20} color="var(--color-foreground)" />
          </button>
        </div>
      </td>

      <td className="py-4 md:px-4 px-1 text-foreground">
        {currency}{totalPrice}
      </td>
    </tr>
  );
}

export default CartCard;
