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

    // 2. Product ID
    const productId = request.url.split("/").pop();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true, // ✅ ADDED (required for variation products)
      },
    });

    if (!oldProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 3. Extract incoming form data
    const formData = await request.formData();

    const name = (formData.get("name") as string) || oldProduct.name;
    const description =
      (formData.get("description") as string) || oldProduct.description;
    const category =
      (formData.get("category") as string) || oldProduct.category;

    const price = Number(formData.get("price") ?? oldProduct.price);
    const salePrice = Number(
      formData.get("salePrice") ?? oldProduct.salePrice
    );

    const sku = formData.get("sku") as string | null;
    const stock = formData.get("stock") as string | null;
    const searchKeysRaw = formData.get("search_keys") as string | null;

    // ===================== ADDED (VARIATION INPUTS) =====================
    const attributesRaw = formData.get("attributes") as string | null;
    const variationsRaw = formData.get("variations") as string | null;

    const attributes = attributesRaw
      ? JSON.parse(attributesRaw)
      : oldProduct.attributes;

    const variations = variationsRaw ? JSON.parse(variationsRaw) : [];
    // ===================================================================

    // ===================== VALIDATION (UNCHANGED + SAFE GUARD) =====================
    if (oldProduct.type === "SIMPLE") {
      if (Number(price) <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Price cannot be set to equal or less than 0",
          },
          { status: 400 }
        );
      }

      if (Number(stock) < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Stock cannot be set to less than 0",
          },
          { status: 400 }
        );
      }
    }
    // ==============================================================================

    const skuExist = await prisma.product.findFirst({
      where: {
        sku: sku!,
        NOT: { id: productId },
      },
    });

    if (skuExist) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    const search_keys: string[] = searchKeysRaw
      ? JSON.parse(searchKeysRaw)
      : oldProduct.search_keys;

    // ---- Image Handling ----
    const newFiles: (File | null)[] = [];

    for (let i = 0; i < 4; i++) {
      const file = formData.get(`images[${i}]`);
      newFiles.push(file instanceof File ? file : null);
    }

    const finalImages = [...oldProduct.image];

    // Upload only changed image slots
    for (let i = 0; i < 4; i++) {
      const file = newFiles[i];
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (err, result) =>
            err ? reject(err) : resolve(result)
          )
          .end(buffer);
      });

      finalImages[i] = uploaded.secure_url;
    }

    const imagesChanged = finalImages.some(
      (url, i) => url !== oldProduct.image[i]
    );

    const changesMade =
      oldProduct.name !== name ||
      oldProduct.description !== description ||
      oldProduct.category !== category ||
      oldProduct.price !== price ||
      oldProduct.salePrice !== salePrice ||
      oldProduct.sku !== sku ||
      oldProduct.stock !== Number(stock) ||
      JSON.stringify(oldProduct.search_keys) !==
        JSON.stringify(search_keys) ||
      imagesChanged;

    if (!changesMade && oldProduct.type === "SIMPLE") {
      return NextResponse.json({
        success: false,
        message: "No changes made",
      });
    }

    // ===================== UPDATE DB =====================
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        userId: userId!,
        name,
        description,
        category,

        ...(oldProduct.type === "SIMPLE"
          ? {
              price: Number(price) * 100,
              salePrice: salePrice ? Number(salePrice) * 100 : null,
              sku,
              stock: Number(stock),
            }
          : {
              attributes,
              variants: {
                deleteMany: {}, // reset existing variants
                createMany: {
                  data: variations.map((v: any) => ({
                    name: v.name,
                    sku: v.sku,
                    price: Number(v.price) * 100,
                    salePrice: v.salePrice
                      ? Number(v.salePrice) * 100
                      : null,
                    stock: Number(v.stock),
                    imageIndex: v.imageIndex,
                  })),
                },
              },
            }),

        search_keys,
        image: finalImages,
      },
    });
    // =====================================================

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
