"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import ProductGrid from "@/components/common/ProductGrid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/lib/types";

type Props = {
  products: Product[];
  isLoading: boolean;
  pagination: any;
  emptyIcon?: any;
  emptyTitle?: string;
  emptyDescription?: string;
};

const PaginatedProductGrid = ({
  products,
  isLoading,
  pagination,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isInteger(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  return (
    <>
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyIcon={emptyIcon}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

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
    </>
  );
};

export default PaginatedProductGrid;
