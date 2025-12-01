"use client";
import useProductHook from "@/hooks/useProductHook";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";

const HomeProducts = () => {
  // Variables for skeleton count
  const [count, setCount] = useState(4); // default XS

  const updateCount = () => {
    const width = window.innerWidth;

    if (width >= 1280) setCount(10); // xl
    else if (width >= 1024) setCount(8); // lg
    else if (width >= 640) setCount(6); // sm
    else setCount(4); // xs
  };

  useEffect(() => {
    updateCount(); // initial
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const { products, productsLoading: loading } = useProductHook();
  // =============================================

  const router = useRouter();

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 w-full">
              <Skeleton className="w-full h-40 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      )}

      <button
        onClick={() => {
          router.push("/all-products");
        }}
        className="px-12 py-2.5 border border-foreground rounded text-foreground hover:bg-foreground hover:text-background transition cursor-pointer"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
