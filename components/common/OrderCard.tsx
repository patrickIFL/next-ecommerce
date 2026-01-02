/* eslint-disable @typescript-eslint/no-explicit-any*/
import Image from "next/image";
import { formatMoney } from "@/lib/utils";

interface OrderCardProps {
  item: any;
}

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const product = item.product;
  const variant = item.variant ?? null;

  const unitPrice = (() => {
    if (variant) {
      return product.isOnSale
        ? variant.salePrice ?? variant.price ?? 0
        : variant.price ?? 0;
    }

    return product.isOnSale
      ? product.salePrice ?? product.price ?? 0
      : product.price ?? 0;
  })();

  const totalPrice = formatMoney(unitPrice * item.quantity);
  const imageIndex = variant?.imageIndex ?? 0;

  return (
    <tr className="border-b border-accent">
      {/* PRODUCT */}
      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
          <Image
            src={product.image?.[imageIndex] ?? "/placeholder.png"}
            alt={product.name}
            className="w-16 h-auto object-cover"
            width={1280}
            height={720}
          />
        </div>

        <div className="text-sm flex flex-col">
          <p className="text-foreground font-medium">{product.name}</p>

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
      <td className="py-4 md:px-4 px-1 text-center">
        {item.quantity}
      </td>

      {/* TOTAL */}
      <td className="py-4 md:px-4 px-1 text-center font-medium">
        {currency}
        {totalPrice}
      </td>
    </tr>
  );
};

export default OrderCard;
