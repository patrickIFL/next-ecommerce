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
  const signaturePart = parts.find((p) => p.startsWith("li=")); // ✅ FIX

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.split("=")[1];
  const signature = signaturePart.split("=")[1];

  if (!timestamp || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const signedPayload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expectedSignature, "hex");

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
    // console.log("❌❌ Webhook secret", webhookSecret);
    // console.log("❌❌ Raw body", rawBody);
    // console.log("❌❌ Signature header", signatureHeader);
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

      if (!payment?.attributes) {
        return new NextResponse(
          "Invalid webhook payload: missing payment attributes",
          { status: 400 },
        );
      }

      const billing = payment?.attributes?.billing ?? null;
      const source = payment?.attributes?.source ?? null;

      // Optional: fallback to metadata if you stored payer info there
      const payerName =
        billing?.name ?? payment?.attributes?.metadata?.payerName ?? "Unknown";
      const payerEmail =
        billing?.email ?? payment?.attributes?.metadata?.payerEmail ?? null;
      const payerPhone =
        billing?.phone ?? payment?.attributes?.metadata?.payerPhone ?? null;

      const method =
        source?.type ??
        payment?.attributes?.payment_method_used ?? // if present in your payload
        "unknown";

      await inngest.send({
        name: "order/created",
        data: {
          userId,
          shippingAddressId,
          amount,
          orderDate: new Date(),
          shippingMethod: "standard",
          items,

          paymongoPaymentId: payment.id,
          paymongoIntentId: payment.attributes.payment_intent_id,

          payerName,
          payerEmail,
          payerPhone,

          method,
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
