"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Activity, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import CategoryComboBox from "@/components/common/CategoryComboBox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Info,
  LoaderIcon,
  PhilippinePeso,
  SquareCheckBig,
  SquarePen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVariationModal } from "@/hooks/useVariationModal";
import { toast } from "react-hot-toast";
import { VariationModal } from "@/components/seller/VariationModal";
import BrandComboBox from "@/components/common/BrandComboBox";
import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { useProductVariations } from "@/hooks/useProductVariations";
import { Variation } from "@/lib/types";

const AddProduct = () => {
  // Value States
  const [files, setFiles] = useState([]);
  const imageOptions = files
    .map((file, index) => {
      if (!file) return null;

      return {
        index,
        url: URL.createObjectURL(file),
      };
    })
    .filter(Boolean);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variationA, setVariationA] = useState("");
  const [variationB, setVariationB] = useState("");
  const [searchKeys, setSearchKeys] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");
  const [varAName, setVarAName] = useState("Variation A");
  const [varBName, setVarBName] = useState("Variation B");
  const [brand, setBrand] = useState("Generic");
  const [category, setCategory] = useState("Uncategorized");
  const [price, setPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");

  // Tracker States
  const [isModifyingA, setisModifyingA] = useState(false);
  const [isModifyingB, setisModifyingB] = useState(false);
  const [isGeneratingVariations, setisGeneratingVariations] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const variationModal = useVariationModal();

  // Pushed up state of Variations from modal
  const [finalVariations, setFinalVariations] = useState<any[]>([]);

  const { generate } = useProductVariations<Variation>();

const handleGenerateVariations = async () => {
  setisGeneratingVariations(true);

  await generate({
    variationA,
    variationB,
    productName: name,
    onGenerated: (results) => {
      variationModal.setGeneratedVariations(results);
    },
  });

  setisGeneratingVariations(false);
};


  const { mutateAsync: addProduct, isPending: loading } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      const salePriceNum = salePrice ? Number(salePrice) : null;

      // ✅ validate ONLY for simple products
      if (type === "SIMPLE") {
        if (Number(price) <= 0) {
          throw new Error("Price must be greater than 0");
        }
        if (Number(stock) <= 0) {
          throw new Error("Stock must be greater than 0");
        }
        if (salePrice && Number(salePrice) < 0) {
          throw new Error("Sale price cannot be negative");
        }
      }

      if (type === "VARIATION") {
        if (finalVariations.length === 0) {
          throw new Error("Empty variations");
        }
      }

      const searchKeysArray = searchKeys
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("type", type);

      formData.append("attributes", JSON.stringify([varAName, varBName]));

      // Make sure the variations are valid before passing
      const safeVariations =
        type === "VARIATION"
          ? finalVariations.map((v) => ({
              name: v.name,
              sku: v.sku || null,
              price: Number(v.price),
              salePrice: v.salePrice === "" ? null : Number(v.salePrice),
              stock: Number(v.stock),
              imageIndex: v.imageIndex,
            }))
          : [];

      formData.append("variations", JSON.stringify(safeVariations));

      formData.append("search_keys", JSON.stringify(searchKeysArray));

      // ✅ simple-only fields
      if (type === "SIMPLE") {
        formData.append("price", price);
        formData.append(
          "salePrice",
          salePriceNum !== null ? salePriceNum.toString() : ""
        );
        formData.append("sku", sku);
        formData.append("stock", stock);
      } //====

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/product/add", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      const data = await res.json();

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      setFiles([]);
      setName("");
      setDescription("");
      setCategory("Uncategorized");
      setType("SIMPLE");
      setPrice("");
      setsalePrice("");
      setSearchKeys("");
      setSku("");
      setStock("");
      setGenerateError("");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (type === "VARIATION") {
      if (finalVariations.length === 0) {
        toast.error("Empty variations");
        return;
      }

      const normalized = finalVariations.map((v) => {
        const price = Number(v.price);
        const stock = Number(v.stock);
        const salePrice = v.salePrice === "" ? null : Number(v.salePrice);

        if (Number.isNaN(price) || price <= 0) {
          throw new Error(`Invalid price for ${v.name}`);
        }

        if (Number.isNaN(stock) || stock < 0) {
          throw new Error(`Invalid stock for ${v.name}`);
        }

        if (salePrice !== null && salePrice < 0) {
          throw new Error(`Invalid sale price for ${v.name}`);
        }

        return {
          ...v,
          price,
          stock,
          salePrice,
        };
      });

      // ✅ overwrite with numeric-safe data
      setFinalVariations(normalized);
    }

    await addProduct();
  };

  return (
    <>
      <div className="px-6 py-6  min-h-screen w-full mt-16">
          <SellerPageTitle title="New Product" />
        <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your product's name"
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
                  placeholder="(Optional) Describe your product"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></Textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-base font-medium"
                  htmlFor="product-description"
                >
                  <div className="flex gap-1.5 items-center">
                    <span>Search Keys</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={12} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-[11px]">
                          Enter keywords to help customers find this product
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </label>
                <Textarea
                  id="product-description"
                  rows={4}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                  placeholder="(Optional) Separate each with a comma"
                  onChange={(e) => setSearchKeys(e.target.value)}
                  value={searchKeys}
                ></Textarea>
              </div>
            </div>
            {/* ===================================== */}
            {/* Column 2 */}
            <div
              className={`${
                type === "VARIATION" ? "space-y-3" : "space-y-5"
              } max-w-xl lg:max-w-md`}
            >
              <div className="flex gap-2">
                <label
                  className="text-base font-medium"
                  htmlFor="product-description"
                >
                  Product Type
                </label>
                <RadioGroup
                  className="flex min-w-xs justify-around"
                  value={type}
                  onValueChange={(val) =>
                    setType(val as "SIMPLE" | "VARIATION")
                  }
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="SIMPLE" id="r1" />
                    <Label htmlFor="r1">Simple</Label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="VARIATION" id="r2" />
                    <Label htmlFor="r2">Variation</Label>
                  </div>
                </RadioGroup>
              </div>

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

                <div className="flex flex-col flex-1  gap-1 w-32">
                  <label className="text-base font-medium" htmlFor="category">
                    Brand
                  </label>
                  <BrandComboBox
                    value={brand}
                    onChange={(val) => setBrand(val)}
                  />
                </div>

                <Activity mode={type === "SIMPLE" ? "visible" : "hidden"}>
                  <>
                    {/* SKU */}
                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label className="text-base font-medium" htmlFor="sku">
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
                        placeholder="(Optional)"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        onChange={(e) => setSku(e.target.value)}
                        value={sku}
                      />
                    </div>
                  </>
                </Activity>
              </div>

              {/* type is simple product */}
              <Activity mode={type === "SIMPLE" ? "visible" : "hidden"}>
                <>
                  {/* Prices */}
                  <div className="flex items-center gap-5 flex-wrap">
                    {/* Stock */}
                    <div className="flex flex-col gap-1">
                      <label className="text-base font-medium" htmlFor="stock">
                        Stock
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-20 outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                        required={type === "SIMPLE"}
                      />
                    </div>
                    {/* Product Price */}
                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label
                        className="text-base font-medium"
                        htmlFor="product-price"
                      >
                        <div className="flex gap-1.5 items-center">
                          <span>Product Price</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={12} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-[11px]">Original Price</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
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
                          required={type === "SIMPLE"}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    {/* Sale Price */}
                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label
                        className="text-base font-medium"
                        htmlFor="offer-price"
                      >
                        <div className="flex gap-1.5 items-center">
                          <span>SALE Price</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={12} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-[11px]">Price when on SALE</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </label>

                      <div className="flex items-center gap-2">
                        <PhilippinePeso size={18} />
                        <Input
                          id="offer-price"
                          type="number"
                          placeholder="(Optional)"
                          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                          onChange={(e) => setsalePrice(e.target.value)}
                          value={salePrice}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </>
              </Activity>

              <Activity mode={type === "VARIATION" ? "visible" : "hidden"}>
                <Label className="text-lg underline underline-offset-2">
                  Product Attributes
                </Label>
                {/* Variation A */}
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-base font-medium"
                    htmlFor="product-description"
                  >
                    <div className="flex items-center justify-between">
                      {isModifyingA ? (
                        <>
                          <Input
                            className="w-30 text-md"
                            onChange={(e) => {
                              setVarAName(e.target.value);
                            }}
                            value={varAName}
                          />
                        </>
                      ) : (
                        <>
                          <span className="w-30">• {varAName}</span>
                        </>
                      )}
                      <Button
                        variant={"ghost"}
                        onClick={() => setisModifyingA(!isModifyingA)}
                        type="button"
                        className=" "
                      >
                        {isModifyingA ? (
                          <>
                            <SquareCheckBig size={16} />
                          </>
                        ) : (
                          <>
                            <SquarePen size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </Label>
                  <Input
                    id="product-variations"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                    placeholder="eg. Sml, Med, Lrg"
                    onChange={(e) => setVariationA(e.target.value)}
                    value={variationA}
                  />
                </div>

                {/* Variation B */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="product-description"
                    className={`font-medium
                     ${
                       !variationA.trim() ? "text-foreground/40" : "text-base"
                     } `}
                  >
                    <div className="flex items-center">
                      {isModifyingB ? (
                        <>
                          <Input
                            className="w-30 text-md"
                            onChange={(e) => {
                              setVarBName(e.target.value);
                            }}
                            value={varBName}
                          />
                        </>
                      ) : (
                        <>
                          <span className="w-30">• {varBName}</span>
                        </>
                      )}
                      <Button
                        variant={"ghost"}
                        disabled={!variationA.trim()}
                        onClick={() => setisModifyingB(!isModifyingB)}
                        type="button"
                        className=" "
                      >
                        {isModifyingB ? (
                          <>
                            <SquareCheckBig size={16} />
                          </>
                        ) : (
                          <>
                            <SquarePen size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </Label>
                  <div
                    className={`${!variationA.trim() && "cursor-not-allowed"} `}
                  >
                    <Input
                      id="product-variations"
                      placeholder="eg. Red, Blue, Yellow"
                      value={variationB}
                      onChange={(e) => setVariationB(e.target.value)}
                      disabled={!variationA.trim()}
                      className={`outline-none md:py-2.5 py-2 px-3 rounded resize-none border`}
                    />
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  {/* {variationA.trim() && (
                    <> */}
                  <Button
                    type="button"
                    onClick={() => {
                      if (!name) {
                        setGenerateError("empty name");
                        return;
                      }
                      if (files.length === 0) {
                        setGenerateError("empty image");
                        return;
                      }

                      if (!variationA) {
                        setGenerateError("empty variation");
                        return;
                      }

                      if (variationModal.generatedVariations.length === 0) {
                        handleGenerateVariations();
                      }
                      variationModal.openModal();
                      setGenerateError("");
                    }}
                    className={`w-full max-w-[200px] font-medium 
                      ${
                        isGeneratingVariations
                          ? "hover:bg-gray-100/80 bg-gray-100/80" // disabled look
                          : "  bg-gray-100 hover:bg-gray-200"
                      } transition`}
                    disabled={isGeneratingVariations}
                  >
                    {isGeneratingVariations ? (
                      <div className="text-gray-400 mx-1 flex gap-1 items-center">
                        <LoaderIcon className="animate-spin" size={16} />
                        <div className="">Generating...</div>
                      </div>
                    ) : (
                      <div className="text-gray-800/80">
                        {variationModal.generatedVariations.length === 0
                          ? "Generate Variations"
                          : "Modify Variations"}
                      </div>
                    )}
                  </Button>
                  {generateError && (
                    <span className="text-destructive">
                      {generateError === "empty name" && "Please enter a name."}
                      {generateError === "empty image" &&
                        "Please enter some images."}
                      {generateError === "empty variation" &&
                        "Please enter some variations first."}
                    </span>
                  )}
                  {/* </>
                  )} */}
                </div>
              </Activity>
              <Button
                type="submit"
                className={`w-full max-w-[200px] bg-primary hover:bg-primary-hover text-white font-medium
            ${loading ? "opacity-50" : " "}`}
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <div className="mx-1 flex gap-1 items-center">
                    <LoaderIcon className="animate-spin" size={16} />
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  <span className="mx-14.5">Add Product</span>
                )}
              </Button>
            </div>
          </div>
        </form>
        {/* <Footer /> */}
      </div>

      <VariationModal
        open={variationModal.open}
        onOpenChange={variationModal.setOpen}
        parentProductName={name}
        imageOptions={imageOptions}
        generatedVariations={variationModal.generatedVariations}
        onConfirm={setFinalVariations}
      />
    </>
  );
};

export default AddProduct;
