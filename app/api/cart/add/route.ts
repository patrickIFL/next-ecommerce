import { NextRequest } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const { userId } = getAuth(request);
    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse body
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // 3. Ensure user exists in Prisma
    // Clerk users do NOT automatically exist in your DB.
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist in database. Create user first.",
        },
        { status: 404 }
      );
    }

    // 4. Upsert Cart Item (create or update)
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    // 5. Return the updated/created cart item
    return Response.json({ success: true, cartItem });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return Response.json(
      {
        success: false,
        message: "Server error",
        error: JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
