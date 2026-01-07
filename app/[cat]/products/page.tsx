"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";

import ProductGrid from "@/components/common/ProductGrid";

import useSearchHook from "@/hooks/useSearchHook";
import ProductPageTitle from "@/components/common/ProductPageTitle";

const DisplayProducts = () => {
  const params = useParams<{ cat: string }>();
  const { searchResults, searchLoading, search } = useSearchHook(params.cat);

  /* TRIGGER SEARCH */

  useEffect(() => {
    search();
  }, [params.cat, search]);

  /* FILTERED RESULTS */

  const products = Array.isArray(searchResults) ? searchResults : [];

  return (
    <div className="mt-16 flex flex-col items-start px-6 md:px-16 lg:px-32">
      {/* HEADER */}
      <ProductPageTitle title={`Search results for "${params.cat}"`} />

      {/* PRODUCT GRID */}
      <ProductGrid
        products={products}
        isLoading={searchLoading}
        emptyIcon={SearchX}
        emptyTitle="No Products Found"
        emptyDescription={`We could not find any product that matches "${params.cat}".`}
      />
    </div>
  );
};

export default DisplayProducts;
