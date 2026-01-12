import SellerPageTitle from "@/components/seller/SellerPageTitle";
import React from "react";
import ShopeeImportForm from "./ShopeeImportForm";
import prisma from "@/app/db/prisma";

export default async function ShopeeImportPage() {
  const shopeeSupplier = await prisma.supplier.findFirst({
    where: { type: "SHOPEE" },
  });

  if (!shopeeSupplier) {
    return (
      <div className="px-6 py-6 min-h-screen w-full mt-16">
        <SellerPageTitle title="Shopee Supplier Missing" />
        <p className="mt-2 text-sm text-muted-foreground">
          Please create a Shopee supplier first before importing products.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <SellerPageTitle title="Import Shopee Product" />

      <div className="max-w-3xl mt-6">
        <ShopeeImportForm supplierId={shopeeSupplier.id} />
      </div>
    </div>
  );
}
