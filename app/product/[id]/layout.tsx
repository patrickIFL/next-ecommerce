import prisma from "@/app/db/prisma";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      name: true,
      description: true
    }
  });

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
