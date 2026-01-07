"use client";

import { useSearchParams } from "next/navigation";
import { Archive } from "lucide-react";

import PaginatedProductGrid from "@/components/common/PaginatedProductGrid";
import { useProductsPage } from "@/hooks/FetchProduct/useProductsPage";
import ProductPageTitle from "@/components/common/ProductPageTitle";

export default function AllProducts() {
  const searchParams = useSearchParams();

  /* =========================
     PAGE FROM URL
  ========================= */
  const raw = Number(searchParams.get("page"));
  const page = Number.isInteger(raw) && raw > 0 ? raw : 1;

  const { data, isLoading } = useProductsPage(page);

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      {/* HEADER */}
      <ProductPageTitle title="All Products" />

      {/* PAGINATED GRID */}
      <PaginatedProductGrid
        products={products}
        isLoading={isLoading}
        pagination={pagination}
        emptyIcon={Archive}
        emptyTitle="No Products Found"
        emptyDescription="We could not find any products at the moment. Please check back later."
      />
    </div>
  );
}
