"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import useProductHook from "@/hooks/useProductHook";
import useCartHook from "@/hooks/useCartHook";
import { formatMoney } from "@/lib/utils";
import { LoaderIcon, Star } from "lucide-react";

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  category: string;
  image: string[];
  isOnSale: boolean;
};

const Product = () => {
  const { id } = useParams() as { id: string };
  const { products } = useProductHook();
  const dummyRating:number = 4.5
  const { handleAddToCart, addToCartLoading, handleBuyNow, buyNowLoading } = useCartHook();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [productData, setProductData] = useState<ProductType | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Fetch product when products arrive OR id changes
  useEffect(() => {
    if (!products || products.length === 0) return; // still loading
    const product = products.find((p) => p.id === id) || null;
    setProductData(product);

    if (product && product.image?.length > 0) {
      setMainImage(product.image[0]);
    }
  }, [id, products]);

  // Global loading state (products not ready yet)
  if (!products || products.length === 0) return <Loading />;

  // Product not found
  if (!productData)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  const isSale = productData.isOnSale;

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT IMAGES */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={mainImage || productData.image[0]}
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
                fill={index < Math.floor(dummyRating) ? "orange" : "lightgray"}
                stroke="none"
              />
            ))}
          </div>
            <p>{dummyRating}</p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-foreground mt-3">{productData.description ? productData.description : ""}</p>

          {/* PRICE */}
          <p className="text-3xl font-medium mt-6">
            {currency}
            {formatMoney(
              isSale 
              ? (productData.salePrice
                ? productData.salePrice 
                : productData.price)
              : productData.price)}
            
            {isSale && productData.salePrice && (
              <span className="text-base font-normal text-foreground/50 line-through ml-2">
                {currency}
                {formatMoney(productData.price)}
              </span>
            )}
          </p>

          <hr className="bg-gray-600 my-6" />

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full max-w-72">
              <tbody>
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
            <button
              onClick={() => handleAddToCart(productData.id)}
              disabled={addToCartLoading}
              className={`w-full py-3.5 text-gray-800/80 ${addToCartLoading ? "bg-gray-400" : "cursor-pointer bg-gray-100 hover:bg-gray-200"} transition`}
            >
              {addToCartLoading 
              ? (<div className="flex gap-2 justify-center items-center">
                <LoaderIcon className="animate-spin text-background" size={16} />
                Adding
              </div>) 
              : "Add to cart"}
              
            </button>

            <button
              onClick={() => {
                handleBuyNow(productData.id);
              }}
              disabled={buyNowLoading}
              className={`w-full py-3.5 text-white ${buyNowLoading ? "bg-primary-loading" : "cursor-pointer bg-primary hover:bg-primary-hover"} transition`}
            >
              {buyNowLoading 
              ? (<div className="flex gap-2 justify-center items-center">
                <LoaderIcon className="animate-spin text-white" size={16} />
                Loading
              </div>) 
              : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Featured{" "}
            <span className="font-medium text-primary">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.slice(0, 5).map((prod, index) => (
            <ProductCard key={index} product={prod} />
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
