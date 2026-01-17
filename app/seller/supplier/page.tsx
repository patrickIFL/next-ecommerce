"use client";

import { useState } from "react";
import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Supplier } from "@/lib/types";
import { useRouter } from "next/navigation";

function SupplierPage() {
  const supplierTypes = [
    { label: "Shopee", value: "SHOPEE" },
    { label: "Lazada", value: "LAZADA" },
    { label: "TikTok Shop", value: "TIKTOK" },
    { label: "Owned / Manual Inventory", value: "MANUAL" },
  ];

  const [open, setOpen] = useState(false);

  const [supplierName, setSupplierName] = useState("");
  const [type, setType] = useState("");
  const [externalId, setExternalId] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: createSupplier, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/supplier/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supplierName,
          type,
          externalId,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Failed to create supplier");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Supplier created");

      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      setOpen(false);
      setSupplierName("");
      setType("");
      setExternalId("");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to save supplier");
    },
  });

  const handleSubmit = () => {
    createSupplier();
  };

  const { data: suppliers, isLoading: loading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await fetch("/api/supplier/get");
      const data = await res.json();
      return data;
    },
  });

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <div className="flex gap-3">
        <SellerPageTitle title="Suppliers" />
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="min-w-full mx-auto overflow-x-auto mt-6">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-accent bg-accent text-foreground">
              <th className="p-3">Supplier Name</th>
              <th className="p-3 text-center">Type</th>
              <th className="p-3 text-center">External ID</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-muted-foreground"
                >
                  Loading suppliers...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-muted-foreground"
                >
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier: Supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b hover:bg-muted/50 transition cursor-pointer"
                  onClick={() => {
                    router.push(`/seller/products/import/`);
                  }}
                >
                  <td className="p-3">{supplier.name}</td>
                  <td className="p-3 text-center">{supplier.type}</td>
                  <td className="p-3 text-center">
                    {supplier.externalId || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. ABC Trading"
              />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {type
                      ? supplierTypes.find((t) => t.value === type)?.label
                      : "Select supplier type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {supplierTypes.map((item) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={(currentValue) => {
                            setType(currentValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              type === item.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="externalId">External ID</Label>
              <Input
                id="externalId"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                placeholder="Your Supplier ID"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierPage;
