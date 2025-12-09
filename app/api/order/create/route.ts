/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { paymongo } from "@/lib/paymongo";
// import { inngest } from "@/src/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const { selectedAddressId, platform } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!selectedAddressId) {
    return NextResponse.json(
      { success: false, message: "No address selected" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // 🔥 2️⃣ ATOMIC STOCK VALIDATION & RESERVATION
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true, name: true, salePrice: true },
          });

          if (!product) {
            throw new Error("Product not found: " + item.productId);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name}. Available: ${product.stock}`
            );
          }

          // decrement stock atomically
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    // 2️⃣ Calculate totals
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product.salePrice,
      0
    );

    // Apply TAX and SHIPPING

    const tax = Math.floor(Number(process.env.NEXT_PUBLIC_TAX) || 0);
    const shipping = Math.floor(Number(process.env.NEXT_PUBLIC_SHIPPING) || 0);

    const taxValue = Math.floor(subtotal * (tax / 100));
    // const total = subtotal + taxValue + shipping;

    const lineItems = [
      ...cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        amount: Math.floor(item.product.salePrice), // Already converted
        currency: "PHP",
      })),
      {
        name: "Tax",
        quantity: 1,
        amount: taxValue * 100, // Remove if no tax
        currency: "PHP",
      },
      {
        name: "Shipping",
        quantity: 1,
        amount: shipping * 100, // Remove if no shipping
        currency: "PHP",
      },
    ];

    const checkoutSession = await paymongo.post("/checkout_sessions", {
      data: {
        attributes: {
          line_items: lineItems,
          payment_method_types: [
            "gcash",
            "card",
            "paymaya",
            "grab_pay",
            "billease",
          ],
          description: "Next-Ecommerce",
          success_url:
            platform === "mobile"
              ? `${process.env.NEXT_PUBLIC_SITE_URL}`
              : `${process.env.NEXT_PUBLIC_SITE_URL}/order-placed`,
          cancel_url:
            platform === "mobile"
              ? `${process.env.NEXT_PUBLIC_SITE_URL}`
              : `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
          metadata: {
            userId,
            selectedAddressId,
            cartItems: JSON.stringify(cartItems),
            lineItems: JSON.stringify(
              cartItems.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                amount: Math.floor(item.product.salePrice),
                currency: "PHP",
                images: item.product.image ? [item.product.image] : [],
                description: item.product.description || "",
              }))
            ),
          },
        },
      },
    });

    const session = checkoutSession.data.data;

    return NextResponse.json({
      checkoutUrl: session.attributes.checkout_url,
      totalAmount: subtotal,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
