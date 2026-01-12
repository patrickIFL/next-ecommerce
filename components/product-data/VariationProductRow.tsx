/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { formatMoney, isValidImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Star, ChevronDown } from "lucide-react";
import { ProductActions } from "../seller/ProductActions";

type Props = {
  product: any;
};

function VariationProductRow({ product }: Props) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const [open, setOpen] = useState(false);
  const isFeatured = product.isFeatured;
  const isArchived = product.isArchived;
  const onSale = product.isOnSale;

  const imageSrc = isValidImageUrl(product.image?.[0])
    ? product.image[0]
    : "/product-placeholder.jpg";

  return (
    <>
      {/* ================= PARENT ROW ================= */}
      <tr
        className={`border-t hover:bg-muted/50  ${
          open
            ? "border-t-2 border-dashed border-primary"
            : "border-gray-500/20"
        }`}
      >
        {/* IMAGE */}
        <td className="py-3">
          <div className="relative rounded w-fit mx-auto">
            <div className="flex items-center justify-center gap-2">
              <div className="relative ml-6 bg-amber-500">
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
              <button className=" ">
                <ChevronDown
                  onClick={() => setOpen((prev) => !prev)}
                  size={16}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </td>

        {/* NAME + CHEVRON */}
        <td className="px-4 py-3 text-left">
          <span>{product.name}</span>
        </td>

        <td className="px-4 py-3 text-center">{product.category}</td>
        <td className="px-4 py-3 text-center">{product.sku ?? "-"}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>

        {/* Test Actions */}
        <td className="px-2 py-3">
          <div className="flex w-full justify-center">
            <ProductActions product={product} />
          </div>
        </td>
      </tr>

      {/* ================= VARIANTS (ACCORDION CONTENT) ================= */}
      {open && (
        <tr className="bg-muted/40">
          <td colSpan={9} className="p-4">
            <div className="rounded-md border bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-center">Image</th>
                    <th className="px-4 py-2 text-left">Variants</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-center">Price</th>
                    <th className="px-4 py-2 text-center">Sale</th>
                    <th className="px-4 py-2 text-center">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {product.variants.map((variant: any) => (
                    <tr key={variant.id} className="border-t border-accent">
                      <td className="py-3">
                        <div className="relative bg-gray-500/10 rounded w-fit mx-auto">
                          <div className="flex items-center justify-center gap-2">
                            <Image
                              src={
                                product.image?.[variant.imageIndex] ??
                                "/product-placeholder.jpg"
                              }
                              alt="Product Image"
                              className="w-8"
                              width={1280}
                              height={720}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-2">{variant.name}</td>

                      <td className="px-4 py-2 text-left">
                        {variant.sku ?? "-"}
                      </td>

                      <td className="px-4 py-2 text-center">
                        {currency}
                        {formatMoney(variant.price)}
                      </td>

                      <td className="px-4 py-2 text-center">
                        {variant.salePrice
                          ? currency + formatMoney(variant.salePrice)
                          : "-"}
                      </td>

                      <td className="px-4 py-2 text-center">{variant.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}

      {open && (
        <tr>
          <td colSpan={10} className="py-4">
            <div className="w-full border-t-2 border-dashed border-primary" />
          </td>
        </tr>
      )}
    </>
  );
}

export default VariationProductRow;
