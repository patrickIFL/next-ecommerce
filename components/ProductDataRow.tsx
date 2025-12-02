/* eslint-disable @typescript-eslint/no-explicit-any*/

import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Eye,
  EyeOff,
  SquareArrowOutUpRight,
  SquarePen,
  Trash2,
} from "lucide-react";

function ProductDataRow({ product }: { product: any }) {
  const router = useRouter();

  const isSale = product.offerPrice < product.price;
  const [isArchived, setIsArchived] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  return (
    <tr className="border-t border-gray-500/20">
      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
        <div className="relative bg-gray-500/10 rounded p-2">
          <Image
            src={product.image?.[0] ?? "/placeholder.png"}
            alt="Product Image"
            className="w-16"
            width={1280}
            height={720}
          />
          {isSale && (
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 px-1 py-0.5">
              <p className="text-[10px] text-white font-bold ">SALE</p>
            </div>
          )}
        </div>

        <span className="w-full">{product.name}</span>
      </td>

      <td className="px-4 py-3">{product.category}</td>
      <td className="px-4 py-3">
        {/* SKU */}
        1234
      </td>
      <td className="px-4 py-3">
        {currency}
        {formatMoney(product.price)}
      </td>
      <td className="px-4 py-3">
        {currency}
        {formatMoney(product.offerPrice)}
      </td>

      <td className="px-4 py-3">
        {/* Stock */}
        123
      </td>

      <td className="py-3">
        <div className="flex justify-center w-full mx-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setIsArchived(!isArchived);
                }}
                className={`flex items-center gap-1 p-1.5 ${
                  isArchived
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } cursor-pointer text-white rounded-md`}
              >
                {isArchived ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isArchived ? <p>Unarchive</p> : <p>Archive</p>}
            </TooltipContent>
          </Tooltip>
        </div>
      </td>
      <td className="py-3">
        <div className="flex w-full justify-center mx-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.push(`/seller/edit-product/${product.id}`)}
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
              <button
                onClick={() => {}}
                className="flex items-center gap-1 p-1.5 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.push(`/product/${product.id}`)}
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
  );
}

export default ProductDataRow;
