"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { assets } from "@/assets/assets";
import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: any }) => {
  const { handleBuyNow } = useCartHook();
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const isSale = product.offerPrice < product.price;

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
            className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full cursor-pointer"
            width={800}
            height={800}
          />
          <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
            <Image
              className="h-3 w-3"
              src={assets.heart_icon}
              alt="heart_icon"
            />
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
    <div className="w-full p-2">
        
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
            <Image
              key={index}
              className="h-3 w-3"
              src={
                index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon
              }
              alt="star_icon"
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-foreground font-medium">
        <span className="text-md">
            {currency}
          {formatMoney(product.offerPrice)}{" "}
        </span>

        {isSale && 
        <span className="text-xs text-foreground/40 font-normal line-through">
          {currency}
          {formatMoney(product.price)}
        </span>
        }
        
          
        </p>
        
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            handleBuyNow(product.id);
          }}
          className="max-sm:hidden px-3 py-1.5 text-foreground border border-foreground rounded-full text-xs hover:bg-foreground hover:text-background transition cursor-pointer"
        >
          Buy now
        </button>
      </div>
    </div>

    </div>
  );
};

export default ProductCard;
