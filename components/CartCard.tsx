import { useAppContext } from '@/context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface CartProduct {
  id: string;
  name: string;
  image: string[];
  offerPrice: number;
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
  const { updateCartQuantity } = useAppContext();
  const [quantity, setQuantity] = useState(item.quantity);

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

  const totalPrice = (item.product.offerPrice * quantity).toFixed(2);

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
            className="text-xs text-orange-600 mt-1 cursor-pointer hover:underline"
            onClick={remove}
          >
            Remove
          </button>
        </div>
      </td>

      <td className="py-4 md:px-4 px-1 text-foreground/80">
        ${item.product.offerPrice}
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
        ${totalPrice}
      </td>
    </tr>
  );
}

export default CartCard;
