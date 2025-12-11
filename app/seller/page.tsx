"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import CategoryComboBox from "@/components/CategoryComboBox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Info, LoaderIcon, PhilippinePeso } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";

const AddProduct = () => {
  const { getToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // NEW =====================================
  const [variations, setVariations] = useState("");
  const [searchKeys, setSearchKeys] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  // =========================================

  const [category, setCategory] = useState("Uncategorized");
  const [price, setPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");

  const { mutateAsync: addProduct, isPending: loading } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      const salePriceNum = salePrice ? Number(salePrice) : null;

      // validate
      if (Number(price) <= 0)
        return toast({
          title: "Invalid Price",
          description: "Price must be greater than 0",
          variant: "destructive",
        });

      if (Number(salePrice) < 0)
        return toast({
          title: "Invalid Stock",
          description: "Stock must be greater than or equal to 0",
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
      formData.append("salePrice", salePriceNum !== null ? salePriceNum.toString() : "");
      formData.append("sku", sku);
      formData.append("stock", stock);
      // ADD THESE
      formData.append("search_keys", JSON.stringify(searchKeysArray));
      formData.append("variations", JSON.stringify(variationsArray));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      try {
        const res = await axios.post("/api/product/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.data;
        return data;
      } catch (error: any) {
        const serverMessage =
          error?.response?.data?.message ||
          error.message ||
          "Failed to add product";

        throw new Error(serverMessage);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Success",
        description: data.message,
        variant: "default",
      });

      setFiles([]);
      setName("");
      setDescription("");
      setCategory("Uncategorized");
      setPrice("");
      setsalePrice("");
      setVariations("");
      setSearchKeys("");
      setSku("");
      setStock("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addProduct();
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between mt-12">
      <form onSubmit={handleSubmit} className="p-5 sm:p-10">
        <div className="flex flex-col mb-5">
          <p className="text-2xl font-medium">New Product</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
        {/* Main Wrapper */}
        <div className="flex flex-col xl:flex-row space-x-10 space-y-5  w-full mb-10">
          {/* Column 1 */}
          <div className="space-y-5 w-full max-w-xl lg:max-w-md">
            <div>
              <p className="text-base font-medium">Product Image</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 min-w-xl">
                {[...Array(4)].map((_, index) => (
                  <label key={index} htmlFor={`image${index}`}>
                    <input
                      onChange={(e: any) => {
                        const updatedFiles: any = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <Image
                      key={index}
                      className="max-w-24 h-24 object-cover rounded cursor-pointer"
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : assets.upload_area
                      }
                      alt=""
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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
                placeholder="Leave as blank - coming soon"
                onChange={(e) => setVariations(e.target.value)}
                value={variations}
              ></Textarea>
            </div>
          </div>
          {/* Column 2 */}
          <div className="space-y-5 max-w-xl lg:max-w-md">
            <div className="flex flex-col gap-1">
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
                <label
                  className="text-base font-medium"
                  htmlFor="product-price"
                >
                  <div className="flex gap-1.5 items-center">
                    <span>SKU</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={12} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">Stock Keeping Unit</p>
                        <p className="text-[11px]">Your Unique Identifier</p>
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
                <label
                  className="text-base font-medium"
                  htmlFor="product-price"
                >
                  Product Price
                </label>
                <div className="flex items-center gap-2">
                  <PhilippinePeso size={18} />
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
              </div>

              <div className="flex flex-col flex-1 gap-1 w-32">
                <label className="text-base font-medium" htmlFor="offer-price">
                  Sale Price
                </label>

                <div className="flex items-center gap-2">
                  <PhilippinePeso size={18} />
                  <Input
                    id="offer-price"
                    type="number"
                    placeholder="Optional"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    onChange={(e) => setsalePrice(e.target.value)}
                    value={salePrice}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className={`py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded
          ${loading ? "opacity-50" : "cursor-pointer"}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="mx-1 flex gap-1 items-center">
                    <LoaderIcon className="animate-spin" size={16} />
                    <span>Loading</span>
                  </div>
                ) : (
                  <span className="mx-6">ADD</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
