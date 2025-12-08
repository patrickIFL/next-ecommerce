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
import { Input } from "@/components/ui/input";
import CategoryComboBox from "@/components/CategoryComboBox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, LoaderIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const EditProduct = () => {
  const { getToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");

  // NEW =====================================
  const [variations, setVariations] = useState("");
  const [searchKeys, setSearchKeys] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  // =========================================

  const { id } = useParams() as { id: string };
  const { products } = useProductHook();
  const [productData, setProductData] = useState<any>(null);
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
    setsalePrice(String(productData.salePrice));

    setSku(productData.sku);
    setStock(String(productData.stock));
    // Convert array → "val1, val2, val3"
    setSearchKeys(productData.search_keys.join(", "));
    // If you also have variations:
    setVariations(productData.variations.join(", "));

    // images
    setFiles([]);
  }, [productData]);

  // Global loading state (products not ready yet)
  // if (!products || products.length === 0) return <Loading />;

  const { mutateAsync: updateProduct, isPending: loading } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      // validate
      if (Number(salePrice) <= 0 || Number(price) <= 0)
        return toast({
          title: "Invalid Price",
          description: "Price must be greater than 0",
          variant: "destructive",
        });

      if (Number(salePrice) < 0)
        return toast({
          title: "Invalid Stock",
          description: "Price must be greater than or equal to 0",
          variant: "destructive",
        });

      const token = await getToken();
      // Convert search keys to array
      const searchKeysArray = searchKeys
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key.length > 0);

      // Convert variations if needed
      const variationsArray = variations
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("sku", sku);
      formData.append("stock", stock);
      // ADD THESE
      formData.append("search_keys", JSON.stringify(searchKeysArray));
      formData.append("variations", JSON.stringify(variationsArray));

      // Append images with indexed keys to match backend
      files.forEach((file: File, index: number) => {
        if (file) formData.append(`images[${index}]`, file);
      });

      try {
        const res = await axios.patch(`/api/product/edit/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.data;
        return data;
      } catch (error: any) {
        const serverMessage =
          error?.response?.data?.message ||
          error.message ||
          "Failed to edit product";

        throw new Error(serverMessage);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (data: any) => {
      toast({ title: "Success", description: data.message });
      router.push("/seller/product-list");
    },
  });

  // Product not found
  if (!productData)
    return <div className="p-10 text-center text-xl">Product not found.</div>;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateProduct();
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between mt-12">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div className="flex flex-col mb-5">
          <p className="text-2xl font-medium">{productData.name}</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
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
                  <Input
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
          <Input
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
          <Textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></Textarea>
        </div>

        {/* // NEW ===================================== */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Variations
          </label>
          <Textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Separate each variation with a comma"
            onChange={(e) => setVariations(e.target.value)}
            value={variations}
          ></Textarea>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Search keys
          </label>
          <Textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Separate each with a comma"
            onChange={(e) => setSearchKeys(e.target.value)}
            value={searchKeys}
          ></Textarea>
        </div>
        {/* ===================================== */}

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col flex-1  gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <CategoryComboBox
              value={category}
              onChange={(val) => setCategory(val)}
            />
          </div>

          {/* // NEW ===================================== */}

          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              <div className="flex gap-1.5 items-center">
                <span>SKU</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={12} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">Stock Keeping Unit</p>
                    <p className="text-[11px]">Stock Keeping Unit</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </label>
            <Input
              id="sku"
              type="text"
              placeholder="Optional"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setSku(e.target.value)}
              value={sku}
            />
          </div>

          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
              autoComplete="off"
            />
          </div>

          {/*  ===================================== */}
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <Input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Sale Price
            </label>
            <Input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setsalePrice(e.target.value)}
              value={salePrice}
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className={`py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded
          ${loading ? "opacity-50" : "cursor-pointer"}`}
            disabled={loading}
          >
            {loading ? (
              <div className="mx-3.5 flex gap-1 items-center">
                <LoaderIcon className="animate-spin" size={16} />
                <span>Updating</span>
              </div>
            ) : (
              <span className="mx-6">UPDATE</span>
            )}
          </Button>

          <Button
            onClick={() => router.back()}
            className={`cursor-pointer py-2.5 text-foreground bg-accent hover:bg-accent/50 font-medium rounded`}
          >
            <span className="mx-6">Cancel</span>
          </Button>
        </div>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default EditProduct;
