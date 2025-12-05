/* eslint-disable @typescript-eslint/no-explicit-any*/

import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Eye,
  EyeOff,
  LoaderIcon,
  SquareArrowOutUpRight,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";

function ProductDataRow({ product }: { product: any }) {
  const router = useRouter();

  const isSale = product.offerPrice < product.price;
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient()

  const { mutateAsync: deleteProduct } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed Delete product");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const { mutateAsync: toggleArchive, isPending: isToggling } = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      const res = await fetch(`/api/product/toggle-archive/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle archive product");
      return data;
    },
    onSuccess: (data: any) => {
      // Update local state immediately
      setIsArchived(data.product.isArchived);

      // Optionally, refresh the query so other components stay in sync
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
    onError: (error: any) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });



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
        {product.sku}
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
        {product.stock}
      </td>

      <td className="py-3">
        <div className="flex justify-center w-full mx-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => toggleArchive(product.id)}
                className={`flex items-center gap-1 p-1.5 cursor-pointer text-white rounded-md ${isArchived
                  ? isToggling
                    ? "bg-red-900"
                    : "bg-red-600 hover:bg-red-700"
                  : isToggling
                    ? "bg-green-900"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
                disabled={isToggling}
              >
                {isToggling ? <LoaderIcon className="animate-spin" size={16} /> : isArchived ? <EyeOff size={16} /> : <Eye size={16} />}
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
              <button
                onClick={() => {
                  const result = confirm(
                    "Are you sure you want to delete this product?"
                  );
                  if (result) {
                    deleteProduct(product.id)
                  } else {
                    // User clicked "Cancel"
                    console.log("Cancelled");
                  }
                }}
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
