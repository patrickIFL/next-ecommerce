/* eslint-disable @typescript-eslint/no-explicit-any*/

import { formatMoney, isValidImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Star } from "lucide-react";
import { ProductActions } from "../seller/ProductActions";

function ProductDataRow({ product }: { product: any }) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const isFeatured = product.isFeatured;
  const isArchived = product.isArchived;
  const onSale = product.isOnSale;

  const imageSrc = isValidImageUrl(product.image?.[0])
    ? product.image[0]
    : "/product-placeholder.jpg";

  return (
    <tr className="border-t border-gray-500/20">
      <td className={`py-3`}>
        <div className="relative bg-gray-500/10 rounded w-fit mx-auto">
          <Image
            src={imageSrc}
            alt="Product Image"
            width={1280}
            height={720}
            className={`w-10 h-10 object-cover transition-all duration-200 ${
              isArchived ? "grayscale opacity-70" : ""
            }`}
          />

          {isArchived && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 bg-red-600/50 text-white border-red-600 rounded-xs px-1 py-0.5">
              <p className="text-[10px] font-bold">ARCHIVED</p>
            </div>
          )}

          {!isArchived && onSale && (
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 px-1 py-0.5">
              <p className="text-[10px] text-white font-bold">SALE</p>
            </div>
          )}

          {!isArchived && isFeatured && (
            <div className="absolute w-5 h-5 flex items-center justify-center top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full">
              <Tooltip>
                <TooltipTrigger>
                  <Star size={17} fill="#ffd230" color="#ffb900" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Featured</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </td>

      <td className="md:px-4 pl-2 md:pl-4 py-3 text-left">
        <span>{product.name}</span>
      </td>

      <td className="px-4 py-3 text-center">{product.category}</td>
      <td className="px-4 py-3 text-center">
        {product.sku ? product.sku : "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {currency}
        {formatMoney(product.price)}
      </td>
      <td className="px-4 py-3 text-center">
        {product.salePrice !== null
          ? currency + formatMoney(product.salePrice)
          : "-"}
      </td>

      <td className="px-4 py-3 text-center">
        {product.stock !== 0 ? (
          product.stock
        ) : (
          <div className="flex font-bold text-red-600 flex-col leading-none">
            <span>Out of</span>
            <span>stock</span>
          </div>
        )}
      </td>

      {/* Test Actions */}
      <td className="px-2 py-3">
        <div className="flex w-full justify-center">
          <ProductActions product={product} />
        </div>
      </td>
    </tr>
  );
}

export default ProductDataRow;
