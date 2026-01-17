import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { Variant } from "@/lib/types";

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
    attributes,
    price,
    salePrice,
    costPrice,
    stock,
    variants,
    search_keys,
    category,
    brand,
  } = body;

  const normalizedSearchKeys = Array.isArray(search_keys)
    ? search_keys.filter((k) => typeof k === "string")
    : [];

  const normalizedCategory =
    typeof category === "string" && category.trim()
      ? category
      : "Uncategorized";

  const normalizedBrand =
    typeof brand === "string" && brand.trim() ? brand : "Generic";

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
        {
          success: false,
          message: "Simple product requires price and costPrice",
        },
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

        category: normalizedCategory,
        brand: normalizedBrand,
        search_keys: normalizedSearchKeys,

        price: Math.round(Number(price) * 100),
        salePrice: Math.round(Number(salePrice) * 100),
        costPrice: Math.round(Number(costPrice) * 100),
        stock: stock ?? 0,
      },
    });

    return NextResponse.json({ success: true, productId: product.id });
  }

  // ---------- VARIATION PRODUCT ----------
  if (type === "VARIATION") {
    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Variants are required for variation products",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        name,
        description,
        attributes,
        image: images ?? [],
        type: "VARIATION",
        supplierId,

        category: normalizedCategory,
        brand: normalizedBrand,
        search_keys: normalizedSearchKeys,

        costPrice: null,
        stock: null,

        variants: {
          create: variants.map((v: Variant) => {
            if (v.costPrice == null || v.price == null) {
              throw new Error("Each variant must have price and costPrice");
            }

            return {
              name: v.name,
              price: Math.round(Number(v.price) * 100),
              salePrice:
                v.salePrice != null
                  ? Math.round(Number(v.salePrice) * 100)
                  : null,
              costPrice: Math.round(Number(v.costPrice) * 100),
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
