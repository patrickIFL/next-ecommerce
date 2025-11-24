import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function PATCH(request: Request) {
  try {
    // 1. Auth
    const { userId } = getAuth(request);
    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Extract cart item ID from URL
    const cartItemId = request.url.split("/").pop();
    if (!cartItemId) {
      return Response.json(
        { success: false, message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // 3. Parse body
    const { quantity } = await request.json();

    if (quantity === undefined || quantity === null) {
      return Response.json(
        { success: false, message: "Quantity is required" },
        { status: 400 }
      );
    }

    // 4. Ensure user exists in Prisma
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist in database.",
        },
        { status: 404 }
      );
    }

    // 5. If quantity is 0, delete the cart item
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return Response.json({
        success: true,
        message: "Cart item removed",
        deleted: true,
      });
    }

    // 6. Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return Response.json({
      success: true,
      message: "Cart item updated",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
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
