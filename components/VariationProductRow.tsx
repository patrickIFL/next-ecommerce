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
          <div className="relative bg-gray-500/10 rounded w-fit mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Image
                src={product.image?.[0] ?? "/placeholder.png"}
                alt="Product Image"
                className="ml-5 w-10"
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
        <td className="px-4 py-3 text-center">
          <span>{product.name}</span>
        </td>

        <td className="px-4 py-3 text-center">{product.category}</td>
        <td className="px-4 py-3 text-center">{product.sku ?? "-"}</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>
        <td className="px-4 py-3 text-center">-</td>

        {/* ACTIONS */}
        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center gap-1">
            {/* FEATURE */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleFeatured(product.id)}
                  disabled={isTogglingFeatured}
                  className="p-1.5 bg-purple-600 text-white rounded-md"
                >
                  {isTogglingFeatured ? (
                    <LoaderIcon className="animate-spin" size={16} />
                  ) : (
                    <Star size={16} fill={isFeatured ? "white" : "none"} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isFeatured ? "Un-feature" : "Feature"}
              </TooltipContent>
            </Tooltip>

            {/* ARCHIVE */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleArchive(product.id)}
                  disabled={isTogglingArchive}
                  className={`p-1.5 rounded-md text-white ${
                    isArchived ? "bg-red-600" : "bg-green-600"
                  }`}
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
              <TooltipContent>
                {isArchived ? "Unarchive" : "Archive"}
              </TooltipContent>
            </Tooltip>

            {/* SALE */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Confirmation
                  title={
                    onSale
                      ? `End SALE for ${product.name}?`
                      : `Put ${product.name} on SALE?`
                  }
                  message="Customers will checkout using the SALE price."
                  onConfirm={() => toggleSale(product.id)}
                >
                  <button
                    disabled={isTogglingSale}
                    className={`p-1.5 rounded-md text-white ${
                      onSale ? "bg-red-600" : "bg-amber-500"
                    }`}
                  >
                    {isTogglingSale ? (
                      <LoaderIcon className="animate-spin" size={16} />
                    ) : (
                      <TicketPercent size={16} />
                    )}
                  </button>
                </Confirmation>
              </TooltipTrigger>
              <TooltipContent>
                {onSale ? "End SALE" : "Put on SALE"}
              </TooltipContent>
            </Tooltip>
          </div>
        </td>

        {/* EDIT / DELETE / VIEW */}
        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    router.push(`/seller/edit-product/${product.id}`)
                  }
                  className="p-1.5 bg-blue-600 text-white rounded-md"
                >
                  <SquarePen size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Confirmation
                  message="This action cannot be undone."
                  onConfirm={() => deleteProduct(product.id)}
                >
                  <button
                    disabled={isDeleting}
                    className="p-1.5 bg-red-600 text-white rounded-md"
                  >
                    {isDeleting ? (
                      <LoaderIcon className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </Confirmation>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    router.push(`/product/${product.id}`);
                    scrollTo(0, 0);
                  }}
                  className="p-1.5 bg-orange-600 text-white rounded-md"
                >
                  <SquareArrowOutUpRight size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>See product</TooltipContent>
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
                    <th className="px-4 py-2 text-center">SKU</th>
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

                      <td className="px-4 py-2 text-center">
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/seller/edit-product/${product.id}`
                                  )
                                }
                                className="p-1.5 bg-blue-600 text-white rounded-md"
                              >
                                <SquarePen size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Confirmation
                                message="This action cannot be undone."
                                onConfirm={() => deleteProduct(product.id)}
                              >
                                <button
                                  disabled={isDeleting}
                                  className="p-1.5 bg-red-600 text-white rounded-md"
                                >
                                  {isDeleting ? (
                                    <LoaderIcon
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </Confirmation>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  router.push(`/product/${product.id}`);
                                  scrollTo(0, 0);
                                }}
                                className="p-1.5 bg-orange-600 text-white rounded-md"
                              >
                                <SquareArrowOutUpRight size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>See product</TooltipContent>
                          </Tooltip>
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
