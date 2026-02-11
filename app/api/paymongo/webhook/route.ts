// /* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.data?.attributes?.type;

    console.log("🔔 PayMongo Event:", eventType);

    if (eventType === "payment.paid") {
      const payment = body.data.attributes.data; // <-- this is the payment resource
      const metadata = payment.attributes.metadata;

      if (!metadata) {
        throw new Error("Webhook metadata missing");
      }

      const userId = metadata.userId;
      const shippingAddressId = metadata.selectedAddressId;

      const reservations = JSON.parse(metadata.reservations).list;

      const reservedItems = await prisma.stockReservation.findMany({
        where: { id: { in: reservations } },
        include: {
          product: true,
          variant: true,
        },
      });

      const amount = payment.attributes.amount;
      const currency = payment.attributes.currency;

      // reservation fulfillment
      await prisma.$transaction(
        reservations.map((id: string) =>
          prisma.stockReservation.update({
            where: { id },
            data: { fulfilled: true },
          }),
        ),
      );

      const items = reservedItems.map((r) => ({
        productId: r.productId,
        variantId: r.variantId,
        quantity: r.quantity,
        name: r.variant?.name ?? r.product.name,
        price:
          r.variant?.salePrice ??
          r.variant?.price ??
          r.product.salePrice ??
          r.product.price,
      }));

      const payer = payment.attributes.billing;

      await inngest.send({
        name: "order/created",
        data: {
          userId,
          shippingAddressId,
          amount,
          orderDate: new Date(),
          shippingMethod: "standard",
          items,

          // payment metadata
          paymongoPaymentId: payment.id,
          paymongoIntentId: payment.attributes.payment_intent_id,
          payerName: payer.name,
          payerEmail: payer.email,
          payerPhone: payer.phone,
          method: payment.attributes.source.type,
          payment_date: payment.attributes.paid_at,
          currency,

          tax: 0,
          shipping: 0,
          line_items: metadata.cartItems ? JSON.parse(metadata.cartItems) : [],
        },
      });

      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return NextResponse.json({ success: true });
    }

    /* ================= PAYMENT FAILED ================= */
    if (eventType === "payment.failed") {
      const session = body.data.attributes.data;
      const reservations = JSON.parse(
        session.attributes.metadata.reservations,
      ).list;

      await prisma.$transaction(
        reservations.map((id: string) =>
          prisma.stockReservation.update({
            where: { id },
            data: { restored: true },
          }),
        ),
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
