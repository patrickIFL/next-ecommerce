"use client";

import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import ProductGrid from "@/components/common/ProductGrid";
import { useHomeProducts } from "@/hooks/FetchProduct/useHomeProducts";

const HomeProducts = () => {
  const router = useRouter();

  const { homeProducts, homeProductsLoading: loading } = useHomeProducts();

  const products = Array.isArray(homeProducts) ? homeProducts : [];

  return (
    <div className="flex flex-col items-center pt-14 w-full">
      <p className="text-2xl font-medium text-left w-full">Popular Products</p>

      <ProductGrid
        products={products}
        isLoading={loading}
        emptyIcon={Archive}
        emptyTitle="No Products Found"
        emptyDescription="We could not find any products at the moment. Please check back later."
      />

      {products.length > 0 && (
        <button
          onClick={() => router.push("/all/products")}
          className="px-12 py-2.5 border border-foreground rounded text-foreground hover:bg-foreground hover:text-background transition mt-6"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default HomeProducts;
