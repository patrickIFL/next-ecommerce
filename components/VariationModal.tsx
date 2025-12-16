/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  PhilippinePeso,
  SquareCheckBig,
  SquarePen,
  Trash2,
} from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

/* ================= TYPES ================= */

export type ProductVariation = {
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageIndex: number;
};

type VariationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageOptions: any[];
  generatedVariations: ProductVariation[];
  parentProductName: string;
  onConfirm: (variations: ProductVariation[]) => void;
};

/* ================= COMPONENT ================= */

export function VariationModal({
  open,
  onOpenChange,
  imageOptions,
  generatedVariations,
  parentProductName,
  onConfirm,
}: VariationModalProps) {
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  /* sync generated → editable state */
  useEffect(() => {
    if (generatedVariations.length) {
      setVariations(generatedVariations);
    }
  }, [generatedVariations]);

  const updateVariation = <K extends keyof ProductVariation>(
    index: number,
    field: K,
    value: ProductVariation[K]
  ) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const deleteVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!variations.length) {
      alert("No variations to save.");
      return;
    }

    if (!variations.every((v) => v.price > 0 && v.stock >= 0)) {
      alert("Please fix variation prices and stock.");
      return;
    }

    onConfirm(variations);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Variations for {parentProductName}</DialogTitle>
          <DialogDescription>
            Review and edit each variation before creating the product.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 rounded-md border">
          <div className="grid gap-2 p-2">
            {variations.map((variation, i) => (
              <div key={i} className="relative border p-4 rounded-md grid gap-2">
                {/* ===== NAME ===== */}
                <Label className="font flex items-center gap-2">
                  {editingNameIndex === i ? (
                    <div className="flex gap-1 items-center">
                      <Input
                        value={variation.name}
                        onChange={(e) =>
                          updateVariation(i, "name", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setEditingNameIndex(null);
                          }
                        }}
                        className="h-8 focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingNameIndex(null)}
                      >
                        <SquareCheckBig size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center">
                      {variation.name}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingNameIndex(i)}
                      >
                        <SquarePen size={14} />
                      </Button>
                    </div>
                  )}
                </Label>

                <div className="w-full h-px bg-border" />

                {/* ===== FIELDS ===== */}
                <div className="flex gap-2 flex-wrap">
                  {/* Image */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Image</Label>
                    <ImagePicker
                      images={imageOptions}
                      value={variation.imageIndex}
                      onChange={(index) =>
                        updateVariation(i, "imageIndex", index)
                      }
                    />
                  </div>

                  {/* SKU */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">SKU</Label>
                    <Input
                      value={variation.sku}
                      placeholder="Optional"
                      onChange={(e) =>
                        updateVariation(i, "sku", e.target.value)
                      }
                      className="focus-visible:ring-0"
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      min={0}
                      value={variation.stock}
                      onChange={(e) =>
                        updateVariation(i, "stock", Number(e.target.value))
                      }
                      className="focus-visible:ring-0"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Price</Label>
                    <div className="flex items-center">
                      <PhilippinePeso size={14} />
                      <Input
                        type="number"
                        min={1}
                        value={variation.price}
                        onChange={(e) =>
                          updateVariation(i, "price", Number(e.target.value))
                        }
                        className="focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  {/* Sale Price */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Sale Price</Label>
                    <div className="flex items-center">
                      <PhilippinePeso size={14} />
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={variation.salePrice ?? ""}
                        onChange={(e) =>
                          updateVariation(
                            i,
                            "salePrice",
                            Number(e.target.value) || 0
                          )
                        }
                        className="focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <Button
                  type="button"
                  size="icon"
                  onClick={() => deleteVariation(i)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm}>
            Confirm Variations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
