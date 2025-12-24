/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { paymongo } from "@/lib/paymongo";
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
    /* ================= CART ================= */
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    /* ================= RESERVE STOCK ================= */
    const reservationIds = await prisma.$transaction(async (tx) => {
      const ids: string[] = [];

      for (const item of cartItems) {
        const isVariant = !!item.variantId;

        // 1️⃣ Load stock source
        const stockSource = isVariant
          ? await tx.productVariant.findUnique({
              where: { id: item.variantId! },
              select: { stock: true, name: true },
            })
          : await tx.product.findUnique({
              where: { id: item.productId },
              select: { stock: true, name: true },
            });

        if (!stockSource) {
          throw new Error("Product not found");
        }

        // 2️⃣ Sum existing reservations
        const reserved = await tx.stockReservation.aggregate({
          where: {
            productId: item.productId,
            variantId: item.variantId ?? null,
            fulfilled: false,
            restored: false,
          },
          _sum: { quantity: true },
        });

        const reservedQty = reserved._sum.quantity ?? 0;
        
        if (stockSource.stock === null) {
          throw new Error(`Stock not set for ${stockSource.name}`);
        }

        const available = stockSource.stock - reservedQty;

        if (available < item.quantity) {
          throw new Error(
            `Insufficient stock for ${stockSource.name}. Available: ${available}`
          );
        }

        // 3️⃣ Decrement stock
        if (isVariant) {
          await tx.productVariant.update({
            where: { id: item.variantId! },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // 4️⃣ Create reservation
        const reservation = await tx.stockReservation.create({
          data: {
            productId: item.productId,
            variantId: item.variantId ?? null,
            userId,
            quantity: item.quantity,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        });

        ids.push(reservation.id);
      }

      return ids;
    });

    /* ================= TOTALS ================= */
    const subtotal = cartItems.reduce((acc, item) => {
      const price =
        item.variant?.salePrice ??
        item.variant?.price ??
        item.product.salePrice ??
        item.product.price ??
        0;

      return acc + price * item.quantity;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX || 0);
    const shipping = Number(process.env.NEXT_PUBLIC_SHIPPING || 0);

    const taxValue = Math.floor(subtotal * (taxRate / 100));

    /* ================= PAYMONGO ================= */
    const lineItems = [
      ...cartItems.map((item) => ({
        name: item.variant?.name ?? item.product.name,
        quantity: item.quantity,
        amount:
          item.variant?.salePrice ??
          item.variant?.price ??
          item.product.salePrice ??
          item.product.price,
        currency: "PHP",
      })),
      {
        name: "Tax",
        quantity: 1,
        amount: taxValue,
        currency: "PHP",
      },
      {
        name: "Shipping",
        quantity: 1,
        amount: shipping * 100,
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
              ? process.env.NEXT_PUBLIC_SITE_URL
              : `${process.env.NEXT_PUBLIC_SITE_URL}/order-placed`,
          cancel_url:
            platform === "mobile"
              ? process.env.NEXT_PUBLIC_SITE_URL
              : `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
          metadata: {
            userId,
            selectedAddressId,
            reservations: JSON.stringify({ list: reservationIds }),
            cartItems: JSON.stringify(
              cartItems.map((item) => ({
                productId: item.productId,
                variantId: item.variantId ?? null,
                quantity: item.quantity,
                name: item.variant?.name ?? item.product.name,
                price:
                  item.variant?.salePrice ??
                  item.variant?.price ??
                  item.product.salePrice ??
                  item.product.price,
              }))
            ),
          },
        },
      },
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.data.data.attributes.checkout_url,
      totalAmount: subtotal + taxValue + shipping,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
