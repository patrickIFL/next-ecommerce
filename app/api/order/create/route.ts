/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const { selectedAddressId } = await req.json();

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

    // 2️⃣ Calculate totals
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product.offerPrice,
      0
    );

    const tax = Math.floor(Number(process.env.NEXT_PUBLIC_TAX) || 0);
    const shipping = Math.floor(Number(process.env.NEXT_PUBLIC_SHIPPING) || 0);

    const taxValue = Math.floor(subtotal * (tax / 100));
    const total = subtotal + taxValue + shipping;

    // 3️⃣ Prepare items for nested create
    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // 4️⃣ Create Order + OrderItems
    // const newOrder = await prisma.order.create({
    //   data: {
    //     userId,
    //     shippingAddressId: selectedAddressId,
    //     amount: total,
    //     orderDate: new Date(),
    //     shippingMethod: "standard",

    //     items: {
    //       create: items,
    //     },
    //   },
    // });

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address: selectedAddressId,
        amount: total,
        orderDate: new Date(),
        shippingMethod: "standard",
        items,
      },
    });

    // 5️⃣ Clear cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
