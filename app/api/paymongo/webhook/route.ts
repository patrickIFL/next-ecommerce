// /* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from "crypto";
import prisma from "@/app/db/prisma";
import { inngest } from "@/src/config/inngest";
import { NextRequest, NextResponse } from "next/server";

function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
) {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const signaturePart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.split("=")[1];
  const signature = signaturePart.split("=")[1];

  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  // ✅ DEBUG LOGS HERE
  console.log("signatureHeader:", signatureHeader);
  console.log("rawBody:", rawBody);
  console.log("signedPayload:", signedPayload);
  console.log("expectedSignature:", expectedSignature);
  console.log("receivedSignature:", signature);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expBuf);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // IMPORTANT: must be raw text
    const signatureHeader = req.headers.get("paymongo-signature");

    if (!signatureHeader) {
      return new NextResponse("Missing signature header", { status: 400 });
    }

    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET!;
    if (!webhookSecret) {
      throw new Error("Missing PAYMONGO_WEBHOOK_SECRET env var");
    }

    const isValid = verifyPayMongoSignature(
      rawBody,
      signatureHeader,
      webhookSecret,
    );

    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // If signature is valid, now parse JSON
    const body = JSON.parse(rawBody);

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
