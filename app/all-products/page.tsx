'use client'
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import useProductHook from "@/hooks/useProductHook";
import { useEffect, useState } from "react";

const AllProducts = () => {
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
    
      // =============================================
    
    const { products, productsLoading:loading } = useProductHook();

    return (
        <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
            <div className="flex flex-col items-end pt-12">
                <p className="text-2xl font-medium">All products</p>
                <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
            </div>

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
        </div>
    );
};

export default AllProducts;
