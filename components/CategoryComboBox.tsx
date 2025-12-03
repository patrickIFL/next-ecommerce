"use client";
/* eslint-disable @typescript-eslint/no-explicit-any*/
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
import { toast } from "./ui/use-toast";

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
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
  });
  const queryClient = useQueryClient();

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

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/product/categories/delete/${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed Delete cat");
      return data;
    },
  });

  const { mutateAsync: addCategory } = useMutation({
    mutationFn: async (newCategory: { name: string; slug: string }) => {
      const res = await fetch(`/api/product/categories/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      setNewCategory({ name: "", slug: "" })
    },
    onError: () => {
      toast({
        title: 'Category Already Exist',
        description: "Try another one.",
        variant: 'default'
      });
    }
  });

  const selected = categories?.find((c: any) => c.slug === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`rounded font-normal justify-between ${className ?? ""
            }`}
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
                    {value === category.slug ? (
                      <Check className={`ml-auto `} />
                    ) : (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteCategory(category.slug);
                          queryClient.invalidateQueries({
                            queryKey: ["categories"],
                          });
                        }}
                        className="ml-auto cursor-pointer"
                      >
                        <X />
                      </button>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
          <div className="flex h-9 items-center gap-2 border-t px-3">
            <input
              value={newCategory.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewCategory({
                  name,
                  slug: name.toLowerCase().replace(/\s+/g, "-"),
                });
              }}
              placeholder="Add New"
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="submit"
              onClick={async () => {
                await addCategory(newCategory);
                queryClient.invalidateQueries({ queryKey: ["categories"] });
              }}
              className="cursor-pointer"
            >
              <Plus className="size-4 shrink-0 opacity-50 text-foreground" />
            </button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
