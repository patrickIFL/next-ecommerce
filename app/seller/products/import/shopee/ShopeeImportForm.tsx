"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShopeeImportForm({
  supplierId,
}: {
  supplierId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"SIMPLE" | "VARIATION">("SIMPLE");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload: any = {
      supplierId,
      type,
      name: formData.get("name"),
      description: formData.get("description"),
      images: (formData.get("images") as string)
        ?.split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
    };

    if (type === "SIMPLE") {
      payload.price = Number(formData.get("price"));
      payload.costPrice = Number(formData.get("costPrice"));
      payload.stock = Number(formData.get("stock"));
    }

    if (type === "VARIATION") {
      payload.variants = JSON.parse(formData.get("variants") as string);
    }

    await fetch("/api/product/import/shopee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type */}
          <div className="space-y-2">
            <Label>Product Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "SIMPLE" | "VARIATION")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIMPLE">Simple Product</SelectItem>
                <SelectItem value="VARIATION">Product with Variants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Wireless Mouse"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional product description"
              rows={4}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label htmlFor="images">Image URLs</Label>
            <Textarea
              id="images"
              name="images"
              placeholder="One image URL per line"
              rows={4}
            />
          </div>

          {/* SIMPLE PRODUCT FIELDS */}
          {type === "SIMPLE" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input name="price" type="number" required />
                </div>

                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input name="costPrice" type="number" required />
                </div>

                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input name="stock" type="number" required />
                </div>
              </div>
            </>
          )}

          {/* VARIATION FIELDS */}
          {type === "VARIATION" && (
            <div className="space-y-2">
              <Label htmlFor="variants">Variants (JSON)</Label>
              <Textarea
                id="variants"
                name="variants"
                rows={8}
                placeholder={`[
  {
    "name": "Black / M",
    "price": 499,
    "costPrice": 280,
    "stock": 10
  }
]`}
                required
              />
              <p className="text-sm text-muted-foreground">
                One variant = one sellable unit. Cost and stock are variant-level.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
