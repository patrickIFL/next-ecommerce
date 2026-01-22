"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import useWishlist from "@/hooks/useWishlist";
import { formatMoney, getMinMaxPrice } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isValidImageUrl } from "../../lib/utils";
import { useState } from "react";

const ProductCard = ({
  product,
  wishlist,
}: {
  product: any;
  wishlist: any;
}) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const isSale = product.salePrice ? product.isOnSale : false;

  const { toggleWishlist, isPending } = useWishlist();
  const isWishlisted = wishlist?.includes(product.id);

  const imageSrc = isValidImageUrl(product.image?.[0])
    ? product.image[0]
    : "/product-placeholder.jpg";

  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    size: number;
    key: number;
  } | null>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const imageWrapper = e.currentTarget.querySelector(
    ".ripple-container"
  ) as HTMLDivElement;

  if (imageWrapper) {
    const rect = imageWrapper.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRipple({
      x,
      y,
      size,
      key: Date.now(),
    });

    setTimeout(() => setRipple(null), 1000);
  }

  // ⬇️ allow ripple to render before navigation
  setTimeout(() => {
    router.push("/product/" + product.id);
    // window.scrollTo({ top: 0, behavior: "instant" });
  }, 500);
};


  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col bg-accent items-start shadow-xl rounded-lg border gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="relative w-full">
        <div className="ripple-container overflow-hidden group relative bg-gray-500/10 rounded-lg rounded-b-none w-full h-52 flex items-center justify-center">
         <Image
  src={imageSrc}
  alt={product.name}
  className="z-0 group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full border-b"
  width={800}
  height={800}
/>


          {ripple && (
            <span
              key={ripple.key}
              className="ripple"
              style={{
                width: ripple.size,
                height: ripple.size,
                left: ripple.x,
                top: ripple.y,
              }}
            />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md z-10"
            disabled={isPending}
          >
            <Heart
              className="h-3 w-3"
              fill={isWishlisted ? "#F91880" : "none"}
              color={isWishlisted ? "#F91880" : "#6B7280"}
              strokeWidth={3}
            />
          </button>
        </div>

        {isSale && (
          <div className="shadow-lg absolute top-0 left-0 -translate-x-1 -translate-y-1 bg-red-600 px-1 py-0.5">
            <p className="text-[10px] text-white font-bold">SALE</p>
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col justify-between w-full h-full p-2">
        <p className="md:text-base font-medium truncate">{product.name}</p>

        <div className="flex items-center gap-2">
          <p className="text-xs">4.5</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3"
                fill={i < 4 ? "orange" : "lightgray"}
                stroke="none"
              />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-foreground font-medium">
            {currency}
            {formatMoney(
              product.type === "SIMPLE"
                ? isSale
                  ? product.salePrice
                  : product.price
                : getMinMaxPrice(product).min
            )}
          </p>
          <p className="text-xs text-foreground/50">123 sold</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
