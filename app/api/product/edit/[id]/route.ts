/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(request: NextRequest) {
  try {
    // 1. Auth
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!userId || !isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get product ID
    const productId = request.url.split("/").pop();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!oldProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 3. Extract incoming form data
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const offerPrice = Number(formData.get("offerPrice"));

    // ---- Image Handling ----
    // We expect EXACTLY 4 image slots
    // Each is "images[0]", "images[1]", etc.
    const newFiles: (File | null)[] = [];

    for (let i = 0; i < 4; i++) {
      const file = formData.get(`images[${i}]`);
      newFiles.push(file instanceof File ? file : null);
    }

    // Start with old images
    const finalImages = [...oldProduct.image];

    // Upload only changed slots
    for (let i = 0; i < 4; i++) {
      const file = newFiles[i];

      // Skip unchanged slots
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (err:any, result:any) => (err ? reject(err) : resolve(result))
        ).end(buffer);
      });

      finalImages[i] = uploaded.secure_url;
    }

    // 4. Check if anything actually changed
    const changesMade =
      oldProduct.name !== name ||
      oldProduct.description !== description ||
      oldProduct.category !== category ||
      oldProduct.price !== price ||
      oldProduct.offerPrice !== offerPrice ||
      JSON.stringify(oldProduct.image) !== JSON.stringify(finalImages);

    if (!changesMade) {
      return NextResponse.json({
        success: false,
        message: "No changes made",
      });
    }

    // 5. Update DB
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        category,
        price,
        offerPrice,
        image: finalImages,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
