import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const productId = request.url.split("/").pop();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
      });
    }

    await prisma.wishlist.create({
      data: { userId, productId },
    });

    return NextResponse.json({
      success: true,
      action: "added",
    });
  } catch (error) {
    console.error("TOGGLE WISHLIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
