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
    const type = formData.get("type") as "simple" | "variation";

    const price = formData.get("price") as string | null;
    const salePrice = formData.get("salePrice") as string | null;

    // because "" will trigger unique constraint
    const rawSku = formData.get("sku") as string | null;
    const sku = rawSku && rawSku.trim() !== "" ? rawSku.trim() : null;

    const stock = formData.get("stock") as string | null;
    const searchKeysRaw = formData.get("search_keys") as string | null;

    // validate

    if (!["simple", "variation"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid product type" },
        { status: 400 }
      );
    }

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

    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const search_keys: string[] = searchKeysRaw
      ? JSON.parse(searchKeysRaw)
      : [];

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

    const parentProduct = await prisma.$transaction(async (tx) => {
      return await tx.product.create({
        data: {
          userId: userId!,
          name: name!,
          description: description!,
          category: category!,
          price: type === "simple" ? Math.round(Number(price) * 100) : null,
          salePrice:
            type === "simple" && salePrice
              ? Math.round(Number(salePrice) * 100)
              : null,
          sku: sku,
          stock: Number(stock),
          search_keys,
          image: imageUrls,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Upload Successful.",
      product: parentProduct,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
