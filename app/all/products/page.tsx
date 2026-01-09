// app/all/products/page.tsx (Server Component)
import prisma from "@/app/db/prisma";
import AllProductsClient from "./AllProductsClient";

const PAGE_SIZE = 10;

export default async function Page() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    include: { variants: true },
  });

  const total = await prisma.product.count({
    where: { isArchived: false },
  });

  return (
    <AllProductsClient
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialPagination={{
        page: 1,
        limit: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      }}
    />
  );
}
