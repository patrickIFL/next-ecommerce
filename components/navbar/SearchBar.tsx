"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import useSearchStore from "@/stores/useSearchStore";
import useSearchHook from "@/hooks/useSearchHook";

const CATEGORY_PRESETS = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home", value: "home" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports", value: "sports" },
];

interface SearchBarProps {
  autoFocus?: boolean;
}

export default function SearchBar({ autoFocus = false }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { handleSearch, searchLoading } = useSearchHook();
  const params = useParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);

  /* Autofocus when used inside mobile drawer */
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  /* Sync category from route */
  useEffect(() => {
    if (params?.cat) {
      setCategory(params.cat as string);
    }
  }, [params]);

  return (
    <div className="w-full">
      <div className="flex h-10 items-center rounded-md border bg-background px-2">
        {/* Submit Button */}
        <Button
          size="icon"
          variant="ghost"
          disabled={searchLoading}
          // onClick={() => {handleSearch(category)}}
        >
          {searchLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>

        {/* Input */}
        <input
          ref={inputRef}
          disabled={searchLoading}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch(searchQuery);
            }
          }}
          placeholder="Search products"
          className="w-full px-2 text-sm bg-transparent border-0 outline-none
            focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Category Selector (Desktop / Tablet) */}
        <div className="hidden sm:flex items-center">
          <div className="mx-1 h-5 w-px bg-border" />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                disabled={searchLoading}
                className="h-8 px-2 text-xs gap-1"
              >
                {CATEGORY_PRESETS.find((c) => c.value === category)?.label ??
                  "Category"}
                <ChevronsUpDown className="size-3 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-48 p-0">
              <Command>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {CATEGORY_PRESETS.map((cat) => (
                    <CommandItem
                      key={cat.value}
                      value={cat.value}
                      onSelect={() => {
                        setCategory(cat.value);
                        setOpen(false);
                        handleSearch(cat.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          category === cat.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
