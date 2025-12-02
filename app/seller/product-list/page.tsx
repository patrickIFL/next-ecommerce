"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import useUserHook from "@/hooks/useUserHook";
import { formatMoney } from "@/lib/utils";
import { EyeOff, SquareArrowOutUpRight, SquarePen, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProductType {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[]; // always array
}

const ProductList = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user, isSeller } = useUserHook();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSellerProduct = async () => {
    // setProducts(productsDummyData as ProductType[]);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex flex-col pt-12 mb-5">
            <p className="text-2xl font-medium">Products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <ScrollArea className="flex flex-col items-center w-full rounded-md bg-accent border border-gray-500/20">
            <div className="max-h-[75vh]">
              <table className="table-fixed w-full">
                <thead className="text-foreground text-sm text-left sticky top-0 bg-accent z-999">
                  <tr>
                    <th className="md:w-1/3 px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium ">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Sale Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm text-foreground z-10">
                  {products.map((product, i) => (
                    <tr key={i} className="border-t border-gray-500/20">
                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                        <div className="relative bg-gray-500/10 rounded p-2">
                          <Image
                            src={product.image?.[0] ?? "/placeholder.png"}
                            alt="Product Image"
                            className="w-16"
                            width={1280}
                            height={720}
                          />
                          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 px-1 py-0.5">
                            <p className="text-[10px] text-white font-bold ">SALE</p>
                          </div>
                        </div>

                        <span className="w-full">{product.name}</span>
                      </td>

                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">
                        {currency}
                        {formatMoney(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        {currency}
                        {formatMoney(product.offerPrice)}
                      </td>
                      <td className="px-4 py-3">123</td>

                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {}}
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
                                className="flex items-center gap-1 p-1.5 bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-md"
                              >
                                <EyeOff size={16} />
                                {/* <Eye /> */}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Archive</p>
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
                                onClick={() =>
                                  router.push(`/product/${product.id}`)
                                }
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
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
            {/* <ScrollBar orientation="vertical"/> */}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ProductList;
