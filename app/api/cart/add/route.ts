import { NextRequest } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId, quantity = 1 } = await request.json();

    if (!productId) {
      return Response.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    // SIMPLE PRODUCT STOCK CHECK
    if (product.type === "SIMPLE") {
      if (product.stock !== null && product.stock < quantity) {
        return Response.json(
          { message: `Insufficient stock. Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // VARIATION PRODUCT STOCK CHECK
    if (product.type === "VARIATION") {
      if (!variantId) {
        return Response.json(
          { message: "Variant is required" },
          { status: 400 }
        );
      }

      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return Response.json({ message: "Variant not found" }, { status: 404 });
      }

      if (variant.stock !== null && variant.stock < quantity) {
        return Response.json(
          { message: `Insufficient stock. Available: ${variant.stock}` },
          { status: 400 }
        );
      }
    }

    /* =====================================================
       SIMPLE PRODUCT (variantId = NULL)
       ===================================================== */
    if (product.type === "SIMPLE") {
      const existing = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
          variantId: null,
        },
      });

      const cartItem = existing
        ? await prisma.cartItem.update({
            where: { id: existing.id },
            data: {
              quantity: { increment: quantity },
            },
            include: { product: true },
          })
        : await prisma.cartItem.create({
            data: {
              userId,
              productId,
              variantId: null,
              quantity,
            },
            include: { product: true },
          });

      return Response.json({ success: true, cartItem });
    }

    /* =====================================================
       VARIATION PRODUCT
       ===================================================== */
    if (!variantId) {
      return Response.json({ message: "Variant is required" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        variantId,
        quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return Response.json({ success: true, cartItem });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
