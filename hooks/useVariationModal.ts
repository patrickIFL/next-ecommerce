"use client";
import { Variation } from "@/lib/types";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";

export function useVariationModal() {
  const [generatedVariations, setGeneratedVariations] = useState<Variation[]>([]);
  const [open, setOpen] = useState(false);

  const confirmVariations = (confirmed: any[]) => {
    const cleaned = confirmed.map(({ isNew, ...rest }) => rest);
    setGeneratedVariations(cleaned as Variation[]);
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
