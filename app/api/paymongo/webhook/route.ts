// /* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.data?.attributes?.type;

    console.log("🔔 PayMongo Event:", eventType);

    if (eventType === "checkout_session.payment.paid") {
      const session = body.data.attributes.data;
      const payment = session.attributes.payments[0];
      const metadata = session.attributes.metadata;

      /* ================= PAYMENT INFO ================= */
      const checkoutId = session.id;
      const paymentId = payment.id;
      const paymentIntentId = session.attributes.payment_intent.id;

      const payer = payment.attributes.billing;

      /* ================= METADATA ================= */
      const userId = metadata.userId;
      const shippingAddressId = metadata.selectedAddressId;

      // const cartItems = JSON.parse(metadata.cartItems);
      const reservations = JSON.parse(metadata.reservations);

      const reservedItems = await prisma.stockReservation.findMany({
        where: { id: { in: reservations } },
        include: {
          product: true,
          variant: true,
        },
      });

      const amount = payment.attributes.amount;
      const currency = payment.attributes.currency;

      /* ================= RESERVATIONS ================= */
      await prisma.$transaction(
        reservations.map((id: string) =>
          prisma.stockReservation.update({
            where: { id },
            data: { fulfilled: true },
          })
        )
      );

      /* ================= ORDER ITEMS ================= */
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

      /* ================= EMIT ORDER EVENT ================= */
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
          paymongoPaymentId: paymentId,
          paymongoCheckoutId: checkoutId,
          paymongoIntentId: paymentIntentId,
          payerName: payer.name,
          payerEmail: payer.email,
          payerPhone: payer.phone,
          method: payment.attributes.source.type,
          payment_date: payment.attributes.paid_at,
          currency,

          // optional accounting
          tax: 0,
          shipping: 0,
          line_items: metadata.lineItems ? JSON.parse(metadata.lineItems) : [],
        },
      });

      /* ================= CLEAR CART ================= */
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return NextResponse.json({ success: true });
    }

    /* ================= PAYMENT FAILED ================= */
    if (eventType === "payment.failed") {
      const session = body.data.attributes.data;
      const reservations = JSON.parse(
        session.attributes.metadata.reservations
      ).list;

      await prisma.$transaction(
        reservations.map((id: string) =>
          prisma.stockReservation.update({
            where: { id },
            data: { restored: true },
          })
        )
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
