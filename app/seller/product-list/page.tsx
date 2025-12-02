"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductDataRow from "@/components/ProductDataRow";

interface ProductType {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[]; // always array
}

const ProductList = () => {
  const { getToken } = useAuth();
  

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
                    <th className="w-60 px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium ">Category</th>
                    <th className="px-4 py-3 font-medium ">SKU</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Sale Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium text-center">
                      Archive
                    </th>
                    <th className="px-4 py-3 font-medium text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm text-foreground z-10">
                  {products.map((product) => (
                    <ProductDataRow key={product.id} product={product}/>
                  )
                  )}
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
