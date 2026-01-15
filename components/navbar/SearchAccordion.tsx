"use client";

import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction } from "react";
import { MobileDrawer } from "./NavBar";

interface SearchAccordionProps {
  setDrawer: Dispatch<SetStateAction<MobileDrawer>>;
}

export default function SearchAccordion({ setDrawer }: SearchAccordionProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDrawer("menu")}
          className="w-8 h-8 flex items-center justify-center"
        >
          <Menu />
        </button>
        <SearchBar autoFocus />
      </div>

      {/* Helper / Placeholder Content */}
      <div className="text-center text-sm text-muted-foreground">
        Search products, brands, or categories
      </div>
    </div>
  );
}
