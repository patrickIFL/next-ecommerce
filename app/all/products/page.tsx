// app/all/products/page.tsx (Server Component)
import prisma from "@/app/db/prisma";
import AllProductsClient from "./AllProductsClient";

const PAGE_SIZE = 10;

export default async function Page() {
  const page = 1;
  const limit = PAGE_SIZE;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { variants: true },
    }),
    prisma.product.count({
      where: { isArchived: false },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <AllProductsClient
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialPagination={{
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }}
    />
  );
}
