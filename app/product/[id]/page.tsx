import prisma from "@/app/db/prisma";
import IndividualProduct from "./IndividualProduct";

import { cache } from "react";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

const getProductById = cache(async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found - NextCart",
      description: "",
    };
  }

  return {
    title: `${product.name} - NextCart`,
    description: product.description ?? "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return <div>Product not found</div>;
  }

  console.log("PRODUCT ID:", id);

  return <IndividualProduct product={product} />;
}
