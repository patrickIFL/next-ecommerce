"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check, ChevronDown, Plus, X } from "lucide-react";
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface BrandComboBoxProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function BrandComboBox({
  className,
  value,
  onChange,
}: BrandComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    slug: "",
  });

  const queryClient = useQueryClient();

  /* ================= FETCH BRANDS ================= */

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/product/brands");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load brands");
      }

      return json.data;
    },
  });

  /* ================= DELETE BRAND ================= */

  const { mutateAsync: deleteBrand } = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/product/brands/delete/${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete brand");
      }

      return data;
    },
  });

  /* ================= ADD BRAND ================= */

  const { mutateAsync: addBrand } = useMutation({
    mutationFn: async (brand: { name: string; slug: string }) => {
      const res = await fetch(`/api/product/brands/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brand),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add brand");

      return data;
    },
    onSuccess: () => {
      setNewBrand({ name: "", slug: "" });
    },
    onError: () => {
      toast.error("Failed to add brand");
    },
  });

  const selected = brands?.find((b: any) => b.slug === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`rounded font-normal min-w-[140px] justify-between ${
            className ?? ""
          }`}
        >
          {selected ? selected.name : "Select brand"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[140px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No brands found</CommandEmpty>

            <CommandGroup>
              {!brandsLoading &&
                brands?.map((brand: any) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.slug}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="py-2"
                  >
                    <span>{brand.name}</span>

                    {value === brand.slug ? (
                      <Check className="ml-auto" />
                    ) : (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteBrand(brand.slug);
                          queryClient.invalidateQueries({
                            queryKey: ["brands"],
                          });
                        }}
                        className="ml-auto"
                      >
                        <X />
                      </button>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>

          {/* ================= ADD BRAND INPUT ================= */}
          <div className="flex h-9 items-center gap-2 border-t px-3">
            <input
              value={newBrand.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewBrand({
                  name,
                  slug: name.toLowerCase().replace(/\s+/g, "-"),
                });
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  await addBrand(newBrand);
                  queryClient.invalidateQueries({
                    queryKey: ["brands"],
                  });
                }
              }}
              placeholder="Add New"
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              onClick={async () => {
                await addBrand(newBrand);
                queryClient.invalidateQueries({
                  queryKey: ["brands"],
                });
              }}
            >
              <Plus className="size-4 shrink-0 opacity-50 text-foreground" />
            </button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
