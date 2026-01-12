import SellerPageTitle from "@/components/seller/SellerPageTitle";
import React from "react";
import CJImportForm from "./CJImportForm";
import prisma from "@/app/db/prisma";

export default async function CJImportPage() {
     const cjSupplier = await prisma.supplier.findFirst({
    where: { type: "CJ" },
  });

  if (!cjSupplier) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">CJ Supplier Missing</h1>
        <p>Create a CJ supplier first.</p>
      </div>
    );
  }
  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <SellerPageTitle title="Import CJ Product" />

      <div className="max-w-3xl mt-6">
        <CJImportForm supplierId={cjSupplier.id} />
      </div>
    </div>
  );
}
