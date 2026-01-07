"use client";

import { useState } from "react";

export type ProductVariation = {
name: string;
sku: string;
price: string;
salePrice: string;
stock: string;
imageIndex: number;
};

export function useVariationModal() {
  const [generatedVariations, setGeneratedVariations] = useState<ProductVariation[]>([]);
  const [open, setOpen] = useState(false);

  const confirmVariations = (confirmed: any[]) => {
    const cleaned = confirmed.map(({ isNew, ...rest }) => rest);
    setGeneratedVariations(cleaned as ProductVariation[]);
  };

  return {
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    setOpen,
    generatedVariations,
    setGeneratedVariations,
    confirmVariations
  };
}
