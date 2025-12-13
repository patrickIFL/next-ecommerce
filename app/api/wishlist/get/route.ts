import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

// returns : wishlist = ['pid1', 'pid2', 'pid3']
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });

    return NextResponse.json({
      success: true,
      wishlist: wishlist.map(w => w.productId),
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
