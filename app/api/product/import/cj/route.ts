import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(req: NextRequest) {
  const body = await req.json();
   const { userId } = getAuth(req);
      if (!userId || !(await authSeller(userId))) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

  const {
    supplierId,
    name,
    description,
    images,
    cjProductId,
    variants,
  } = body;

  const product = await prisma.product.create({
    data: {
      sellerId: userId,
      name,
      description,
      image: images,
      type: "VARIATION",
      supplierId,
      cjProductId,
      variants: {
        create: variants.map((v: any) => ({
          name: v.name,
          price: v.price,
          costPrice: v.costPrice,
          stock: v.stock ?? 0,
          cjVariantId: v.cjVariantId,
        })),
      },
    },
  });

  return NextResponse.json({ success: true, productId: product.id });
}
