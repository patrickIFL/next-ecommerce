"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";

import ProductCard from "@/components/common/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

import useSearchHook from "@/hooks/useSearchHook";
import useWishlist from "@/hooks/useWishlist";

const DisplayProducts = () => {
  const params = useParams<{ cat: string }>();
  const { wishlist } = useWishlist();

  const { searchResults, searchLoading, search } = useSearchHook(params.cat);

  /* =========================
     TRIGGER SEARCH
  ========================= */

  useEffect(() => {
    search();
  }, [params.cat, search]);

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

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      {/* HEADER */}
      <div className="flex flex-col pt-12">
        <p className="text-2xl font-medium">
          Search results for{" "}
          <span className="italic">{`"${params.cat}"`}</span>
        </p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>

      {/* RESULTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {searchLoading ? (
          Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 w-full">
              <Skeleton className="w-full h-40 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))
        ) : !searchResults || searchResults.length === 0 ? (
          <div className="col-span-full w-full">
            <EmptyState
              icon={SearchX}
              title="No Products Found"
              description={`We couldn't find any product that matches "${params.cat}"`}
            />
          </div>
        ) : (
          searchResults.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
