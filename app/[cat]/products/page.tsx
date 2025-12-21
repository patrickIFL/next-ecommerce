"use client";
import EmptyState from "@/components/EmptyState";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import useProductHook from "@/hooks/useProductHook";
import useSearchHook from "@/hooks/useSearchHook";
import useWishlist from "@/hooks/useWishlist";
import useUserStore from "@/stores/useUserStore";
import { Archive, SearchX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DisplayProducts = () => {
  const params = useParams();
  const { products, productsLoading } = useProductHook();
  const { searchResults, searchLoading, search } = useSearchHook(params.cat);
  const { isSeller } = useUserStore();
  const router = useRouter();
  const {wishlist} = useWishlist()

  useEffect(() => {
    if (params.cat !== "all") {
      search(); // fetch search results for this URL
    }
  }, [params.cat, search]);

  // Determine displayed products (derived state — no need for useState)
  const productsToDisplay =
    params.cat === "all" ? products : searchResults || [];

  // Combined loading state
  const isLoading = productsLoading || searchLoading;

  // Skeleton count logic
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

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      <div className="flex flex-col pt-12">
        <p className="text-2xl font-medium">
          {params.cat === "all" ? (
            "All Products"
          ) : (
            <>
              Search results for{" "}
              <span className="italic">{`"${params.cat}"`}</span>
            </>
          )}
        </p>

        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {isLoading ? (
          Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 w-full">
              <Skeleton className="w-full h-40 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))
        ) : productsToDisplay.length === 0 ? (
          <div className="col-span-full w-full justify-center items-center">

            <EmptyState
              icon={params.cat === "all" ? Archive : SearchX}
              title="No Products Found"
              description={params.cat === "all" 
                ? "We couldn't find any products at the moment. Check back later!" 
                
                : `We couldn't find any product that matches "${params.cat}"`}
              actionText={isSeller ? "Add Products" : null}
              onAction={() => router.push("/seller")}
            />
          </div>
        ) : (
          productsToDisplay.map((product: any, index: number) => (
            <ProductCard key={index} product={product} wishlist={wishlist} />
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
