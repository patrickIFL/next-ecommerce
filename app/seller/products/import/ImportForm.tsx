"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Activity, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

import { useProductVariations } from "@/hooks/useProductVariations";
import { useVariationModal } from "@/hooks/useVariationModal";
import { VariationModal } from "@/components/seller/VariationModal";
import { SquareCheckBig, SquarePen } from "lucide-react";
import CategoryComboBox from "@/components/common/CategoryComboBox";
import BrandComboBox from "@/components/common/BrandComboBox";

type ImportVariant = {
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  imageIndex?: number;
};

export default function ImportForm({
  supplierId,
}: {
  supplierId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");

  // Product
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");

  // Simple
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");

  // Variations
  const [variationA, setVariationA] = useState("");
  const [variationB, setVariationB] = useState("");
  const [finalVariants, setFinalVariants] = useState<ImportVariant[]>([]);

  const variationModal = useVariationModal();
  const { generate } = useProductVariations<any>();

  const [varAName, setVarAName] = useState("Variation A");
  const [varBName, setVarBName] = useState("Variation B");
  const [isModifyingA, setIsModifyingA] = useState(false);
  const [isModifyingB, setIsModifyingB] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const [searchKeys, setSearchKeys] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [brand, setBrand] = useState("Generic");

  /* ----------------------------- */
  /* Generate → Open Modal         */
  /* ----------------------------- */
  const handleGenerateVariants = async () => {
    if (!name.trim()) {
      setGenerateError("empty name");
      return;
    }

    if (!variationA.trim()) {
      setGenerateError("empty variation");
      return;
    }

    // ✅ CASE 1: already have confirmed variants → MODIFY
    if (finalVariants.length > 0) {
      variationModal.setGeneratedVariations(
        finalVariants.map((v) => ({
          name: v.name,
          sku: "",
          price: String(v.price), // ✅ string
          costPrice: String(v.costPrice),
          salePrice: "",
          stock: String(v.stock), // ✅ string
          imageIndex: v.imageIndex ?? 0,
        }))
      );
      variationModal.openModal();
      setGenerateError("");
      return;
    }

    // ✅ CASE 2: first time → GENERATE
    await generate({
      variationA,
      variationB,
      productName: name,
      onGenerated: (results) => {
        variationModal.setGeneratedVariations(
          results.map((v) => ({
            ...v,
            price: "",
            salePrice: "",
            stock: "",
            imageIndex: 0,
          }))
        );
        variationModal.openModal();
      },
    });

    setGenerateError("");
  };

  /* ----------------------------- */
  /* Submit                        */
  /* ----------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        supplierId,
        type,
        attributes: [varAName, varBName],
        name,
        category,
        brand,
        description,
        images: images
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean),
      };

      const searchKeysArray = searchKeys
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      payload.search_keys = searchKeysArray;

      if (type === "SIMPLE") {
        payload.price = Number(price);
        payload.salePrice = Number(salePrice);
        payload.costPrice = Number(costPrice);
        payload.stock = Number(stock);
      }

      if (type === "VARIATION") {
        if (!finalVariants.length) {
          throw new Error("No variants confirmed");
        }

        payload.variants = finalVariants.map((v) => ({
          name: v.name,
          price: Number(v.price),
          costPrice: Number(v.costPrice),
          stock: Number(v.stock),
        }));
      }

      const res = await fetch("/api/product/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to import product");
      }

      toast.success("Product imported successfully");

      // Reset
      setName("");
      setDescription("");
      setImages("");
      setPrice("");
      setSalePrice("");
      setCostPrice("");
      setStock("");
      setVariationA("");
      setVariationB("");
      setFinalVariants([]);
      setType("SIMPLE");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Type */}
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIMPLE">Simple Product</SelectItem>
                  <SelectItem value="VARIATION">
                    Product with Variants
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex gap-5 flex-wrap">
              {/* Category */}
              <div className="flex flex-col flex-1 gap-1 min-w-[140px]">
                <Label className="text-base font-medium">Category</Label>
                <CategoryComboBox
                  value={category}
                  onChange={(val) => setCategory(val)}
                />
              </div>

              {/* Brand */}
              <div className="flex flex-col flex-1 gap-1 min-w-[140px]">
                <Label className="text-base font-medium">Brand</Label>
                <BrandComboBox
                  value={brand}
                  onChange={(val) => setBrand(val)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Search keys */}
            <div className="space-y-2">
              <Label>Search Keys</Label>
              <Textarea
                value={searchKeys}
                onChange={(e) => setSearchKeys(e.target.value)}
                placeholder="e.g. mouse, wireless, gaming"
                rows={3}
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Image URLs</Label>
              <Textarea
                value={images}
                onChange={(e) => setImages(e.target.value)}
                placeholder="One image URL per line"
                rows={4}
              />
            </div>

            {/* SIMPLE */}
            {type === "SIMPLE" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Sale Price</Label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Cost Price</Label>
                  <Input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Activity mode={type === "VARIATION" ? "visible" : "hidden"}>
              <Label className="text-lg underline underline-offset-2">
                Product Attributes
              </Label>

              {/* ================= Variation A ================= */}
              <div className="flex flex-col gap-1">
                <Label className="text-base font-medium">
                  <div className="flex items-center justify-between">
                    {isModifyingA ? (
                      <Input
                        className="w-32 text-md"
                        value={varAName}
                        onChange={(e) => setVarAName(e.target.value)}
                      />
                    ) : (
                      <span>• {varAName}</span>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModifyingA((v) => !v)}
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
                  placeholder="e.g. Small, Medium, Large"
                  value={variationA}
                  onChange={(e) => setVariationA(e.target.value)}
                />
              </div>

              {/* ================= Variation B ================= */}
              <div className="flex flex-col gap-1">
                <Label
                  className={`font-medium ${
                    !variationA.trim() ? "text-foreground/40" : "text-base"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {isModifyingB ? (
                      <Input
                        className="w-32 text-md"
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
                      onClick={() => setIsModifyingB((v) => !v)}
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
                  placeholder="e.g. Red, Blue"
                  value={variationB}
                  disabled={!variationA.trim()}
                  onChange={(e) => setVariationB(e.target.value)}
                />
              </div>

              {/* ================= Generate / Modify ================= */}
              <div className="flex gap-5 items-center">
                <Button
                  type="button"
                  onClick={() => {
                    if (!name.trim()) {
                      setGenerateError("empty name");
                      return;
                    }
                    if (!variationA.trim()) {
                      setGenerateError("empty variation");
                      return;
                    }

                    if (variationModal.generatedVariations.length === 0) {
                      handleGenerateVariants();
                    }

                    variationModal.openModal();
                    setGenerateError("");
                  }}
                  className="w-full max-w-[220px] bg-gray-100 hover:bg-gray-200"
                >
                  {finalVariants.length === 0
                    ? "Generate Variants"
                    : "Modify Variants"}
                </Button>

                {generateError && (
                  <span className="text-destructive text-sm">
                    {generateError === "empty name" &&
                      "Please enter a product name."}
                    {generateError === "empty variation" &&
                      "Please enter variation values."}
                  </span>
                )}
              </div>
            </Activity>

            <Button type="submit" disabled={loading}>
              {loading ? "Importing..." : "Import Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Shared Variation Modal */}
      <VariationModal
        open={variationModal.open}
        onOpenChange={variationModal.setOpen}
        parentProductName={name}
        imageOptions={[]}
        generatedVariations={variationModal.generatedVariations}
        enableCostPrice // ✅ turn it on
        onConfirm={(confirmed) => {
          setFinalVariants(
            confirmed.map((v) => ({
              name: v.name,
              price: Number(v.price),
              costPrice: Number(v.costPrice),
              stock: Number(v.stock),
            }))
          );
        }}
      />
    </>
  );
}
