/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

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

    // 2. Get product ID from URL
    const productId = request.url.split("/").pop();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // 3. Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 4. Toggle the featured state
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isFeatured: !product.isFeatured },
    });

    return NextResponse.json({
      success: true,
      message: `Product is ${updatedProduct.isFeatured ? "now on Featured" : "removed from featured list"}`,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("TOGGLE FEATURE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
