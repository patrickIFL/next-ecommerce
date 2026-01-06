"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import useWishlist from "@/hooks/useWishlist";

type Props = {
  products: any[];
  isLoading: boolean;
  emptyIcon?: any;
  emptyTitle?: string;
  emptyDescription?: string;
  gridClassName?: string;
};

const ProductGrid = ({
  products,
  isLoading,
  emptyIcon,
  emptyTitle = "No Products Found",
  emptyDescription = "There are no products to display at the moment.",
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6 pb-14 w-full",
}: Props) => {
  const [count, setCount] = useState(4);
  const { wishlist } = useWishlist();

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

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 w-full">
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full w-full">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlist={wishlist}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
