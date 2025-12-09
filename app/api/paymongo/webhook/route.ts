/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventType = body.data?.attributes?.type;
    console.log("🔔 Event type:", eventType);

    // if (eventType === "checkout_session.payment.paid") {
    if (eventType === "payment.paid") {
      const session = body.data.attributes.data;
      const checkout_id = session.id;
      const payment = session.attributes.payments[0];
      const currency = payment.attributes.currency;
      const payment_intent = session.attributes.payment_intent;
      const payment_intent_id = payment_intent.id;
      const payment_id = payment.id;
      const customer_name = payment.attributes.billing.name;
      const customer_email = payment.attributes.billing.email;
      const customer_phone = payment.attributes.billing.phone;
      const payment_method = payment.attributes.source.type;
      const payment_date = payment.attributes.paid_at;

      const metadata = session.attributes.metadata;
      const amount = payment.attributes.amount;
      const userId = metadata.userId;
      const selectedAddressId = metadata.selectedAddressId;
      const cartItems = JSON.parse(metadata.cartItems);
      const line_items = metadata.lineItems;
      const reservations = JSON.parse(metadata.reservations || "[]");

      await prisma.$transaction(async (tx) => {
        for (const item of reservations) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) throw new Error("Product not found: " + item.productId);

          await tx.stockReservation.update({
            where: { id: item.id },
            data: { fulfilled: true },
          });
        }
        console.log("Order Fulfilled");
      });

      // Prepare items for nested create
      const items = cartItems.map((item: any) => ({
        productId: item.productId ?? null,
        quantity: Math.floor(item.quantity ?? 1),
        name: item.product?.name ?? "Unknown Product",
        price: Math.floor(item.product?.salePrice ?? 0),
      }));

      await inngest.send({
        name: "order/created",
        data: {
          userId,
          shippingAddressId: selectedAddressId,
          amount,
          orderDate: new Date(),
          shippingMethod: "standard",
          items,
          // values for payment object
          paymongoPaymentId: payment_id,
          paymongoCheckoutId: checkout_id,
          paymongoIntentId: payment_intent_id,
          payerName: customer_name,
          payerEmail: customer_email,
          payerPhone: customer_phone,
          method: payment_method,
          payment_date,
          tax: 123,
          shipping: 123,
          currency,
          line_items: line_items,
        },
      });

      // 5️⃣ Clear cart
      await prisma.cartItem.deleteMany({ where: { userId } });

      return NextResponse.json({ success: true });
    }

    if (eventType === "payment.failed") {
      const session = body.data.attributes.data;
      const metadata = session.attributes.metadata;
      const reservations = JSON.parse(metadata.reservations);
      await prisma.$transaction(async (tx) => {
        for (const item of reservations) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) throw new Error("Product not found: " + item.productId);

          // Atomic increment
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });

          await tx.stockReservation.update({
            where: { id: item.id },
            data: { restored: true },
          });
        }
        console.log("Failed order stock restored");
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in webhook handler:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
