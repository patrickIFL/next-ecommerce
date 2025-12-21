"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductDataRow from "@/components/ProductDataRow";
import Loading from "@/components/Loading";
import SellerSearch from "@/components/SellerSearch";
import SellerCategoryFilter from "@/components/SellerCategoryFilter";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/EmptyState";
import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import VariationProductRow from "@/components/VariationProductRow";
import useProductHook from "@/hooks/useProductHook";

const ProductList = () => {
  const [filterCategory, setFilterCategory] = useState("All");
  const router = useRouter();
  const {sellerProducts ,sellerProductsIsLoading} = useProductHook();

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {sellerProductsIsLoading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full md:p-10 p-4">
            <div className="flex pt-12 mb-5 justify-between">
              <div className="flex flex-col">
                <p className="text-2xl font-medium">Products</p>
                <div className="w-16 h-0.5 bg-primary rounded-full"></div>
              </div>

              <div className="flex gap-2">
                <div className="flex gap-5 mr-5">
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Batch Actions</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Highlight Price</Label>
                  </div>
                </div>
                <SellerSearch />
                <SellerCategoryFilter
                  value={filterCategory}
                  onChange={setFilterCategory}
                />
              </div>
            </div>

            <ScrollArea className="flex flex-col items-center w-full rounded-md bg-accent border border-gray-500/20">
              <div className="max-h-[75vh]">
                <table className="w-full">
                  <thead className="text-foreground text-sm text-left sticky top-0 bg-accent z-45">
                    <tr>
                      <th className="px-4 py-3 font-medium text-center">
                        Image
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Product
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Category
                      </th>
                      <th className="px-4 py-3 font-medium text-center">SKU</th>
                      <th className="px-4 py-3 font-medium text-center">
                        Price
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Sale
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Stock
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Toggles
                      </th>
                      <th className="px-4 py-3 font-medium text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-foreground z-10">
                    {sellerProducts && sellerProducts.length > 0 ? (
                      sellerProducts.map((product) => {
                        // console.log(product)
                        return (
                          product.type === "SIMPLE" ? (
                            <ProductDataRow key={product.id} product={product} />
                          ) : (
                            <VariationProductRow key={product.id} product={product} />
                          )
                        )
})
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center">
                          <EmptyState
                            icon={Archive}
                            title="No Products Found"
                            description="We couldn't find any products at the moment. Add some!"
                            actionText="Add Products"
                            onAction={() => router.push("/seller")}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
