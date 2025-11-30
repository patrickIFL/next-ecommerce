"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import useProductHook from "@/hooks/useProductHook";
import useCartHook from "@/hooks/useCartHook";

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  category: string;
  image: string[];
};

const Product = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { products } = useProductHook();
  const { handleAddToCart } = useCartHook();

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
    return (
      <div className="p-10 text-center text-xl">
        Product not found.
      </div>
    );

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT IMAGES */}
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={mainImage || productData.image[0]}
              alt={productData.name}
              className="w-full h-auto object-cover"
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
                  className="w-full h-auto object-cover"
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
              <Image className="h-4 w-4" src={assets.star_icon} alt="star" />
              <Image className="h-4 w-4" src={assets.star_icon} alt="star" />
              <Image className="h-4 w-4" src={assets.star_icon} alt="star" />
              <Image className="h-4 w-4" src={assets.star_icon} alt="star" />
              <Image
                className="h-4 w-4"
                src={assets.star_dull_icon}
                alt="star"
              />
            </div>
            <p>(4.5)</p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-foreground mt-3">{productData.description}</p>

          {/* PRICE */}
          <p className="text-3xl font-medium mt-6">
            ${productData.offerPrice}
            <span className="text-base font-normal text-foreground/50 line-through ml-2">
              ${productData.price}
            </span>
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
              className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                handleAddToCart(productData.id);
                router.push("/cart");
              }}
              className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Featured{" "}
            <span className="font-medium text-orange-600">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
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
