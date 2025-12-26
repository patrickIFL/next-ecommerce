/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inngest } from "inngest";
import prisma from "@/app/db/prisma";

// Types
interface ClerkUserEvent {
  id: string;
  first_name?: string;
  last_name?: string;
  email_addresses: { email_address: string }[];
  image_url?: string | null;
}

interface OrderCreatedEventData {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
  }[];
  amount: number;
  shippingAddressId: string;
  orderDate: Date;
  shippingMethod: string;
  orderId: string;
  paymongoPaymentId: string;
  paymongoCheckoutId: string;
  paymongoIntentId: string;
  tax: number;
  shipping: number;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  method: string;
  payment_date: string;
  currency: string;
  line_items: string;
}

// Inngest client
export const inngest = new Inngest({ id: "next-ecommerce" });

// USER CREATED
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("[User Created] Incoming event:", JSON.stringify(event));

    const data = event.data as ClerkUserEvent | undefined;
    if (!data) {
      console.warn("[User Created] No data in event, skipping...");
      return;
    }

    if (!data.id || !data.email_addresses?.[0]?.email_address) {
      console.warn("[User Created] Missing required fields:", data);
      return;
    }

    try {
      await prisma.user.create({
        data: {
          id: data.id,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: data.email_addresses[0].email_address,
          image: data.image_url ?? null,
        },
      });
      console.log("[User Created] User created successfully:", data.id);
    } catch (err) {
      console.error("[User Created] Prisma error:", err);
    }
  }
);

// USER UPDATED
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("[User Updated] Incoming event:", JSON.stringify(event));

    const data = event.data as ClerkUserEvent | undefined;
    if (!data) {
      console.warn("[User Updated] No data in event, skipping...");
      return;
    }

    if (!data.id || !data.email_addresses?.[0]?.email_address) {
      console.warn("[User Updated] Missing required fields:", data);
      return;
    }

    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: data.email_addresses[0].email_address,
          image: data.image_url ?? null,
        },
      });
      console.log("[User Updated] User updated successfully:", data.id);
    } catch (err) {
      console.error("[User Updated] Prisma error:", err);
    }
  }
);

// USER DELETED
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("[User Deleted] Incoming event:", JSON.stringify(event));

    const data = event.data as { id: string } | undefined;
    if (!data || !data.id) {
      console.warn("[User Deleted] Missing user ID in event, skipping...");
      return;
    }

    try {
      await prisma.user.delete({
        where: { id: data.id },
      });
      console.log("[User Deleted] User deleted successfully:", data.id);
    } catch (err) {
      console.error("[User Deleted] Prisma error:", err);
    }
  }
);

// USER IS ON CLERK BUT NOT ON DB (DELETED)
export const syncUserOnLogin = inngest.createFunction(
  {
    id: "sync-user-on-login",
  },
  {
    event: "clerk/session.created", // triggers when a user logs in
  },
  async ({ event }) => {
    console.log("[Login] Incoming session event:", JSON.stringify(event));
    const user = event.data?.user as ClerkUserEvent | undefined;
    if (!user || !user.id || !user.email_addresses?.[0]?.email_address) {
      console.warn("[Login] Missing user info in session event, skipping...");
      return;
    }
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (existingUser) {
        console.log("[Login] User already exists, no action needed:", user.id);
        return;
      }
      // If not found, create user
      await prisma.user.create({
        data: {
          id: user.id,
          name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          email: user.email_addresses[0].email_address,
          image: user.image_url ?? null,
        },
      });
      console.log("[Login] User created successfully on login:", user.id);
    } catch (err) {
      console.error("[Login] Prisma error:", err);
    }
  }
);

export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: { maxSize: 5, timeout: "5s" },
  },
  { event: "order/created" },
  async ({ events }) => {
    for (const event of events) {
      const data = event.data;

      /* ================= CREATE ORDER ================= */
      const order = await prisma.order.create({
        data: {
          userId: data.userId,
          shippingAddressId: data.shippingAddressId,
          amount: Math.floor(data.amount),
          orderDate: data.orderDate,
          shippingMethod: data.shippingMethod,

          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId ?? null, // ✅ VARIANT SAFE
              quantity: item.quantity,
              name: item.name,
              price: item.price,
            })),
          },
        },
      });

      /* ================= CREATE PAYMENT ================= */
      await prisma.payment.create({
        data: {
          userId: data.userId,
          orderId: order.id,

          paymongo_payment_id: data.paymongoPaymentId,
          paymongo_checkout_id: data.paymongoCheckoutId,
          paymongo_payment_intent_id: data.paymongoIntentId,

          amount: Math.floor(data.amount),
          tax: Math.floor(data.tax ?? 0),
          shipping: Math.floor(data.shipping ?? 0),

          payer_name: data.payerName ?? "",
          payer_email: data.payerEmail ?? "",
          payer_phone: data.payerPhone ?? "",

          method: data.method,
          currency: data.currency,

          line_items:
            typeof data.line_items === "string"
              ? JSON.parse(data.line_items)
              : Array.isArray(data.line_items)
              ? data.line_items
              : [],
        },
      });
    }
  }
);

export const restoreExpiredReservations = inngest.createFunction(
  {
    id: "restore-expired-stock-reservations",
  },
  {
    cron: "*/1 * * * *", // every 5 minutes
  },
  async () => {
    console.log("[Stock Cron] Running expired reservation cleanup...");

    const now = new Date();
    const batchSize = 50;

    while (true) {
      const expiredBatch = await prisma.stockReservation.findMany({
        where: {
          expiresAt: { lt: now },
          fulfilled: false,
          restored: false,
        },
        take: batchSize,
      });

      if (!expiredBatch.length) {
        console.log("[Stock Cron] No more expired reservations to process.");
        break;
      }

      // Split reservations by target
      const productRestoreMap: Record<string, number> = {};
      const variantRestoreMap: Record<string, number> = {};

      for (const r of expiredBatch) {
        if (r.variantId) {
          variantRestoreMap[r.variantId] =
            (variantRestoreMap[r.variantId] ?? 0) + r.quantity;
        } else {
          productRestoreMap[r.productId] =
            (productRestoreMap[r.productId] ?? 0) + r.quantity;
        }
      }

      await prisma.$transaction(async (tx) => {
        // 🔁 Restore SIMPLE product stock
        for (const [productId, qty] of Object.entries(productRestoreMap)) {
          await tx.product.update({
            where: { id: productId },
            data: { stock: { increment: qty } },
          });
        }

        // 🔁 Restore VARIANT stock
        for (const [variantId, qty] of Object.entries(variantRestoreMap)) {
          await tx.productVariant.update({
            where: { id: variantId },
            data: { stock: { increment: qty } },
          });
        }

        // ✅ Mark reservations as restored
        await tx.stockReservation.updateMany({
          where: {
            id: { in: expiredBatch.map((r) => r.id) },
          },
          data: { restored: true },
        });
      });

      console.log(
        `[Stock Cron] Restored ${expiredBatch.length} expired reservations.`
      );
    }

    // 🧹 ARCHIVE SIMPLE PRODUCTS
    await prisma.product.updateMany({
      where: {
        type: "SIMPLE",
        stock: 0,
        isArchived: false,
      },
      data: { isArchived: true },
    });

    // 🧹 ARCHIVE VARIATION PRODUCTS (ALL variants OOS)
    await prisma.product.updateMany({
      where: {
        type: "VARIATION",
        isArchived: false,
        variants: {
          none: {
            stock: { gt: 0 },
          },
        },
      },
      data: { isArchived: true },
    });

    console.log("[Stock Cron] Finished expired reservation & OOS cleanup.");
  }
);

