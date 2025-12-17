/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/db/prisma";
import authSeller from "@/lib/authSeller";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    /* ================= AUTH ================= */
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
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
    const type = formData.get("type") as "simple" | "variation";

    const price = formData.get("price") as string | null;
    const salePrice = formData.get("salePrice") as string | null;
    const sku = formData.get("sku") as string | null;
    const stock = formData.get("stock") as string | null;

    const searchKeysRaw = formData.get("search_keys") as string | null;
    const variantsRaw = formData.get("variations") as string | null;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["simple", "variation"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid product type" },
        { status: 400 }
      );
    }

    /* ================= SIMPLE VALIDATION ================= */
    if (type === "simple") {
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
        const skuExist = await prisma.product.findUnique({
          where: { sku },
        });

        if (skuExist) {
          return NextResponse.json(
            { success: false, message: "SKU already exists" },
            { status: 400 }
          );
        }
      }
    }

    /* ================= FILE UPLOAD ================= */
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
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
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          stream.end(buffer);
        });
      })
    );

    const imageUrls = uploadResults.map((r) => r.secure_url as string);

    const search_keys: string[] = searchKeysRaw
      ? JSON.parse(searchKeysRaw)
      : [];

    const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

    /* ================= TRANSACTION ================= */
    const product = await prisma.$transaction(async (tx) => {
      /* ---------- CREATE PARENT PRODUCT ---------- */
      const parentProduct = await tx.product.create({
        data: {
          userId: userId!,
          name,
          description,
          category,
          type: type === "simple" ? "SIMPLE" : "VARIATION",
          image: imageUrls,
          search_keys,

          price: type === "simple" ? Math.round(Number(price) * 100) : null,
          salePrice:
            type === "simple" && salePrice
              ? Math.round(Number(salePrice) * 100)
              : null,
          stock: type === "simple" ? Number(stock) : null,
          sku: type === "simple" ? sku : null,
        },
      });

      /* ---------- CREATE VARIANTS ---------- */
      if (type === "variation") {
        if (!Array.isArray(variants) || variants.length === 0) {
          throw new Error("Variation products require at least one variant");
        }

        const variantData = variants.map((v: any) => {
          if (
            !Number.isFinite(Number(v.price)) ||
            Number(v.price) <= 0 ||
            !Number.isFinite(Number(v.stock)) ||
            Number(v.stock) < 0
          ) {
            throw new Error("Invalid variant price or stock");
          }

          return {
            productId: parentProduct.id,
            name: v.name,
            sku: v.sku || null,
            price: Math.round(Number(v.price) * 100),
            salePrice: v.salePrice
              ? Math.round(Number(v.salePrice) * 100)
              : null,
            stock: Number(v.stock),
            image:
              typeof v.imageIndex === "number"
                ? imageUrls[v.imageIndex] ?? null
                : null,
          };
        });

        await tx.productVariant.createMany({
          data: variantData,
          skipDuplicates: true,
        });
      }

      return parentProduct;
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      productId: product.id,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
