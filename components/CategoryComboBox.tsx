"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Command, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface CategoryComboBoxProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryComboBox({
  className,
  value,
  onChange,
}: CategoryComboBoxProps) {
  const [open, setOpen] = useState(false);

  // Fetch categories from API
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  const selected = categories.find((c: any) => c.slug === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[135px] rounded font-normal justify-between ${className ?? ""}`}
        >
          {selected ? selected.name : "Select category"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[135px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No categories found</CommandEmpty>

            <CommandGroup>
              {!isLoading &&
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

                    <Check
                      className={`ml-auto ${value === category.slug ? "opacity-100" : "opacity-0"
                        }`}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}



