"use client";

import { useSearchParams } from "next/navigation";
import { useProductsPage } from "@/hooks/FetchProduct/useProductsPage";
import PaginatedProductGrid from "@/components/common/PaginatedProductGrid";
import ProductPageTitle from "@/components/common/ProductPageTitle";
import { Pagination, Product } from "@/lib/types";

export default function AllProductsClient({
  initialProducts,
  initialPagination,
}:{
  initialProducts:Product[],
  initialPagination:Pagination,
}) {
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const shouldFetch = pageFromUrl !== 1;

  const { data, isLoading } = useProductsPage(pageFromUrl, {
    enabled: shouldFetch,
  });

  const products = shouldFetch
    ? data?.products ?? []
    : initialProducts;

  const pagination = shouldFetch
    ? data?.pagination
    : initialPagination;

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32">
      <ProductPageTitle title="All Products" />

      <PaginatedProductGrid
        products={products}
        isLoading={isLoading}
        pagination={pagination}
      />
    </div>
  );
}
