"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";

interface CategoryComboBoxProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SellerCategoryFilter({
  className,
  value,
  onChange,
}: CategoryComboBoxProps) {
  const [open, setOpen] = useState(false);
  // Fetch categories from API

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/product/categories");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load categories");
      }
      return json.data;
    },
  });

  const selected = categories?.find((c: any) => c.slug === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`rounded font-normal justify-between ${className ?? ""}`}
        >
          {selected ? selected.name : "Filter by category"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[135px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No categories found</CommandEmpty>

            <CommandGroup>
              {!categoriesLoading &&
                categories.map((category: any) => (
                  <CommandItem
                    key={category.id}
                    value={category.slug}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="py-2"
                  >
                    <span>{category.name}</span>
                    {value === category.slug && (
                      <Check className={`ml-auto `} />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
