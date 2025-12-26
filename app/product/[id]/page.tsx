"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import useProductHook, {
  ProductType,
  Variant,
  VariationsMap,
} from "@/hooks/useProductHook";
import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import { LoaderIcon, Star } from "lucide-react";
import { VariationComboBox } from "@/components/VariationComboBox";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/QuantityInput";
import useWishlist from "@/hooks/useWishlist";

const Product = () => {
  const { id } = useParams() as { id: string };
  const { products } = useProductHook();
  const { wishlist } = useWishlist();

  const [qty, setQty] = useState(1);

  const dummyRating: number = 4.5;
  const dummyRatingCount: number = 13;

  const { handleAddToCart, addToCartLoading, handleBuyNow, buyNowLoading } =
    useCartHook();
  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "";

  const [productData, setProductData] = useState<ProductType | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const [variations, setVariations] = useState<VariationsMap>({
    varA: null,
    varB: null,
  });

  // Automatic Price Detection -- START A
  const [selectedVarA, setSelectedVarA] = useState<string | null>(null);
  const [selectedVarB, setSelectedVarB] = useState<string | null>(null);

  function parseVariantName(name: string) {
    // Remove product suffix: " - Tshirt"
    //  Small, Red
    const clean = name.split(" - ")[0].trim();

    //  parts[0] = Small, parts[1] = Red
    // Split by comma if exists
    const parts = clean.split(",").map((p) => p.trim());

    return {
      varA: parts[0] || null,
      varB: parts[1] || null,
    };
  }

  const selectedVariant =
    productData?.variants?.find((variant) => {
      const parsed = parseVariantName(variant.name);

      if (selectedVarA && parsed.varA !== selectedVarA) return false;
      if (selectedVarB && parsed.varB !== selectedVarB) return false;

      return true;
    }) ?? null;

  // Automatic Price Detection -- END A

  function extractVariations(variants: Variant[]): Required<VariationsMap> {
    const varA = new Set<string>();
    const varB = new Set<string>();

    variants.forEach((variant) => {
      const parsed = parseVariantName(variant.name);
      if (parsed.varA) varA.add(parsed.varA);
      if (parsed.varB) varB.add(parsed.varB);
    });

    return {
      varA: Array.from(varA),
      varB: Array.from(varB),
    };
  }

  // Fetch product when products arrive OR id changes
  useEffect(() => {
    if (!products || products.length === 0) return;

    const product = products.find((p) => p.id === id) || null;
    setProductData(product);

    if (product?.variants?.length) {
      setVariations(extractVariations(product.variants));
    } else {
      setVariations({ varA: null, varB: null });
    }

    if (product?.image?.length) {
      setMainImage(product.image[0]);
    }
  }, [id, products]);

  // Automaticelly Select the first variation when variations change
  useEffect(() => {
    if (variations.varA && variations.varA.length > 0) {
      setSelectedVarA(variations.varA[0]);
    }

    if (variations.varB && variations.varB.length > 0) {
      setSelectedVarB(variations.varB[0]);
    }
  }, [variations]);

  // Change main image when selected variant changes
  useEffect(() => {
    if (!productData) return;

    if (!selectedVariant) {
      setMainImage(productData.image[0]);
      return;
    }
    const index = selectedVariant.imageIndex;
    setMainImage(productData.image[index] ?? productData.image[0]);
  }, [selectedVariant, productData]);

  // Global loading state (products not ready yet)
  if (!products || products.length === 0) return <Loading />;

  // Product not found
  if (!productData)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  // this is the price for the computed variant product
  const displayPrice = selectedVariant
    ? productData.isOnSale
      ? selectedVariant.salePrice ?? selectedVariant.price
      : selectedVariant.price
    : productData.isOnSale
    ? productData.salePrice ?? productData.price
    : productData.price;

  const displayStock: number | undefined = selectedVariant?.stock ?? undefined;

  const requiresVariation = productData.type === "VARIATION";

  const canPurchase = !requiresVariation || selectedVariant;

  const varA = variations.varA ?? [];
  const varB = variations.varB ?? [];

  const maxQty: number | undefined =
    productData.type === "SIMPLE"
      ? productData.stock ?? undefined
      : displayStock;

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT IMAGES */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={mainImage ?? productData.image?.[0] ?? ""}
              alt={productData.name}
              className="w-full h-full object-cover"
              width={1280}
              height={720}
            />
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
                  fill={
                    index < Math.floor(dummyRating) ? "orange" : "lightgray"
                  }
                  stroke="none"
                />
              ))}
            </div>
            <p>{dummyRating}</p>
            <span className="text-sm text-foreground/50">
              {dummyRatingCount > 0 && (
                <p>
                  {" | "}
                  {dummyRatingCount}
                  {dummyRatingCount > 1 ? " Reviews" : " Review"}
                </p>
              )}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-foreground mt-3">
            {productData.description ? productData.description : ""}
          </p>

          {/* PRICE */}
          <p className="text-3xl font-medium mt-6">
            {currency}
            {formatMoney(displayPrice)}

            {productData.isOnSale && selectedVariant?.salePrice && (
              <span className="text-base font-normal text-foreground/50 line-through ml-2">
                {currency}
                {formatMoney(selectedVariant.price)}
              </span>
            )}
          </p>

          {productData.type === "VARIATION" && displayStock !== null && (
            <p className="text-sm text-foreground/60 mt-1">
              {displayStock > 0 ? `Stock: ${displayStock}` : "SOLD OUT"}
            </p>
          )}

          {productData.type === "SIMPLE" && productData.stock !== null && (
            <p className="text-sm text-foreground/60 mt-1">
              Stock: {productData.stock}
            </p>
          )}

          {/* Variations */}
          {(varA.length > 0 || varB.length > 0) && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {varA.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <Label className="text-xs">
                    {productData.attributes?.[0] ?? "VarA"}
                  </Label>

                  <VariationComboBox
                    variantName="Size"
                    variants={varA.map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    value={selectedVarA}
                    onChange={setSelectedVarA}
                  />
                </div>
              )}

              {varB.length > 0 && (
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <Label className="text-xs">
                    {productData.attributes?.[1] ?? "VarB"}
                  </Label>

                  <VariationComboBox
                    variantName="Material"
                    variants={varB.map((v) => ({
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
            <QuantityInput
              value={qty}
              onChange={setQty}
              max={maxQty}
            />
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
                  <td className="text-foreground">{productData.category}</td>
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
                  productId: productData.id,
                  variantId: selectedVariant?.id,
                  quantity: qty,
                });
              }}
              disabled={!canPurchase || addToCartLoading || 
                productData.type === "VARIATION" && selectedVariant?.stock < qty ||
                productData.type === "SIMPLE" && productData?.stock < qty}
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
              disabled={!canPurchase || buyNowLoading || 
                productData.type === "VARIATION" && selectedVariant?.stock < qty ||
                productData.type === "SIMPLE" && productData?.stock < qty}
              className={`flex-1 py-6 text-white ${
                buyNowLoading
                  ? "bg-primary-loading"
                  : "cursor-pointer bg-primary hover:bg-primary-hover"
              } transition`}
            >
              {buyNowLoading ? (
                <div className="flex gap-2 justify-center items-center">
                  <LoaderIcon className="animate-spin text-white" size={16} />
                  Loading
                </div>
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
