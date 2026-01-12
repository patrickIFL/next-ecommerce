"use client";

import { useSearchParams } from "next/navigation";
import { Archive, HeartOff } from "lucide-react";

import PaginatedProductGrid from "@/components/common/PaginatedProductGrid";

import { useWishlistedProductsPage } from "@/hooks/FetchProduct/useWishlistedProducts";
import ProductPageTitle from "@/components/common/ProductPageTitle";

export default function WishlistPage() {
  const searchParams = useSearchParams();

  /* =========================
     PAGE FROM URL
  ========================= */
  const raw = Number(searchParams.get("page"));
  const page = Number.isInteger(raw) && raw > 0 ? raw : 1;

  const { data, isLoading } = useWishlistedProductsPage(page);

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      {/* HEADER */}
      <ProductPageTitle title="My Wishlist" />

      {/* PAGINATED PRODUCT GRID */}
      <PaginatedProductGrid
        products={products}
        isLoading={isLoading}
        pagination={pagination}
        emptyIcon={HeartOff}
        emptyTitle="No Wishlist Yet"
        emptyDescription="Your wishlist is currently empty."
      />
    </div>
  );
}
