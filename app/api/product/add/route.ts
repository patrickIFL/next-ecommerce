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
    const price = formData.get("price") as string | null;
    const offerPrice = formData.get("offerPrice") as string | null;

    const sku = formData.get("sku") as string | null;
    const stock = formData.get("stock") as string | null;
    const searchKeysRaw = formData.get("search_keys") as string | null;
    const variationsRaw = formData.get("variations") as string | null;

    // validate

    if (Number(price) <= 0 || Number(offerPrice) <= 0) {
      return NextResponse.json(
        { success: false, message: "Price cannot be set to equal or less than 0" },
        { status: 401 }
      );
    }

    if (Number(stock) < 0) {
      return NextResponse.json(
        { success: false, message: "Stock cannot be set to less than 0" },
        { status: 401 }
      );
    }

    // Check if SKU already exists
    const skuExist = await prisma.product.findUnique({
      where: { sku: sku! },
    });

    if (skuExist) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
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
    const variations: string[] = variationsRaw ? JSON.parse(variationsRaw) : [];

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

    const newProduct = await prisma.product.create({
      data: {
        userId: userId!,
        name: name!,
        description: description!,
        category: category!,
        price: Number(price),
        offerPrice: Number(offerPrice),

        sku: sku!,
        stock: Number(stock),
        search_keys,
        variations,

        image: imageUrls,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Upload Successful.",
      newProduct,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
