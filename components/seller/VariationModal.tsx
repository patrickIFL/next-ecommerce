/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhilippinePeso, Trash2 } from "lucide-react";
import { ImagePicker } from "./ImagePicker";

/* ============================== */
/* Types                          */
/* ============================== */

export type Variation = {
  name: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  costPrice?: string; // optional (import)
  imageIndex: number;
  isNew?: boolean;
};

type VariationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentProductName: string;
  imageOptions: any[];
  generatedVariations: any[];
  onConfirm: (variations: Variation[]) => void;

  /** Enable cost price editing (supplier imports) */
  enableCostPrice?: boolean;
};

/* ============================== */
/* Component                      */
/* ============================== */

export function VariationModal({
  open,
  onOpenChange,
  parentProductName,
  imageOptions,
  generatedVariations,
  onConfirm,
  enableCostPrice = false,
}: VariationModalProps) {
  const [variations, setVariations] = useState<Variation[]>([]);

  /* ------------------------------ */
  /* Init from generated variations */
  /* ------------------------------ */
  useEffect(() => {
    if (!generatedVariations?.length) return;

    setVariations(
      generatedVariations.map((v: any) => ({
        ...v,
        sku: v.sku ?? "",
        price: v.price ?? "",
        salePrice: v.salePrice ?? "",
        stock: v.stock ?? "",
        costPrice: v.costPrice ?? "",
        imageIndex: v.imageIndex ?? 0,
      }))
    );
  }, [generatedVariations]);

  /* ------------------------------ */
  /* Helpers                        */
  /* ------------------------------ */
  const normalizePositiveNumber = (val: string) => {
    if (val === "") return "";
    if (Number(val) < 0) return null;
    if (val.length > 1 && val.startsWith("0")) {
      return val.replace(/^0+/, "");
    }
    return val;
  };

  const updateVariation = (
    index: number,
    field: keyof Variation,
    value: any
  ) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const deleteVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  /* ============================== */
  /* Render                         */
  /* ============================== */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80vw] lg:min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Variations for {parentProductName}</DialogTitle>
          <DialogDescription>
            Edit variation details. Click Done when finished.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 rounded-md border">
          <div className="grid gap-2 p-1">
            {variations.map((variation, i) => (
              <div
                key={i}
                className={`relative p-2 lg:p-4 rounded-md border grid gap-3 ${
                  variation.isNew ? "border-green-600" : ""
                }`}
              >
                {variation.isNew && (
                  <span className="absolute top-0 left-0 bg-green-600 text-white text-[10px] px-1 rounded-tl-sm">
                    NEW
                  </span>
                )}

                <Label className="font-medium">{variation.name}</Label>
                <div className="h-px w-full bg-foreground" />

                {/* ================= GRID LAYOUT ================= */}
                <div
                  className="
    
    sm:grid gap-2
    grid-cols-3
    xl:flex
  "
                >
                  {/* Row 1 — Image */}
                  <div className="flex flex-col gap-1 md:row-start-1">
                    <Label className="text-xs font-normal">Image</Label>
                    <ImagePicker
                      images={imageOptions}
                      value={variation.imageIndex}
                      onChange={(idx) => updateVariation(i, "imageIndex", idx)}
                    />
                  </div>

                  {/* Row 1 — SKU */}
                  <div className="flex flex-col gap-1 md:row-start-1">
                    <Label className="text-xs font-normal">SKU</Label>
                    <Input
                      value={variation.sku}
                      placeholder="Optional"
                      onChange={(e) =>
                        updateVariation(i, "sku", e.target.value)
                      }
                    />
                  </div>

                  {/* Row 1 — Stock */}
                  <div className="flex flex-col gap-1 md:row-start-1">
                    <Label className="text-xs font-normal">Stock</Label>
                    <Input
                      type="number"
                      value={variation.stock}
                      placeholder="0"
                      min={0}
                      onChange={(e) => {
                        const val = normalizePositiveNumber(e.target.value);
                        if (val !== null) updateVariation(i, "stock", val);
                      }}
                    />
                  </div>

                  {/* Row 2 — Price */}
                  <div className="flex flex-col gap-1 md:row-start-2">
                    <Label className="text-xs font-normal">Price</Label>
                    <div className="flex items-center gap-1">
                      <PhilippinePeso size={16} />
                      <Input
                        type="number"
                        value={variation.price}
                        placeholder="0"
                        min={0}
                        onChange={(e) => {
                          const val = normalizePositiveNumber(e.target.value);
                          if (val !== null) updateVariation(i, "price", val);
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2 — Cost Price (optional) */}
                  {enableCostPrice && (
                    <div className="flex flex-col gap-1 md:row-start-2">
                      <Label className="text-xs font-normal">Cost Price</Label>
                      <div className="flex items-center gap-1">
                        <PhilippinePeso size={16} />
                        <Input
                          type="number"
                          value={variation.costPrice}
                          placeholder="0"
                          min={0}
                          onChange={(e) => {
                            const val = normalizePositiveNumber(e.target.value);
                            if (val !== null)
                              updateVariation(i, "costPrice", val);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Row 2 — Sale Price */}
                  <div className="flex flex-col gap-1 md:row-start-2">
                    <Label className="text-xs font-normal">Sale Price</Label>
                    <div className="flex items-center gap-1">
                      <PhilippinePeso size={16} />
                      <Input
                        type="number"
                        value={variation.salePrice}
                        placeholder="Optional"
                        min={0}
                        onChange={(e) => {
                          const val = normalizePositiveNumber(e.target.value);
                          if (val !== null)
                            updateVariation(i, "salePrice", val);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <Button
                  type="button"
                  size="icon"
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => deleteVariation(i)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onConfirm(variations);
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
