"use client";

import { useState } from "react";

export function useVariationModal() {
  const [open, setOpen] = useState(false);

  return {
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    setOpen,
  };
}
