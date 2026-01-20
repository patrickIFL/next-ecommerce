import prisma from "@/app/db/prisma";
import { cache } from "react";
import { Metadata } from "next";

const getOrderById = cache(async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      payment: true,
    },
  });
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    return {
      title: "Order Not Found - NextCart",
      description: "",
    };
  }

  return {
    title: `${order.id} - NextCart`,
    description: "",
  };
}

export default async function IndividualOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  return <div className="mt-50">{order?.id ?? ""}</div>;
}
