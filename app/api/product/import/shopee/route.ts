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
    type, // "SIMPLE" | "VARIATION"
    price,
    costPrice,
    stock,
    variants,
  } = body;

  if (!name || !type) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // ---------- SIMPLE PRODUCT ----------
  if (type === "SIMPLE") {
    if (!price || costPrice == null) {
      return NextResponse.json(
        { success: false, message: "Simple product requires price and costPrice" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        name,
        description,
        image: images ?? [],
        type: "SIMPLE",
        supplierId,
        price,
        costPrice,
        stock: stock ?? 0,
      },
    });

    return NextResponse.json({ success: true, productId: product.id });
  }

  // ---------- VARIATION PRODUCT ----------
  if (type === "VARIATION") {
    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { success: false, message: "Variants are required for variation products" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        name,
        description,
        image: images ?? [],
        type: "VARIATION",
        supplierId,
        costPrice: null, // IMPORTANT: variant-level cost only
        stock: null,     // variant-level stock only
        variants: {
          create: variants.map((v: any) => {
            if (v.costPrice == null || v.price == null) {
              throw new Error("Each variant must have price and costPrice");
            }

            return {
              name: v.name,
              price: v.price,
              salePrice: v.salePrice ?? null,
              costPrice: v.costPrice,
              stock: v.stock ?? 0,
            };
          }),
        },
      },
    });

    return NextResponse.json({ success: true, productId: product.id });
  }

  return NextResponse.json(
    { success: false, message: "Invalid product type" },
    { status: 400 }
  );
}
