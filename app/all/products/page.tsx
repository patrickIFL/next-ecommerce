"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Archive } from "lucide-react";

import ProductCard from "@/components/common/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import useWishlist from "@/hooks/useWishlist";
import { useProductsPage } from "@/hooks/FetchProduct/useProductsPage";

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { wishlist } = useWishlist();

  /* =========================
     PAGE FROM URL
  ========================= */
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isInteger(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const { data, isLoading } = useProductsPage(page);

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  /* =========================
     SKELETON COUNT
  ========================= */
  const [count, setCount] = useState(4);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCount(10);
      else if (width >= 1024) setCount(8);
      else if (width >= 640) setCount(6);
      else setCount(4);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      {/* HEADER */}
      <div className="flex flex-col pt-12">
        <p className="text-2xl font-medium">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-10 w-full">
        {isLoading ? (
          Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 w-full">
              <Skeleton className="w-full h-40 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full w-full justify-center items-center">
            <EmptyState
              icon={Archive}
              title="No Products Found"
              description="We couldn't find any products at the moment. Check back later!"
            />
          </div>
        ) : (
          products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center w-full pb-14">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  className={
                    !pagination.hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              )
                .slice(
                  Math.max(0, page - 3),
                  Math.min(pagination.totalPages, page + 2)
                )
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
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
