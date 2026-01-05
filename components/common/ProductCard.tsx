"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import useWishlist from "@/hooks/useWishlist";
import { formatMoney, getMinMaxPrice } from "@/lib/utils";
import { Heart, LoaderIcon, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, wishlist }: { product: any, wishlist: any }) => {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const isSale = product.salePrice ? product.isOnSale : false;

  const { toggleWishlist, isPending } = useWishlist();

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      onClick={() => {
        router.push("/product/" + product.id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start shadow-xl rounded-b- gap-0.5 max-w-[200px] w-full"
    >
      <div className="relative w-full">
        <div className="overflow-hidden group relative bg-gray-500/10 rounded-lg rounded-b-none w-full h-52 flex items-center justify-center">
          <Image
            src={product.image[0]}
            alt={product.name}
            className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
            width={800}
            height={800}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="cursor-pointer absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
            disabled={isPending}
          >
            {false ? (
              <LoaderIcon className="h-3 w-3 text-gray-500 animate-spin" />
            ) : (
              <Heart
                className="h-3 w-3 text-gray-500"
                fill={isWishlisted ? "#F91880" : "none"}
                color={isWishlisted ? "#F91880" : "#6B7280"}
                strokeWidth={3}
              />
            )}
          </button>
        </div>
        {/* Sale flag */}
        {isSale && (
          <div className="shadow-lg rounded-xs absolute top-0 left-0 -translate-x-1 -translate-y-1 bg-red-600 px-1 py-0.5">
            <p className="text-[10px] text-white font-bold">SALE</p>
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col justify-between w-full h-full p-2">

          <p className="md:text-base font-medium w-full truncate">
            {product.name}
          </p>
          <p className="w-full text-xs text-gray-500 max-sm:hidden truncate">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs">{4.5}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-3 w-3"
                  fill={index < 4 ? "orange" : "lightgray"}
                  stroke="none"
                />
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between">

            {product.type === "SIMPLE" ? (
              // SIMPLE PRODUCT
              <>
                <p className="text-foreground font-medium">
                  <span className="text-md">
                    {currency}
                    {formatMoney(isSale ? product.salePrice : product.price)}{" "}
                  </span>

                  {isSale && (
                    <span className="text-xs text-foreground/40 font-normal line-through">
                      {currency}
                      {formatMoney(product.price)}
                    </span>
                  )}
                </p>
              </>
            ) : (
              // VARIATION PRODUCT
              <>
                <p className="text-foreground font-medium">
                  <span className="text-md">
                    {currency}
                    {formatMoney(getMinMaxPrice(product).min)}{/*" - "*/}
                  </span>

                  {/* <span className="text-md">
                    {currency}
                    {formatMoney(getMinMaxPrice(product).max)}
                  </span> */}
                </p>
              </>
            )}
          <p className="text-xs text-foreground/50">123 sold</p>
          </div>

      </div>
    </div>
  );
};

export default ProductCard;
