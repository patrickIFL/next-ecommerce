"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

import { assets } from "@/assets/assets";
import useProductHook from "@/hooks/useProductHook";
import { useVariationModal } from "@/hooks/useVariationModal";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CategoryComboBox from "@/components/CategoryComboBox";
import { VariationModal } from "@/components/VariationModal";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Info, LoaderIcon, PhilippinePeso } from "lucide-react";

/* ===================================================== */

const EditProduct = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { getToken } = useAuth();
  const { products } = useProductHook();
  const variationModal = useVariationModal();

  /* ===================== STATE ===================== */

  const [productData, setProductData] = useState<any>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");

  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  const [searchKeys, setSearchKeys] = useState("");

  const [attributes, setAttributes] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);

  /* ===================== LOAD PRODUCT ===================== */

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) setProductData(product);
  }, [id, products]);

  useEffect(() => {
    if (!productData) return;

    setName(productData.name);
    setDescription(productData.description);
    setCategory(productData.category);
    setType(productData.type);
    setSearchKeys(productData.search_keys.join(", "));

    setFiles([]);

    if (productData.type === "SIMPLE") {
      setPrice(String(productData.price / 100));
      setSalePrice(
        productData.salePrice ? String(productData.salePrice / 100) : ""
      );
      setSku(productData.sku ?? "");
      setStock(String(productData.stock ?? 0));
    }

    if (productData.type === "VARIATION") {
      setAttributes(productData.attributes || []);
      setVariations(
        productData.variants.map((v: any) => ({
          ...v,
          price: v.price / 100,
          salePrice: v.salePrice ? v.salePrice / 100 : "",
        }))
      );
    }
  }, [productData]);

  /* ===================== IMAGE OPTIONS ===================== */

  const imageOptions = [
    ...(productData?.image || []).map((url: string, index: number) => ({
      index,
      url,
    })),
    ...files.map((file, index) => ({
      index,
      url: URL.createObjectURL(file),
    })),
  ];

  /* ===================== MUTATION ===================== */

  const { mutateAsync: updateProduct, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      const token = await getToken();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);

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
        formData.append("attributes", JSON.stringify(attributes));
        formData.append(
          "variations",
          JSON.stringify(
            variations.map((v) => ({
              id: v.id,
              name: v.name,
              sku: v.sku || null,
              price: Number(v.price),
              salePrice: v.salePrice === "" ? null : Number(v.salePrice),
              stock: Number(v.stock),
              imageIndex: v.imageIndex,
            }))
          )
        );
      }

      files.forEach((file, index) => {
        if (file) formData.append(`images[${index}]`, file);
      });

      const res = await axios.patch(
        `/api/product/edit/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    },

    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      router.push("/seller/product-list");
    },

    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  /* ===================== UI ===================== */

  if (!productData) {
    return (
      <div className="p-10 text-center text-xl">Product not found.</div>
    );
  }

  return (
    <>
      <div className="min-h-screen px-6 py-8 mt-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProduct();
          }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-medium">{productData.name}</h1>
            <div className="w-16 h-0.5 bg-primary mt-1" />
          </div>

          {/* Images */}
          <div>
            <p className="font-medium">Product Images</p>
            <div className="flex gap-3 mt-2">
              {[...Array(4)].map((_, index) => {
                const existing = productData.image?.[index];
                const preview = files[index]
                  ? URL.createObjectURL(files[index])
                  : existing || assets.upload_area;

                return (
                  <label key={index}>
                    <input
                      type="file"
                      hidden
                      onChange={(e: any) => {
                        const updated = [...files];
                        updated[index] = e.target.files[0];
                        setFiles(updated);
                      }}
                    />
                    <Image
                      src={preview}
                      alt=""
                      width={100}
                      height={100}
                      className="h-24 w-24 object-cover rounded cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Name / Description */}
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Search Keys */}
          <Textarea
            value={searchKeys}
            onChange={(e) => setSearchKeys(e.target.value)}
            placeholder="comma separated"
          />

          <CategoryComboBox value={category} onChange={setCategory} />

          {/* SIMPLE */}
          {type === "SIMPLE" && (
            <div className="grid grid-cols-2 gap-4">
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
              <Input value={stock} onChange={(e) => setStock(e.target.value)} />

              <div className="flex items-center gap-2">
                <PhilippinePeso size={16} />
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <PhilippinePeso size={16} />
                <Input
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* VARIATION */}
          {type === "VARIATION" && (
            <Button
              type="button"
              onClick={() => variationModal.openModal()}
              variant="outline"
            >
              Edit Variations
            </Button>
          )}

          <div className="flex gap-3">
            <Button disabled={isPending}>
              {isPending ? (
                <LoaderIcon className="animate-spin" size={16} />
              ) : (
                "UPDATE"
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <VariationModal
        open={variationModal.open}
        onOpenChange={variationModal.setOpen}
        parentProductName={name}
        imageOptions={imageOptions}
        generatedVariations={variations}
        onConfirm={setVariations}
      />
    </>
  );
};

export default EditProduct;

// ======================================================================================================================================
// ======================================================================================================================================


"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Activity, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

import { assets } from "@/assets/assets";
import useProductHook from "@/hooks/useProductHook";
import { useVariationModal } from "@/hooks/useVariationModal";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CategoryComboBox from "@/components/CategoryComboBox";
import { VariationModal } from "@/components/VariationModal";
import { toast } from "@/components/ui/use-toast";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Info,
  LoaderIcon,
  PhilippinePeso,
  SquareCheckBig,
  SquarePen,
} from "lucide-react";

/* ===================================================== */

const EditProduct = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { getToken } = useAuth();
  const { products } = useProductHook();
  const variationModal = useVariationModal();

  /* ===================== CORE STATE ===================== */

  const [productData, setProductData] = useState<any>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");

  const [price, setPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  const [searchKeys, setSearchKeys] = useState("");

  /* ===================== VARIATION STATE ===================== */

  const [attributes, setAttributes] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);

  const [varAName, setVarAName] = useState("Variation A");
  const [varBName, setVarBName] = useState("Variation B");

  const [variationA, setVariationA] = useState("");
  const [variationB, setVariationB] = useState("");

  const [isModifyingA, setisModifyingA] = useState(false);
  const [isModifyingB, setisModifyingB] = useState(false);

  const [isGeneratingVariations, setisGeneratingVariations] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [addingError, setAddingError] = useState("");

  const [finalVariations, setFinalVariations] = useState<any[]>([]);

  /* ===================== LOAD PRODUCT ===================== */

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) setProductData(product);
  }, [id, products]);

  useEffect(() => {
    if (!productData) return;

    setName(productData.name);
    setDescription(productData.description);
    setCategory(productData.category);
    setType(productData.type);
    setSearchKeys(productData.search_keys.join(", "));
    setFiles([]);

    if (productData.type === "SIMPLE") {
      setPrice(String(productData.price / 100));
      setsalePrice(
        productData.salePrice ? String(productData.salePrice / 100) : ""
      );
      setSku(productData.sku ?? "");
      setStock(String(productData.stock ?? 0));
    }

    if (productData.type === "VARIATION") {
      setVarAName(productData.attributes?.[0] || "Variation A");
      setVarBName(productData.attributes?.[1] || "Variation B");
      setAttributes(productData.attributes || []);

      setVariations(
        productData.variants.map((v: any) => ({
          ...v,
          price: v.price / 100,
          salePrice: v.salePrice ? v.salePrice / 100 : "",
        }))
      );
    }
  }, [productData]);

  /* ===================== IMAGE OPTIONS ===================== */

  const imageOptions = [
    ...(productData?.image || []).map((url: string, index: number) => ({
      index,
      url,
    })),
    ...files.map((file, index) => ({
      index,
      url: URL.createObjectURL(file),
    })),
  ];

  /* ===================== VARIATION GENERATOR ===================== */

  const handleGenerateVariations = async () => {
    setisGeneratingVariations(true);

    const listA = variationA
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    const listB = variationB
      ? variationB.split(",").map((v) => v.trim()).filter(Boolean)
      : [];

    const results: any[] = [];

    if (listB.length) {
      listA.forEach((a) => {
        listB.forEach((b) => {
          results.push({
            name: `${a}, ${b} - ${name}`,
            sku: "",
            price: "",
            salePrice: "",
            stock: "",
            imageIndex: 0,
          });
        });
      });
    } else {
      listA.forEach((a) => {
        results.push({
          name: `${a} - ${name}`,
          sku: "",
          price: "",
          salePrice: "",
          stock: "",
          imageIndex: 0,
        });
      });
    }

    variationModal.setGeneratedVariations(results);
    setisGeneratingVariations(false);
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
        v.salePrice === "" || v.salePrice === null
          ? null
          : Number(v.salePrice);

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
        const parts = v.name.split(" - ")[0].split(",").map((p) => p.trim());

        return {
          ...v,
          name: `${parts.join(", ")} - ${base}`,
        };
      })
    );
  }, [varAName, varBName]);

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
      const token = await getToken();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);

      formData.append(
        "search_keys",
        JSON.stringify(
          searchKeys.split(",").map((k) => k.trim()).filter(Boolean)
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

      const res = await axios.patch(
        `/api/product/edit/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    },

    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      router.push("/seller/product-list");
    },

    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // SIMPLE validation
  if (type === "SIMPLE") {
    if (!name.trim()) {
      toast({
        title: "Invalid name",
        description: "Product name is required.",
        variant: "destructive",
      });
      return;
    }

    if (Number(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0.",
        variant: "destructive",
      });
      return;
    }
  }

  // VARIATION validation
  if (type === "VARIATION") {
    if (
      (finalVariations.length === 0 && variations.length === 0) ||
      ![varAName, varBName].some(Boolean)
    ) {
      toast({
        title: "Invalid variations",
        description: "Please generate and confirm variations first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // normalize before submit
      const normalized = validateVariations(
        finalVariations.length ? finalVariations : variations
      );
      setFinalVariations(normalized);
    } catch (err: any) {
      toast({
        title: "Variation error",
        description: err.message,
        variant: "destructive",
      });
      return;
    }
  }

  await updateProduct();
};


  /* ===================== UI ===================== */

  if (!productData) {
    return (
      <div className="p-10 text-center text-xl">Product not found.</div>
    );
  }


  return (
    <>
  <div className="px-6 py-6 min-h-screen w-full mt-16">
    <form onSubmit={handleSubmit} className="p-5 sm:p-10">
      <div className="flex flex-col mb-5">
        <p className="text-2xl font-medium">
          {type === "VARIATION" ? "Edit Product (Variation)" : "Edit Product"}
        </p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

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
                        : productData?.image?.[index] || assets.upload_area
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
            <label className="text-base font-medium" htmlFor="product-description">
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
          } max-w-xl lg:max-w-md`}
        >
          <div className="flex gap-2">
            <label className="text-base font-medium">Product Type</label>
            <RadioGroup className="flex min-w-xs justify-around" value={type}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="SIMPLE" id="r1" disabled />
                <Label htmlFor="r1">Simple</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="VARIATION" id="r2" disabled />
                <Label htmlFor="r2">Variation</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex flex-col flex-1 gap-1 w-32">
              <label className="text-base font-medium">Category</label>
              <CategoryComboBox
                value={category}
                onChange={(val) => setCategory(val)}
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

                <div className="flex flex-col flex-1 gap-1 w-32">
                  <label className="text-base font-medium">Stock</label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    onChange={(e) => setStock(e.target.value)}
                    value={stock}
                  />
                </div>
              </>
            </Activity>
          </div>

          {/* SIMPLE prices */}
          <Activity mode={type === "SIMPLE" ? "visible" : "hidden"}>
            <>
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex flex-col flex-1 gap-1 w-32">
                  <label className="text-base font-medium">Product Price</label>
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
                  <label className="text-base font-medium">SALE Price</label>
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
                    <span>• {varAName}</span>
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
                  >
                    {isModifyingA ? (
                      <SquareCheckBig size={16} />
                    ) : (
                      <SquarePen size={16} />
                    )}
                  </Button>
                </div>
              </Label>

              <Input
                placeholder="eg. Sml, Med, Lrg"
                onChange={(e) => setVariationA(e.target.value)}
                value={variationA}
              />
            </div>

            {/* Variation B */}
            <div className="flex flex-col gap-1">
              <Label
                className={`font-medium ${
                  !variationA.trim()
                    ? "text-foreground/40"
                    : "text-base"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isModifyingB ? (
                    <Input
                      className="w-30 text-md"
                      value={varBName}
                      onChange={(e) => setVarBName(e.target.value)}
                    />
                  ) : (
                    <span>• {varBName}</span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!variationA.trim()}
                    onClick={() => {
                      if (isModifyingB) {
                        setAttributes([varAName, varBName].filter(Boolean));
                      }
                      setisModifyingB(!isModifyingB);
                    }}
                  >
                    {isModifyingB ? (
                      <SquareCheckBig size={16} />
                    ) : (
                      <SquarePen size={16} />
                    )}
                  </Button>
                </div>
              </Label>

              <Input
                placeholder="eg. Red, Blue, Yellow"
                disabled={!variationA.trim()}
                value={variationB}
                onChange={(e) => setVariationB(e.target.value)}
              />
            </div>

            <div className="flex gap-5 items-center">
              <Button
                type="button"
                disabled={isGeneratingVariations}
                onClick={() => {
                  if (!name) return setGenerateError("empty name");
                  if (!variationA) return setGenerateError("empty variation");

                  if (variationModal.generatedVariations.length === 0) {
  // EDIT MODE: preload existing variants into modal
  variationModal.setGeneratedVariations(
    (finalVariations.length ? finalVariations : variations).map((v) => ({
      ...v,
      price: String(v.price),
      salePrice: v.salePrice === null ? "" : String(v.salePrice),
      stock: String(v.stock),
    }))
  );
}

variationModal.openModal();

                  setGenerateError("");
                }}
              >
                {isGeneratingVariations ? (
                  <LoaderIcon className="animate-spin" size={16} />
                ) : (
                  "Modify Variations"
                )}
              </Button>

              {generateError && (
                <span className="text-destructive">
                  {generateError === "empty name" && "Please enter a name."}
                  {generateError === "empty variation" &&
                    "Please enter some variations first."}
                </span>
              )}
            </div>
          </Activity>

          <div className="flex gap-5 items-center">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderIcon className="animate-spin" size={16} />
              ) : (
                "UPDATE"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
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

export default EditProduct;

