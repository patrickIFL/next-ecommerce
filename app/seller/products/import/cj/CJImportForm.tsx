"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CJImportForm({ supplierId }: { supplierId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      supplierId,
      name: formData.get("name"),
      description: formData.get("description"),
      cjProductId: formData.get("cjProductId"),
      images: (formData.get("images") as string)
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      variants: JSON.parse(formData.get("variants") as string),
    };

    await fetch("/api/product/import/cj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
  }

  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>CJ Product Import</CardTitle>
      </CardHeader> */}

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CJ Product ID */}
          <div className="space-y-2">
            <Label htmlFor="cjProductId">CJ Product ID</Label>
            <Input
              id="cjProductId"
              name="cjProductId"
              placeholder="CJ123456789"
            />
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Oversized Cotton T-Shirt"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Product description (optional)"
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
            <p className="text-sm text-muted-foreground">
              These will be saved as the product image gallery.
            </p>
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <Label htmlFor="variants">Variants (JSON)</Label>
            <Textarea
              id="variants"
              name="variants"
              placeholder={`[
  {
    "name": "Red / Small",
    "price": 1200,
    "costPrice": 600,
    "stock": 0,
    "cjVariantId": "CJVAR123"
  }
]`}
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground">
              One CJ variant = one ProductVariant. This will be replaced with a
              UI later.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Importing..." : "Import Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
