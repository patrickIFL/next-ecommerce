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
import { Info, LoaderIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [offerPrice, setOfferPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

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
    formData.append("offerPrice", offerPrice);

    formData.append("sku", sku);
    formData.append("stock", stock);

    // ADD THESE
    formData.append("search_keys", JSON.stringify(searchKeysArray));
    formData.append("variations", JSON.stringify(variationsArray));

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      setLoading(true);
      const { data } = await axios.post("/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setLoading(false);
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
        setOfferPrice("");
        setVariations("");
        setSearchKeys("");
        setSku("");
        setStock("");
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
            required
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
            placeholder="Leave as blank - coming soon"
            onChange={(e) => setVariations(e.target.value)}
            value={variations}
            required
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
            required
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
                    <p>Stock Keeping Unit</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </label>
            <Input
              id="product-price"
              type="text"
              placeholder="Unique Identifier"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setSku(e.target.value)}
              value={sku}
              required
            />
          </div>

          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Stock
            </label>
            <Input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
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
            />
          </div>

          <div className="flex flex-col flex-1 gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <Input
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

        <Button
          type="submit"
          className={`py-2.5 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white font-medium rounded
          ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
