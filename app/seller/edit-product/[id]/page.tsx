"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import useProductHook from "@/hooks/useProductHook";
import Loading from "@/components/Loading";

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  category: string;
  image: string[];
};

const EditProduct = () => {
  const { getToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const { products } = useProductHook();
  const [productData, setProductData] = useState<ProductType | null>(null);
  const router = useRouter();

  useEffect(() => {
    // if (!products || products.length === 0) return; // still loading
    const product = products.find((p) => p.id === id) || null;
    setProductData(product);
  }, [id, products]);

  useEffect(() => {
    if (!productData) return;

    setName(productData.name);
    setDescription(productData.description);
    setCategory(productData.category);
    setPrice(String(productData.price));
    setOfferPrice(String(productData.offerPrice));

    // images
    setFiles([]);
  }, [productData]);

  // Global loading state (products not ready yet)
  // if (!products || products.length === 0) return <Loading />;

  // Product not found
  if (!productData)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);

    // MUST match backend
    for (let i = 0; i < 4; i++) {
      const file = files[i];

      // Safe File detection for Next.js
      const isRealFile =
        file &&
        typeof file === "object" &&
        "name" in file &&
        "size" in file;

      if (isRealFile) {
        formData.append(`images[${i}]`, file as any);
      } else {
        formData.append(`images[${i}]`, "");
      }
    }


    try {
      const token = await getToken();
      setLoading(true);

      const { data } = await axios.patch(`/api/product/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      if (data.success) {
        toast({ title: "Success", description: data.message });
        router.push("/seller/product-list");
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between mt-16">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => {
              const existingImage = productData?.image?.[index]; // may be string or null
              const previewImage = files[index]
                ? URL.createObjectURL(files[index])
                : existingImage
                  ? existingImage
                  : assets.upload_area;

              return (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e: any) => {
                      const updatedFiles: any = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                  />

                  <Image
                    src={previewImage}
                    alt={`image-${index}`}
                    width={100}
                    height={100}
                    className="max-w-24 h-24 object-cover rounded cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={() => { }}
          className={`px-8 py-2.5 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white font-medium rounded
    ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "UPDATE"}
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default EditProduct;
