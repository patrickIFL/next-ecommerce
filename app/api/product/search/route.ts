import { NextResponse } from "next/server";
import prisma from "@/app/db/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ success: true, results: [] });
  }

  // const products = await prisma.product.findMany({
  //   where: {
  //     OR: [
  //       { name: { contains: q, mode: "insensitive" } },
  //       { category: { contains: q, mode: "insensitive" } },

  //       // 🔍 Match array items
  //       {
  //         search_keys: {
  //           hasSome: [q.toLowerCase()], // <-- match ANY key
  //         },
  //       },
  //     ],
  //   },
  // });

  //Updated Search
  const products = await prisma.$queryRaw`
  SELECT *
  FROM "Product"
  WHERE 
    LOWER("name") LIKE ${`%${q.toLowerCase()}%`}
    OR LOWER("category") LIKE ${`%${q.toLowerCase()}%`}
    OR EXISTS (
      SELECT 1
      FROM unnest("search_keys") AS sk
      WHERE LOWER(sk) LIKE ${`%${q.toLowerCase()}%`}
    );
`;

  return NextResponse.json({ success: true, results: products });
}
