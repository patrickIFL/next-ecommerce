"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Activity, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { assets } from "@/assets/assets";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CategoryComboBox from "@/components/common/CategoryComboBox";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Label } from "@/components/ui/label";

import {
  Info,
  LoaderIcon,
  PhilippinePeso,
  SquareCheckBig,
  SquarePen,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useEditVariationModal } from "@/hooks/useEditVariationModal";
import { VariationModal } from "@/components/seller/VariationModal";
import BrandComboBox from "@/components/common/BrandComboBox";
import { useIndividualFetch } from "@/hooks/FetchProduct/useIndividualFetch";
import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { Variation } from "@/lib/types";
import { useProductVariations } from "@/hooks/useProductVariations";
import { ProductVariation } from "@/hooks/useVariationModal";

/* ===================================================== */

const EditProduct = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const router = useRouter();
  const { product } = useIndividualFetch(id);
  const variationModal = useEditVariationModal();
  const [addingNewVariations, setAddingNewVariations] = useState(false);

  /* ===================== CORE STATE ===================== */

  // const [product, setproduct] = useState<any>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");

  const [price, setPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  const [searchKeys, setSearchKeys] = useState("");

  /* ===================== VARIATION STATE ===================== */

  const [attributes, setAttributes] = useState<string[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);

  const [varAName, setVarAName] = useState("Variation A");
  const [varBName, setVarBName] = useState("Variation B");

  const [variationA, setVariationA] = useState("");
  const [variationB, setVariationB] = useState("");

  const [isModifyingA, setisModifyingA] = useState(false);
  const [isModifyingB, setisModifyingB] = useState(false);
  const [finalVariations, setFinalVariations] = useState<Variation[]>([]);

  /* ===================== LOAD PRODUCT ===================== */

  useEffect(() => {
    if (!product) return;

    // ---------- Core fields ----------
    setName(product.name ?? "");
    setDescription(product.description ?? "");
    setCategory(product.category ?? "");
    setBrand(product.brand ?? "");
    setType(product.type);

    setSearchKeys((product.search_keys ?? []).join(", "));
    setFiles([]);

    // ---------- SIMPLE product ----------
    if (product.type === "SIMPLE") {
      setPrice(product.price != null ? String(product.price / 100) : "");

      setsalePrice(
        product.salePrice != null ? String(product.salePrice / 100) : ""
      );

      setSku(product.sku ?? "");
      setStock(String(product.stock ?? 0));
    }

    // ---------- VARIATION product ----------
    if (product.type === "VARIATION") {
      const attributes = product.attributes ?? [];

      setVarAName(attributes[0] ?? "Variation A");
      setVarBName(attributes[1] ?? "Variation B");
      setAttributes(attributes);

      setVariations(
        product.variants.map((v: any) => ({
          ...v,
          price: v.price / 100,
          salePrice: v.salePrice ? v.salePrice / 100 : "",
        }))
      );
    }
  }, [product]);

  /* ===================== IMAGE OPTIONS ===================== */

  const imageOptions = [
    ...(product?.image || []).map((url: string, index: number) => ({
      index,
      url,
    })),
    ...files.map((file, index) => ({
      index,
      url: URL.createObjectURL(file),
    })),
  ];

  /* ===================== VARIATION GENERATOR ===================== */

  const { generate } = useProductVariations<ProductVariation>();

const handleGenerateVariations = async () => {
  await generate({
    variationA,
    variationB,
    productName: name,
    existing: finalVariations.length ? finalVariations : variations,
    markAsNew: true,
    onGenerated: (merged) => {
      variationModal.openEdit(merged);
      setFinalVariations(merged);
    },
  });

  setVariationA("");
  setVariationB("");
  setAddingNewVariations(false);
};


  /* ===================== VALIDATION ===================== */

  const validateVariations = (list: any[]) => {
    if (!list.length) {
      throw new Error("No variations found. Please generate and confirm.");
    }

    return list.map((v) => {
      const price = Number(v.price);
      const stock = Number(v.stock);
      const salePrice =
        v.salePrice === "" || v.salePrice === null ? null : Number(v.salePrice);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${v.name}`);
      }

      if (!Number.isFinite(stock) || stock < 0) {
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
  };

  /* ===================== ATTRIBUTE → VARIANT SYNC ===================== */

  useEffect(() => {
    if (type !== "VARIATION") return;
    if (!variations.length) return;

    setVariations((prev) =>
      prev.map((v) => {
        const base = v.name.split(" - ").pop();
        const parts = v.name
          .split(" - ")[0]
          .split(",")
          .map((p: any) => p.trim());

        return {
          ...v,
          name: `${parts.join(", ")} - ${base}`,
        };
      })
    );
  }, [varAName, varBName, type, variations.length]);

  /* ===================== IMAGE APPEND ===================== */

  const appendImagesSafely = (formData: FormData) => {
    files.forEach((file, index) => {
      if (file) {
        formData.append(`images[${index}]`, file);
      }
    });
  };

  /* ===================== MUTATION ===================== */

  const { mutateAsync: updateProduct, isPending: loading } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);

      formData.append(
        "search_keys",
        JSON.stringify(
          searchKeys
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        )
      );

      if (type === "SIMPLE") {
        if (Number(price) <= 0) {
          throw new Error("Price must be greater than 0");
        }

        formData.append("price", price);
        formData.append("salePrice", salePrice || "");
        formData.append("sku", sku);
        formData.append("stock", stock);
      }

      if (type === "VARIATION") {
        const safeVariations = validateVariations(
          finalVariations.length ? finalVariations : variations
        );

        formData.append(
          "attributes",
          JSON.stringify([varAName, varBName].filter(Boolean))
        );

        formData.append("variations", JSON.stringify(safeVariations));
      }

      appendImagesSafely(formData);

      const res = await fetch(`/api/product/edit/${id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to edit product");
      }

      const data = await res.json();

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/seller/product-list");
    },

    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SIMPLE validation
    if (type === "SIMPLE") {
      if (!name.trim()) {
        toast.error("Product name is required.");
        return;
      }

      if (Number(price) <= 0) {
        toast.error("Price must be greater than 0.");
        return;
      }
    }

    // VARIATION validation
    if (type === "VARIATION") {
      if (
        (finalVariations.length === 0 && variations.length === 0) ||
        ![varAName, varBName].some(Boolean)
      ) {
        toast.error("Please generate and confirm variations.");
        return;
      }

      try {
        // normalize before submit
        const normalized = validateVariations(
          finalVariations.length ? finalVariations : variations
        );
        setFinalVariations(normalized);
      } catch (err: any) {
        toast.error(err.message);
        return;
      }
    }

    await updateProduct();
  };

  /* ===================== UI ===================== */

  if (!product) {
    return <div className="p-10 text-center text-xl">Product not found.</div>;
  }

  return (
    <>
      <div className="px-6 py-6  min-h-screen w-full mt-16">
        <SellerPageTitle title="Edit Product" />
        <form onSubmit={handleSubmit}>
          {/* Main Wrapper */}
          <div className="flex flex-col xl:flex-row space-x-10 space-y-5 w-full mb-10">
            {/* Column 1 */}
            <div className="space-y-5 w-full max-w-xl lg:max-w-md">
              <div>
                <p className="text-base font-medium">Product Image</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 min-w-xl">
                  {[...Array(4)].map((_, index) => (
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
                        className="max-w-24 h-24 object-cover rounded cursor-pointer"
                        src={
                          files[index]
                            ? URL.createObjectURL(files[index])
                            : product?.image?.[index] || assets.upload_area
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
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium">
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
                  rows={4}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                  placeholder="(Optional) Separate each with a comma"
                  onChange={(e) => setSearchKeys(e.target.value)}
                  value={searchKeys}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div
              className={`${
                type === "VARIATION" ? "space-y-3" : "space-y-5"
              } w-full max-w-xl lg:max-w-md flex flex-col`}
            >
              {/* Category + SKU + Stock */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex flex-col flex-1 gap-1 w-32">
                  <label className="text-base font-medium">Category</label>
                  <CategoryComboBox
                    value={category}
                    onChange={(val) => setCategory(val)}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-1 w-32">
                  <label className="text-base font-medium">Brand</label>
                  <BrandComboBox
                    value={brand}
                    onChange={(val) => setBrand(val)}
                  />
                </div>

                <Activity mode={type === "SIMPLE" ? "visible" : "hidden"}>
                  <>
                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label className="text-base font-medium">SKU</label>
                      <Input
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

              {/* SIMPLE Prices */}
              <Activity mode={type === "SIMPLE" ? "visible" : "hidden"}>
                <>
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-base font-medium">Stock</label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-20 outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                      />
                    </div>

                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label className="text-base font-medium">
                        Product Price
                      </label>
                      <div className="flex items-center gap-2">
                        <PhilippinePeso size={18} />
                        <Input
                          type="number"
                          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 gap-1 w-32">
                      <label className="text-base font-medium">
                        SALE Price
                      </label>
                      <div className="flex items-center gap-2">
                        <PhilippinePeso size={18} />
                        <Input
                          type="number"
                          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                          onChange={(e) => setsalePrice(e.target.value)}
                          value={salePrice}
                        />
                      </div>
                    </div>
                  </div>
                </>
              </Activity>

              {/* VARIATION */}
              <Activity mode={type === "VARIATION" ? "visible" : "hidden"}>
                <Label className="text-lg underline underline-offset-2">
                  Product Attributes
                </Label>
                {/* Variation A */}
                <div className="flex flex-col gap-1">
                  <Label className="text-base font-medium">
                    <div className="flex items-center justify-between">
                      {isModifyingA ? (
                        <Input
                          className="w-30 text-md"
                          value={varAName}
                          onChange={(e) => setVarAName(e.target.value)}
                        />
                      ) : (
                        <span className="w-30">• {varAName}</span>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (isModifyingA) {
                            setAttributes([varAName, varBName].filter(Boolean));
                          }
                          setisModifyingA(!isModifyingA);
                        }}
                        className=" "
                      >
                        {isModifyingA ? (
                          <SquareCheckBig size={16} />
                        ) : (
                          <SquarePen size={16} />
                        )}
                      </Button>
                    </div>
                  </Label>
                  <Activity mode={addingNewVariations ? "visible" : "hidden"}>
                    <Input
                      className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                      placeholder="eg. Sml, Med, Lrg"
                      onChange={(e) => setVariationA(e.target.value)}
                      value={variationA}
                    />
                  </Activity>
                </div>

                {/* Variation B */}
                <div className="flex flex-col gap-1">
                  <Label className={`font-medium text-base`}>
                    <div className="flex items-center">
                      {isModifyingB ? (
                        <Input
                          className="w-30 text-md"
                          value={varBName}
                          onChange={(e) => setVarBName(e.target.value)}
                        />
                      ) : (
                        <span className="w-30">• {varBName}</span>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (isModifyingB) {
                            setAttributes([varAName, varBName].filter(Boolean));
                          }
                          setisModifyingB(!isModifyingB);
                        }}
                        className=" "
                      >
                        {isModifyingB ? (
                          <SquareCheckBig size={16} />
                        ) : (
                          <SquarePen size={16} />
                        )}
                      </Button>
                    </div>
                  </Label>

                  <Activity mode={addingNewVariations ? "visible" : "hidden"}>
                    <Input
                      placeholder="eg. Red, Blue, Yellow"
                      disabled={!variationA.trim()}
                      value={variationB}
                      onChange={(e) => setVariationB(e.target.value)}
                      className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />
                  </Activity>
                </div>

                {!addingNewVariations && (
                  <Button
                    type="button"
                    onClick={() => {
                      setAddingNewVariations(true);
                    }}
                    className={`max-w-[200px]   bg-gray-100 hover:bg-gray-200 transition`}
                  >
                    Add Variations
                  </Button>
                )}

                {addingNewVariations && (
                  <Button
                    type="button"
                    onClick={() => {
                      handleGenerateVariations();
                    }}
                    className="max-w-[200px] bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Generate New Variations
                  </Button>
                )}
              </Activity>

              {/* Submit */}
              {product.type === "VARIATION" && (
                <Button
                  type="button"
                  variant={"secondary"}
                  className="  max-w-[200px]"
                  onClick={() => {
                    variationModal.openEdit(
                      finalVariations.length ? finalVariations : variations
                    );
                  }}
                >
                  Modify Variations
                </Button>
              )}

              <Button
                className="  text-white max-w-[200px]"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderIcon className="animate-spin" size={16} />
                    <span>Saving</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <VariationModal
        open={variationModal.open}
        onOpenChange={(open) => {
          if (!open) variationModal.close();
        }}
        parentProductName={name}
        imageOptions={imageOptions}
        generatedVariations={variationModal.generatedVariations}
        onConfirm={(confirmed) => {
          if (variationModal.mode === "ADD") {
            // append, avoid duplicates
            setFinalVariations((prev) => {
              const existingNames = new Set(
                (prev.length ? prev : variations).map((v) => v.name)
              );

              const merged = [
                ...(prev.length ? prev : variations),
                ...confirmed.filter((v) => !existingNames.has(v.name)),
              ];

              return merged;
            });
          } else {
            // EDIT mode replaces
            setFinalVariations(confirmed);
          }

          variationModal.close();
        }}
      />
    </>
  );
};

export default EditProduct;
