/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export function useEditVariationModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [generatedVariations, setGeneratedVariations] = useState<any[]>([]);

  const openAdd = () => {
    setMode("ADD");
    setGeneratedVariations(generatedVariations);
    setOpen(true);
  };

  const openEdit = (existing: any[]) => {
    setMode("EDIT");
    setGeneratedVariations(existing);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    // optional cleanup:
    // setGeneratedVariations([]);
  };

  return {
    open,
    mode,
    generatedVariations,
    setGeneratedVariations,
    openAdd,
    openEdit,
    close,
    setOpen, // keep for advanced cases
  };
}
