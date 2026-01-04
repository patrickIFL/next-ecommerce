import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Auth
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ensure user exists in Prisma
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist in database. Create user first.",
        },
        { status: 404 }
      );
    }

    // 3. Fetch the CartItems User has
    const cartItems = await prisma.wishlist.findMany({
      where: {
        userId,
        product: {
          isArchived: false,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5. Return the updated/created cart item
    return NextResponse.json({ success: true, cartItems });
  } catch (error) {
    console.error("FETCH CART ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
