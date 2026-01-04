"use client";

import { assets } from "@/assets/assets";
import {useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import Loading from "@/components/common/Loading";
import useProductHook, { ProductType, Variant } from "@/hooks/useProductHook";
import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import { LoaderIcon, Star } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/common/QuantityInput";
import useWishlist from "@/hooks/useWishlist";
import { Lens } from "@/components/ui/lens";
import { VariationComboBox } from "@/components/product-page/VariationComboBox";

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

const Product = () => {
  const { id } = useParams() as { id: string };
  const { products } = useProductHook();
  const { wishlist } = useWishlist();
  
  const { handleAddToCart, addToCartLoading, handleBuyNow, buyNowLoading } =
    useCartHook();

  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "";

  /* =========================
     CORE STATE
  ========================= */

  const [productData, setProductData] = useState<ProductType | null>(null);
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
    if (!products || products.length === 0) return;

    const product = products.find((p) => p.id === id) ?? null;
    setProductData(product);

    if (product?.variants?.length) {
      setVariantMatrix(buildVariantMatrix(product.variants));
    } else {
      setVariantMatrix({});
    }

    if (product?.image?.length) {
      setMainImage(product.image[0]);
    }
  }, [id, products]);

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
    if (!productData) return;

    if (!selectedVariant) {
      setMainImage(productData.image?.[0] ?? null);
      return;
    }

    const index = selectedVariant.imageIndex;
    setMainImage(productData.image[index] ?? productData.image[0]);
  }, [selectedVariant, productData]);

  /* =========================
     PRICE & STOCK
  ========================= */

  if (!products || products.length === 0) return <Loading />;
  if (!productData)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  const displayPrice = selectedVariant
    ? productData.isOnSale
      ? selectedVariant.salePrice ?? selectedVariant.price
      : selectedVariant.price
    : productData.isOnSale
    ? productData.salePrice ?? productData.price
    : productData.price;

  const displayStock =
    productData.type === "VARIATION"
      ? selectedVariant?.stock ?? null
      : productData.stock ?? null;

  const isOutOfStock = displayStock !== null && displayStock < qty;
  const requiresVariation = productData.type === "VARIATION";
  const canPurchase = !requiresVariation || selectedVariant;

  const maxQty =
    productData.type === "SIMPLE"
      ? productData.stock ?? undefined
      : displayStock ?? undefined;

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT IMAGES */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Lens>
              <Image
                src={mainImage ?? productData.image?.[0] ?? assets.upload_area}
                alt={productData.name}
                className="object-cover"
                width={1280}
                height={720}
              />
            </Lens>
          </div>

          {/* THUMBNAILS */}
          <div className="grid grid-cols-4 gap-4">
            {productData.image.map((img, index) => (
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
            {productData.name}
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
            {productData.description ? productData.description : ""}
          </p>

          {/* PRICE */}
          <p
            className={`text-3xl font-medium mt-6 ${
              isOutOfStock ? "text-foreground/50" : "text-foreground"
            }`}
          >
            {currency}
            {formatMoney(displayPrice)}

            {productData.isOnSale && selectedVariant?.salePrice && (
              <span className="text-base font-normal text-foreground/50 line-through ml-2">
                {currency}
                {formatMoney(selectedVariant.price)}
              </span>
            )}
          </p>

          {/* Stock display for VARIATION PRODUCTS */}
          {displayStock !== null && productData.type === "VARIATION" && (
            <p className="text-sm text-foreground/60 mt-1">
              {displayStock > 0 ? `Stock: ${displayStock}` : "SOLD OUT"}
            </p>
          )}

          {/* Stock display for SIMPLE PRODUCTS */}
          {productData.type === "SIMPLE" && productData.stock !== null && (
            <p className="text-sm text-foreground/60 mt-1">
              Stock: {productData.stock}
            </p>
          )}

          {/* Variations */}
          {availableVarA.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {availableVarA.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <Label className="text-xs">
                    {productData.attributes?.[0] ?? "VarA"}
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
                    {productData.attributes?.[1] ?? "VarB"}
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
                  <td className="text-foreground">Generic</td>
                </tr>
                <tr>
                  <td className="text-foreground font-medium">Color</td>
                  <td className="text-foreground">Multi</td>
                </tr>
                <tr>
                  <td className="foreground font-medium">Category</td>
                  {/* Start with a capital letter */}
                  <td className="text-foreground">
                    {productData.category
                      ? productData.category.charAt(0).toUpperCase() +
                        productData.category.slice(1)
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
                  productId: productData.id,
                  variantId: selectedVariant?.id,
                  quantity: qty,
                });
              }}
              disabled={!canPurchase || addToCartLoading || isOutOfStock}
              className={`py-6 flex-1 text-gray-800/80 ${
                addToCartLoading
                  ? "bg-gray-400"
                  : "cursor-pointer bg-gray-100 hover:bg-gray-200"
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
                  productId: productData.id,
                  variantId: selectedVariant?.id,
                  quantity: qty,
                });
              }}
              disabled={!canPurchase || addToCartLoading || isOutOfStock}
              className={`flex-1 py-6 text-white ${
                buyNowLoading
                  ? "bg-primary-loading/50 hover:bg-primary-loading/50"
                  : "cursor-pointer bg-primary hover:bg-primary-hover"
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
            Featured <span className="font-medium text-primary">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.slice(0, 5).map((prod, index) => (
            <ProductCard key={index} product={prod} wishlist={wishlist} />
          ))}
        </div>

        <button className="cursor-pointer px-8 py-2 mb-16 border border-foreground rounded text-foreground hover:bg-foreground hover:text-background transition">
          See more
        </button>
      </div>
    </div>
  );
};

export default Product;
