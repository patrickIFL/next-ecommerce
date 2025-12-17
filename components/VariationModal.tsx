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
import { PhilippinePeso, Trash2 } from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

type Variation = {
  name: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  imageIndex: number;
};

// NOTE: THIS MODAL IS ONLY UI. USED TO EDIT THE VARIATIONS ONLY,
// THE FINALIZED VARIATIONS ARE IN GENERATED VARIATIONS

type VariationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageOptions: any[];
  generatedVariations: any[];
  parentProductName: string;
  onConfirm: (variations: Variation[]) => void;
};

export function VariationModal({
  open,
  onOpenChange,
  imageOptions,
  generatedVariations,
  parentProductName,
  onConfirm,
}: VariationModalProps) {
  const [variations, setVariations] = useState<Variation[]>([]);

  useEffect(() => {
    if (generatedVariations.length > 0) {
      setVariations(generatedVariations);
    }
  }, [generatedVariations]);

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

  function normalizePositiveNumber(val: string) {
    if (val === "") return "";
    if (Number(val) < 0) return null;

    if (val.length > 1 && val.startsWith("0")) {
      return val.replace(/^0+/, "");
    }

    return val;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Variations for {parentProductName}</DialogTitle>
            <DialogDescription>
              Make changes to variation. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-72 rounded-md border">
            <div className="grid gap-2 p-1">
              {variations.map((variation, i) => (
                <div className="" key={i}>
                  {/* sku, price, salePrice, stock, image */}
                  <div className="relative border p-4 rounded-md grid gap-2">
                    <Label className="font flex items-center gap-2">
                      <div className="flex gap-1 p-0 items-center">
                        {variation.name}
                      </div>
                    </Label>

                    {/* divider */}
                    <div className="w-full h-px bg-foreground"></div>

                    {/* main content */}
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-xs">Image</Label>
                        <ImagePicker
                          images={imageOptions}
                          value={variation.imageIndex}
                          onChange={(index) =>
                            updateVariation(i, "imageIndex", index)
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-xs">SKU</Label>
                        <Input
                          value={variation.sku}
                          placeholder="Optional"
                          onChange={(e) => {
                            updateVariation(i, "sku", e.target.value);
                          }}
                          className="focus-visible:ring-0 transition selection:bg-foreground/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-xs">Stock</Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder="0"
                          value={variation.stock}
                          onChange={(e) => {
                            const normalized = normalizePositiveNumber(
                              e.target.value
                            );
                            if (normalized === null) return;
                            updateVariation(i, "stock", normalized);
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-xs">Price</Label>
                        <div className="flex items-center">
                          <PhilippinePeso size={17} />
                          <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            value={variation.price}
                            placeholder="0"
                            onChange={(e) => {
                              const normalized = normalizePositiveNumber(
                                e.target.value
                              );
                              if (normalized === null) return;
                              updateVariation(i, "price", normalized);
                            }}
                            className="focus-visible:ring-0 transition selection:bg-foreground/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-xs">
                          Sale Price
                        </Label>
                        <div className="flex items-center">
                          <PhilippinePeso size={17} />
                          <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            value={variation.salePrice}
                            placeholder="Optional"
                            onChange={(e) => {
                              const normalized = normalizePositiveNumber(
                                e.target.value
                              );
                              if (normalized === null) return;
                              updateVariation(i, "salePrice", normalized);
                            }}
                            className="focus-visible:ring-0 transition selection:bg-foreground/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* delete button */}
                    <div>
                      <Button
                        type="button"
                        onClick={() => deleteVariation(i)}
                        className="h-7 w-7 absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
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
                  onConfirm(variations); // ✅ push edited data up
                  onOpenChange(false);
                }}
              >
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
