/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { paymongo } from "@/lib/paymongo";
// import { inngest } from "@/src/config/inngest";
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

    // const tax = Math.floor(Number(process.env.NEXT_PUBLIC_TAX) || 0);
    // const shipping = Math.floor(Number(process.env.NEXT_PUBLIC_SHIPPING) || 0);

    // const taxValue = Math.floor(subtotal * (tax / 100));
    // const total = subtotal + taxValue + shipping;

    const lineItems = cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      amount: Math.floor(item.product.offerPrice * 100), // PayMongo uses cents
      currency: "PHP",
    }));

    // =================================================================


    // 3️⃣ Prepare items for nested create
    // const items = cartItems.map((item) => ({
    //   productId: item.productId,
    //   quantity: item.quantity,
    // }));

    const checkoutSession = await paymongo.post("/checkout_sessions", {
  data: {
    attributes: {
      line_items: lineItems,
      payment_method_types: ["gcash", "card"], // valid only
      description: "Next-Ecommerce",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-placed`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        userId,
        items: cartItems.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  },
});


    const session = checkoutSession.data.data;

    // await inngest.send({
    //   name: "order/created",
    //   data: {
    //     userId,
    //     shippingAddressId: selectedAddressId,
    //     amount: total,
    //     orderDate: new Date(),
    //     shippingMethod: "standard",
    //     items,
    //   },
    // });

    // // 5️⃣ Clear cart
    // await prisma.cartItem.deleteMany({ where: { userId } });

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
