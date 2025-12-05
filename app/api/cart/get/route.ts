import { NextRequest } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Auth
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ensure user exists in Prisma
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

    // 3. Fetch the CartItems User has
    const cartItems = await prisma.cartItem.findMany({
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
    return Response.json({ success: true, cartItems });
  } catch (error) {
    console.error("FETCH CART ERROR:", error);
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
