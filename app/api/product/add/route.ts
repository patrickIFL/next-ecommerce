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
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const type = formData.get("type") as "SIMPLE" | "VARIATION";

    const price = formData.get("price") as string | null;
    const salePrice = formData.get("salePrice") as string | null;

    // because "" will trigger unique constraint
    const rawSku = formData.get("sku") as string | null;
    const sku = rawSku && rawSku.trim() !== "" ? rawSku.trim() : null;

    const stock = formData.get("stock") as string | null;
    const searchKeysRaw = formData.get("search_keys") as string | null;
    const variationsRaw = formData.get("variations");

    if (!name || !category) {
      return NextResponse.json(
        { success: false, message: "Name and category are required" },
        { status: 400 }
      );
    }

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

    // validate

    if (!["SIMPLE", "VARIATION"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid product type" },
        { status: 400 }
      );
    }

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

    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Images uploaded. Upload some." },
        { status: 400 }
      );
    }

    let search_keys: string[] = [];

    if (searchKeysRaw) {
      try {
        search_keys = JSON.parse(searchKeysRaw);
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid search keys format" },
          { status: 400 }
        );
      }
    }

    // Upload each image to Cloudinary
    const uploadResults = await Promise.all(
      files.map((file: File) => {
        return new Promise<any>(async (resolve, reject) => {
          const buffer = Buffer.from(await file.arrayBuffer());

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

    // Extract URLs
    const imageUrls = uploadResults.map((r) => r.secure_url as string);

    const product = await prisma.$transaction(async (tx) => {
      // Create the Parent Product First,
      const parentProduct = await tx.product.create({
        data: {
          userId: userId!,
          name: name!,
          description: description!,
          category: category!,
          price: type === "SIMPLE" ? Math.round(Number(price) * 100) : null,
          salePrice:
            type === "SIMPLE" && salePrice
              ? Math.round(Number(salePrice) * 100)
              : null,
          sku: sku,
          stock: type === "SIMPLE" ? Number(stock) : null,
          search_keys,
          image: imageUrls,
          type: type.toUpperCase() as "SIMPLE" | "VARIATION",
        },
      });

      if (type === "VARIATION") {
        const variantData = variations.map((v) => {
          // Validate per-variant (IMPORTANT)
          if (!v.name || typeof Number(v.stock) !== "number") {
            throw new Error("Invalid variation data");
          }

          if (!Number.isFinite(v.price) || v.price <= 0) {
            throw new Error(`Invalid price for variation: ${v.name}`);
          }

          if (!Number.isFinite(v.stock) || v.stock < 0) {
            throw new Error(`Invalid stock for variation: ${v.name}`);
          }

          return {
            productId: parentProduct.id,
            name: v.name,
            sku: v.sku && v.sku.trim() !== "" ? v.sku.trim() : null,
            price: Math.round(v.price * 100),
            salePrice:
              v.salePrice && v.salePrice > 0
                ? Math.round(v.salePrice * 100)
                : null,
            stock: v.stock,
            imageIndex: v.imageIndex, // 👈 index of parent image
          };
        });

        await tx.productVariant.createMany({
          data: variantData,
          skipDuplicates: true, // avoids SKU conflicts crashing everything
        });
      }

      return parentProduct;
    });

    return NextResponse.json({
      success: true,
      message: "Upload Successful.",
      product: product.id,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
