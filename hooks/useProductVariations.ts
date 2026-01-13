import { useCallback } from "react";
import toast from "react-hot-toast";

export interface BaseVariation {
  name: string;
  sku: string;
  price: string;
  salePrice?: string | null;
  stock: string;
  imageIndex: number;
  isNew?: boolean;
}

interface GenerateOptions<T extends BaseVariation> {
  variationA: string;
  variationB?: string;
  productName: string;

  /**
   * Existing variations (used in edit mode)
   */
  existing?: T[];

  /**
   * Whether to mark generated variations as new
   */
  markAsNew?: boolean;

  /**
   * Called with the final merged/generated variations
   */
  onGenerated: (variations: T[]) => void;
}

export function useProductVariations<T extends BaseVariation>() {
  const parseList = (value?: string) =>
    value
      ?.split(",")
      .map((v) => v.trim())
      .filter(Boolean) ?? [];

  const generate = useCallback(
    async ({
      variationA,
      variationB,
      productName,
      existing = [],
      markAsNew = false,
      onGenerated,
    }: GenerateOptions<T>) => {
      const listA = parseList(variationA);
      const listB = parseList(variationB);

      if (!listA.length) {
        toast.error("Please enter variation values.");
        return;
      }

      const generated: T[] = [];

      const createVariation = (label: string) =>
        ({
          name: label,
          sku: "",
          price: "",
          salePrice: "",
          stock: "",
          imageIndex: 0,
          ...(markAsNew ? { isNew: true } : {}),
        } as T);

      if (listB.length) {
        listA.forEach((a) => {
          listB.forEach((b) => {
            generated.push(
              createVariation(`${a}, ${b} - ${productName}`)
            );
          });
        });
      } else {
        listA.forEach((a) => {
          generated.push(
            createVariation(`${a} - ${productName}`)
          );
        });
      }

      // Merge with existing (edit mode)
      let finalList = generated;

      if (existing.length) {
        const existingNames = new Set(existing.map((v) => v.name));
        finalList = [
          ...generated.filter((v) => !existingNames.has(v.name)),
          ...existing,
        ];
      }

      toast.success("Variations generated. Now edit them.");
      onGenerated(finalList);
    },
    []
  );

  return { generate };
}
