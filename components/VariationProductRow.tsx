/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Eye,
  EyeOff,
  LoaderIcon,
  SquareArrowOutUpRight,
  SquarePen,
  Star,
  TicketPercent,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Confirmation from "./Confirmation";
import useActionsProductHook from "@/hooks/useActionsProductHook";
import { VariationActions } from "./VariationActions";

type Props = {
  product: any;
};

function VariationProductRow({ product }: Props) {
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const [open, setOpen] = useState(false);

  const {
    isFeatured,
    isArchived,
    onSale,
    isDeleting,
    deleteProduct,
    toggleFeatured,
    isTogglingFeatured,
    toggleArchive,
    isTogglingArchive,
    toggleSale,
    isTogglingSale,
  } = useActionsProductHook({ product });

  return (
    <>
      {/* ================= PARENT ROW ================= */}
      <tr className="border-t border-gray-500/20 hover:bg-muted/50">
        {/* IMAGE */}
        <td className="py-3">
          <div className="relative rounded w-fit mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Image
                src={product.image?.[0] ?? "/placeholder.png"}
                alt="Product Image"
                className="ml-5 w-10 h-10 object-cover"
                width={1280}
                height={720}
              />
              <button className="cursor-pointer">
                <ChevronDown
                  onClick={() => setOpen((prev) => !prev)}
                  size={16}
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {onSale && (
              <div className="absolute top-0 left-0 -translate-y-1/2 bg-red-600 px-1 py-0.5">
                <p className="text-[10px] text-white font-bold">SALE</p>
              </div>
            )}

            {isFeatured && (
              <div className="absolute top-0 right-0 -translate-x-[15px] -translate-y-1/2">
                <Star size={16} fill="var(--foreground)" />
              </div>
            )}
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

        {/* ACTIONS */}
        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center w-full mx-2 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    toggleFeatured(product.id);
                  }}
                  className={`flex items-center gap-1 p-1.5 cursor-pointer text-white rounded-md bg-purple-600 `}
                  disabled={isTogglingFeatured}
                >
                  {isTogglingFeatured ? (
                    <LoaderIcon className="animate-spin" size={16} />
                  ) : (
                    <Star
                      size={16}
                      color={isFeatured ? "none" : "white"}
                      fill={isFeatured ? "white" : "none"}
                    />
                  )}
                </button>
              </TooltipTrigger>
              {!isTogglingFeatured && (
                <TooltipContent>
                  {isFeatured ? <p>Un-Feature</p> : <p>Feature</p>}
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleArchive(product.id)}
                  className={`flex items-center gap-1 p-1.5 cursor-pointer text-white rounded-md ${
                    isArchived
                      ? isTogglingArchive
                        ? "bg-red-900"
                        : "bg-red-600 hover:bg-red-700"
                      : isTogglingArchive
                      ? "bg-green-900"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={isTogglingArchive}
                >
                  {isTogglingArchive ? (
                    <LoaderIcon className="animate-spin" size={16} />
                  ) : isArchived ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </TooltipTrigger>
              {!isTogglingArchive && (
                <TooltipContent>
                  {isArchived ? <p>Unarchive</p> : <p>Archive</p>}
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Confirmation
                    confirmMessage={onSale ? "End SALE" : "Put on SALE"}
                    btnVariant={onSale ? "destructive" : "default"}
                    title={
                      onSale
                        ? `End SALE for ${product.name}?`
                        : `Put ${product.name} on SALE?`
                    }
                    message="Customers will checkout using the SALE price."
                    onConfirm={() => toggleSale(product.id)}
                  >
                    <button
                      className={`flex items-end justify-center gap-1 p-1.5 cursor-pointer text-white rounded-md 
                                
                                ${
                                  onSale
                                    ? isTogglingSale
                                      ? "bg-red-900"
                                      : "bg-red-600 hover:bg-red-700"
                                    : isTogglingSale
                                    ? "bg-amber-700"
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
                      disabled={isTogglingSale}
                    >
                      {isTogglingSale ? (
                        <LoaderIcon className="animate-spin" size={16} />
                      ) : onSale ? (
                        <TicketPercent size={16} />
                      ) : (
                        <TicketPercent size={16} />
                      )}
                    </button>
                  </Confirmation>
                </div>
              </TooltipTrigger>
              {!isTogglingSale && (
                <TooltipContent>
                  {onSale ? <p>End SALE</p> : <p>Put on SALE</p>}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </td>

        {/* EDIT / DELETE / VIEW */}
        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex w-full justify-center mx-2 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    router.push(`/seller/edit-product/${product.id}`)
                  }
                  className="flex items-center gap-1 p-1.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-md"
                >
                  <SquarePen size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Confirmation
                    message="This action cannot be undone. This will permanently delete the item."
                    onConfirm={() => deleteProduct(product.id)}
                  >
                    <button
                      disabled={isDeleting}
                      className={`flex items-center gap-1 p-1.5 ${
                        isDeleting
                          ? "bg-red-900"
                          : "bg-red-600 hover:bg-red-700"
                      } cursor-pointer text-white rounded-md`}
                    >
                      {isDeleting ? (
                        <LoaderIcon className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </Confirmation>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    router.push("/product/" + product.id);
                    scrollTo(0, 0);
                  }}
                  className="flex items-center gap-1 p-1.5 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white rounded-md"
                >
                  <SquareArrowOutUpRight size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>See Product</p>
              </TooltipContent>
            </Tooltip>
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
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {product.variants.map((variant: any) => (
                    <tr key={variant.id} className="border-t">
                      <td className="py-3">
                        <div className="relative bg-gray-500/10 rounded w-fit mx-auto">
                          <div className="flex items-center justify-center gap-2">
                            <Image
                              src={
                                product.image?.[variant.imageIndex] ??
                                "/placeholder.png"
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

                      {/* EDIT / DELETE / VIEW */}
                      <td
                        className="px-2 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center gap-1">
                          <VariationActions />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default VariationProductRow;
