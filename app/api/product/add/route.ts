/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/db/prisma";
import authSeller from "@/lib/authSeller";

// Revamp, separated the 3 sections of this route,
// 1 Upload the Images, slow, wait to finish
// 2 Prisma tx
// 3 Respond

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    /* ================= AUTH ================= */
    const { userId } = getAuth(request);
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= PARSE ================= */
    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const brand = formData.get("brand") as string | null;
    const type = formData.get("type") as "SIMPLE" | "VARIATION";
    const attributesRaw = formData.get("attributes") as string | null;

    const price = formData.get("price") as string | null;
    const salePrice = formData.get("salePrice") as string | null;
    const stock = formData.get("stock") as string | null;

    const rawSku = formData.get("sku") as string | null;
    const sku = rawSku && rawSku.trim() !== "" ? rawSku.trim() : null;

    const searchKeysRaw = formData.get("search_keys") as string | null;
    const variationsRaw = formData.get("variations");

    if (!name || !category || !brand) {
      return NextResponse.json(
        { success: false, message: "Name and category are required" },
        { status: 400 }
      );
    }

    if (!["SIMPLE", "VARIATION"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid product type" },
        { status: 400 }
      );
    }

    /* ================= SIMPLE VALIDATION ================= */
    if (type === "SIMPLE") {
      if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
        return NextResponse.json(
          { success: false, message: "Price must be greater than 0" },
          { status: 400 }
        );
      }

      if (!Number.isFinite(Number(stock)) || Number(stock) < 0) {
        return NextResponse.json(
          { success: false, message: "Stock must be 0 or greater" },
          { status: 400 }
        );
      }

      if (sku) {
        const skuExists = await prisma.product.findUnique({ where: { sku } });
        if (skuExists) {
          return NextResponse.json(
            { success: false, message: "SKU already exists" },
            { status: 400 }
          );
        }
      }
    }

    /* ================= VARIATIONS ================= */
    let variations: any[] = [];

    if (type === "VARIATION") {
      if (typeof variationsRaw !== "string") {
        return NextResponse.json(
          { success: false, message: "Variations are required" },
          { status: 400 }
        );
      }

      variations = JSON.parse(variationsRaw);

      if (!Array.isArray(variations) || variations.length === 0) {
        return NextResponse.json(
          { success: false, message: "No variations provided" },
          { status: 400 }
        );
      }
    }

    /* ================= SEARCH KEYS ================= */
    const search_keys = searchKeysRaw ? JSON.parse(searchKeysRaw) : [];

    /* ================= ATTRIBUTES ================= */
    const attributes = attributesRaw ? JSON.parse(attributesRaw) : [];

    /* ================= IMAGES (OUTSIDE TX) ================= */
    const files = formData.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "No images uploaded" },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          stream.end(buffer);
        });
      })
    );

    const imageUrls = uploadResults.map((r) => r.secure_url);

    /* ================= DATABASE (FAST TX) ================= */
    const product = await prisma.$transaction(async (tx) => {
      const parent = await tx.product.create({
        data: {
          sellerId: userId,
          name,
          description,
          brand,
          category,
          type,
          image: imageUrls,
          search_keys,
          attributes,
          sku,
          price: type === "SIMPLE" ? Math.round(Number(price) * 100) : null,
          salePrice:
            type === "SIMPLE" && salePrice
              ? Math.round(Number(salePrice) * 100)
              : null,
          stock: type === "SIMPLE" ? Number(stock) : null,
        },
      });

      if (type === "VARIATION") {
        await tx.productVariant.createMany({
          data: variations.map((v) => ({
            productId: parent.id,
            name: v.name,
            sku: v.sku || null,
            price: Math.round(v.price * 100),
            salePrice:
              v.salePrice && v.salePrice > 0
                ? Math.round(v.salePrice * 100)
                : null,
            stock: v.stock,
            imageIndex: v.imageIndex,
          })),
        });
      }

      return parent;
    });

    return NextResponse.json({
      success: true,
      message: "Upload Successful",
      product: product.id,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 400 }
    );
  }
}
