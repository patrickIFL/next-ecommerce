'use client'
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import useUserHook from "@/hooks/useUserHook";
import { formatMoney } from "@/lib/utils";

// ------------------------------
// Product TYPE (Very Important)
// ------------------------------
interface ProductType {
  id: string;
  name: string;
  category: string;
  offerPrice: number;
  image: string[]; // always array
}

const ProductList = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUserHook();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSellerProduct = async () => {
    // setProducts(productsDummyData as ProductType[]);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      }
      else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive'
        })
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  };

  useEffect(() => {
    if (user === undefined) return; // still loading Clerk auth
    if (user === null) return;      // not logged in
    fetchSellerProduct();
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Product</h2>

          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-accent border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-foreground text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                </tr>
              </thead>

              <tbody className="text-sm text-foreground">
                {products.map((product, i) => (
                  <tr key={i} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image?.[0] ?? "/placeholder.png"}
                          alt="Product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>

                      <span className="truncate w-full">{product.name}</span>
                    </td>

                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                    <td className="px-4 py-3">{currency}{formatMoney(product.offerPrice)}</td>

                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
