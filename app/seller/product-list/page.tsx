"use client";

import ProductDataRow from "@/components/product-data/ProductDataRow";
import VariationProductRow from "@/components/product-data/VariationProductRow";
import Loading from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
import SellerSearch from "@/components/seller/SellerSearch";
import SellerCategoryFilter from "@/components/seller/SellerCategoryFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Archive } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSellerProducts from "@/hooks/FetchProduct/useSellerProducts";

const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterCategory, setFilterCategory] = useState("All");

  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isInteger(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const {
    sellerProducts,
    pagination,
    sellerProductsIsLoading,
  } = useSellerProducts(page);

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  if (sellerProductsIsLoading) {
    return (
      <div className="flex-1 min-h-screen flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      <div className="w-full md:p-10 p-4">
        {/* HEADER */}
        <div className="flex pt-12 mb-5 justify-between">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">Products</p>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>

          <div className="flex gap-2">
            <SellerSearch />
            <SellerCategoryFilter
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full rounded-md bg-accent border border-gray-500/20">
          {/* <div className="max-h-[75vh]"> */}
          <div>
            <table className="w-full">
              <thead className="sticky top-0 bg-accent z-10">
                <tr className="text-sm text-left">
                  <th className="px-4 py-3 text-center">Image</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Category</th>
                  <th className="px-4 py-3 text-center">SKU</th>
                  <th className="px-4 py-3 text-center">Price</th>
                  <th className="px-4 py-3 text-center">Sale</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sellerProducts.length > 0 ? (
                  sellerProducts.map((product) =>
                    product.type === "SIMPLE" ? (
                      <ProductDataRow key={product.id} product={product} />
                    ) : (
                      <VariationProductRow key={product.id} product={product} />
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <EmptyState
                        icon={Archive}
                        title="No Products Found"
                        description="Add your first product to start selling."
                        actionText="Add Product"
                        onAction={() => router.push("/seller")}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* <ScrollBar orientation="horizontal" /> */}
        </div>

        {/* PAGINATION */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(page - 1)}
                    className={
                      !pagination.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                )
                  .slice(Math.max(0, page - 3), page + 2)
                  .map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(page + 1)}
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
