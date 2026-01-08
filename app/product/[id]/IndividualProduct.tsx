"use client";
// ** This is the client page. Moved to a component since page.tsx also needed the product value for title rendering
import { assets } from "@/assets/assets";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
// import { useParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import Loading from "@/components/common/Loading";
import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import { LoaderIcon, Star } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/common/QuantityInput";
import useWishlist from "@/hooks/useWishlist";
import { Lens } from "@/components/ui/lens";
import { VariationComboBox } from "@/components/product-page/VariationComboBox";
// import { useIndividualFetch } from "@/hooks/FetchProduct/useIndividualFetch";
// import { useFeaturedProducts } from "@/hooks/FetchProduct/useFeaturedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, Variant } from "@/lib/types";
import { useHomeProducts } from "@/hooks/FetchProduct/useHomeProducts";

/* =========================
   VARIANT MATRIX
========================= */

type VariantMatrix = Record<string, Variant>;

function buildVariantMatrix(variants: Variant[]): VariantMatrix {
  const matrix: VariantMatrix = {};

  variants.forEach((variant) => {
    const clean = variant.name.split(" - ")[0];
    const parts = clean.split(",").map((p) => p.trim());

    const key = parts.length === 2 ? `${parts[0]}|${parts[1]}` : `${parts[0]}|`;

    matrix[key] = variant;
  });

  return matrix;
}

const IndividualProduct = ({ product }: { product: Product }) => {
  // const { id } = useParams() as { id: string };
  // const { product } = useIndividualFetch(id);
  // const { featuredProducts, featuredProductsLoading } = useFeaturedProducts();
  const { homeProducts, homeProductsLoading } = useHomeProducts();
  const { wishlist } = useWishlist();

  const { handleAddToCart, addToCartLoading, handleBuyNow, buyNowLoading } =
    useCartHook();

  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "";

  /* =========================
     CORE STATE
  ========================= */

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  /* =========================
     VARIANT MATRIX STATE
  ========================= */

  const [variantMatrix, setVariantMatrix] = useState<VariantMatrix>({});
  const [selectedVarA, setSelectedVarA] = useState<string | null>(null);
  const [selectedVarB, setSelectedVarB] = useState<string | null>(null);

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    if (!product) return;

    if (product.variants?.length) {
      setVariantMatrix(buildVariantMatrix(product.variants));
    } else {
      setVariantMatrix({});
    }

    setMainImage(product.image?.[0] ?? null);
    setSelectedVarA(null);
    setSelectedVarB(null);
    setQty(1);
  }, [product]);

  /* =========================
     DERIVED OPTIONS
  ========================= */

  const availableVarA = useMemo(() => {
    return Array.from(
      new Set(Object.keys(variantMatrix).map((k) => k.split("|")[0]))
    );
  }, [variantMatrix]);

  const availableVarB = useMemo(() => {
    if (!selectedVarA) return [];

    return Array.from(
      new Set(
        Object.keys(variantMatrix)
          .filter((k) => k.startsWith(`${selectedVarA}|`))
          .map((k) => k.split("|")[1])
          .filter(Boolean)
      )
    );
  }, [variantMatrix, selectedVarA]);

  /* =========================
     AUTO-SELECTION LOGIC
  ========================= */

  useEffect(() => {
    if (!selectedVarA && availableVarA.length > 0) {
      setSelectedVarA(availableVarA[0]);
    }
  }, [availableVarA, selectedVarA]);

  useEffect(() => {
    if (!selectedVarA) return;

    // VarA has NO VarB → clear it
    if (availableVarB.length === 0) {
      if (selectedVarB !== null) {
        setSelectedVarB(null);
      }
      return;
    }

    // VarA has VarB but current selection is invalid
    if (!availableVarB.includes(selectedVarB ?? "")) {
      setSelectedVarB(availableVarB[0]);
    }
  }, [availableVarA, availableVarB, selectedVarA, selectedVarB]);

  /* =========================
     SELECTED VARIANT
  ========================= */

  const selectedVariant = useMemo(() => {
    if (!selectedVarA) return null;

    const key =
      selectedVarB !== null
        ? `${selectedVarA}|${selectedVarB}`
        : `${selectedVarA}|`;

    return variantMatrix[key] ?? null;
  }, [variantMatrix, selectedVarA, selectedVarB]);

  /* =========================
     IMAGE SYNC
  ========================= */

  useEffect(() => {
    if (!product) return;

    if (!selectedVariant) {
      setMainImage(product.image?.[0] ?? null);
      return;
    }

    const index = selectedVariant.imageIndex;

    if (index === null || index === undefined) {
      setMainImage(product.image?.[0] ?? null);
      return;
    }

    setMainImage(product.image[index] ?? product.image[0]);
  }, [selectedVariant, product]);

  /* =========================
     PRICE & STOCK
  ========================= */

  if (!product) return <Loading />;
  if (!product)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  // Normalize display price for ts
  const rawPrice = selectedVariant
    ? product.isOnSale
      ? selectedVariant.salePrice ?? selectedVariant.price
      : selectedVariant.price
    : product.isOnSale
    ? product.salePrice ?? product.price
    : product.price;

  const displayPrice = rawPrice ?? 0;
  // =========
  const originalPrice = selectedVariant && product.price;

  const displayStock =
    product.type === "VARIATION"
      ? selectedVariant?.stock ?? null
      : product.stock ?? null;

  const isOutOfStock = displayStock !== null && displayStock < qty;
  const requiresVariation = product.type === "VARIATION";
  const canPurchase = !requiresVariation || selectedVariant;

  const maxQty =
    product.type === "SIMPLE"
      ? product.stock ?? undefined
      : displayStock ?? undefined;

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT IMAGES */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Lens>
              <Image
                src={mainImage ?? product.image?.[0] ?? assets.upload_area}
                alt={product.name}
                className="object-cover"
                width={1280}
                height={720}
              />
            </Lens>
          </div>

          {/* THUMBNAILS */}
          <div className="grid grid-cols-4 gap-4">
            {product.image.map((img, index) => (
              <div
                key={index}
                onClick={() => setMainImage(img)}
                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
              >
                <Image
                  src={img}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                  width={1280}
                  height={720}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — PRODUCT DETAILS */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-medium text-foreground mb-4">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-5 w-5"
                  fill={index < Math.floor(4.5) ? "orange" : "lightgray"}
                  stroke="none"
                />
              ))}
            </div>
            <p>{4.5}</p>
            <span className="text-sm text-foreground/50">
              {13 > 0 && ( // replace 13 with reviews count
                <p>
                  {" | "}
                  {13}
                  {13 > 1 ? " Reviews" : " Review"}
                </p>
              )}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-foreground mt-3">
            {product.description ? product.description : ""}
          </p>

          {/* PRICE */}
          <p
            className={`text-3xl font-medium mt-6 ${
              isOutOfStock ? "text-foreground/50" : "text-foreground"
            }`}
          >
            {currency}
            {formatMoney(displayPrice)}

            {product.isOnSale && product?.salePrice && originalPrice && (
              <span className="text-base font-normal text-foreground/50 line-through ml-2">
                {currency}
                {formatMoney(originalPrice)}
              </span>
            )}
          </p>

          {/* Stock display for VARIATION PRODUCTS */}
          {displayStock !== null && product.type === "VARIATION" && (
            <p className="text-sm text-foreground/60 mt-1">
              {displayStock > 0 ? `Stock: ${displayStock}` : "SOLD OUT"}
            </p>
          )}

          {/* Stock display for SIMPLE PRODUCTS */}
          {product.type === "SIMPLE" && product.stock !== null && (
            <p className="text-sm text-foreground/60 mt-1">
              Stock: {product.stock}
            </p>
          )}

          {/* Variations */}
          {availableVarA.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {availableVarA.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <Label className="text-xs">
                    {product.attributes?.[0] ?? "VarA"}
                  </Label>

                  <VariationComboBox
                    variantName=""
                    variants={availableVarA.map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    value={selectedVarA}
                    onChange={setSelectedVarA}
                  />
                </div>
              )}

              {availableVarB.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <Label className="text-xs">
                    {product.attributes?.[1] ?? "VarB"}
                  </Label>

                  <VariationComboBox
                    variantName=""
                    variants={availableVarB.map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    value={selectedVarB}
                    onChange={setSelectedVarB}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1 mt-3">
            <Label className="text-xs">Quantity</Label>
            <QuantityInput value={qty} onChange={setQty} max={maxQty} />
          </div>

          <hr className="bg-gray-600 my-6" />

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full max-w-72">
              <tbody className="text-sm">
                <tr>
                  <td className="text-foreground font-medium">Brand</td>
                  <td className="text-foreground">
                    {product.brand
                      ? product.brand.charAt(0).toUpperCase() +
                        product.brand.slice(1)
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className="text-foreground font-medium">Condition</td>
                  <td className="text-foreground">Brand-new</td>
                </tr>
                <tr>
                  <td className="foreground font-medium">Category</td>
                  {/* Start with a capital letter */}
                  <td className="text-foreground">
                    {product.category
                      ? product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center mt-10 gap-4">
            <Button
              onClick={() => {
                if (!canPurchase) return;
                handleAddToCart({
                  image: mainImage ?? "placeholder.png",
                  productId: product.id,
                  variantId: selectedVariant?.id,
                  quantity: qty,
                });
              }}
              disabled={!canPurchase || addToCartLoading || isOutOfStock}
              className={`py-6 flex-1 text-gray-800/80 ${
                addToCartLoading
                  ? "bg-gray-400"
                  : "  bg-gray-100 hover:bg-gray-200"
              } transition`}
            >
              {addToCartLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <LoaderIcon
                    className="animate-spin text-background"
                    size={16}
                  />
                  Adding
                </div>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to cart"
              )}
            </Button>

            <Button
              onClick={() => {
                if (!canPurchase) return;
                handleBuyNow({
                  productId: product.id,
                  variantId: selectedVariant?.id,
                  quantity: qty,
                });
              }}
              disabled={!canPurchase || addToCartLoading || isOutOfStock}
              className={`flex-1 py-6 text-white ${
                buyNowLoading
                  ? "bg-primary-loading/50 hover:bg-primary-loading/50"
                  : "  bg-primary hover:bg-primary-hover"
              } transition`}
            >
              {buyNowLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <LoaderIcon className="animate-spin text-white" size={16} />
                  Loading
                </div>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Buy Now"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Similar <span className="font-medium text-primary">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-primary mt-2"></div>
        </div>

        {homeProductsLoading ? (
          /* ================= SKELETON STATE ================= */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3 w-full">
                <Skeleton className="w-full h-40 rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        ) : homeProducts?.length === 0 ? (
          /* ================= EMPTY STATE ================= */
          <div className="py-20 text-center text-foreground/60">
            No featured products available.
          </div>
        ) : (
          /* ================= DATA STATE ================= */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6 pb-14 w-full">
            {homeProducts.slice(0, 6).map((prod: Product, index: number) => (
              <ProductCard key={index} product={prod} wishlist={wishlist} />
            ))}
          </div>
        )}

        {!homeProductsLoading && homeProducts?.length > 0 && (
          <button className="  px-8 py-2 mb-16 border border-foreground rounded text-foreground hover:bg-foreground hover:text-background transition">
            See more
          </button>
        )}
      </div>
    </div>
  );
};

export default IndividualProduct;
