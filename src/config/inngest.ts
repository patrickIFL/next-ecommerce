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

export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: { maxSize: 5, timeout: "5s" },
  },
  { event: "order/created" },
  async ({ events }) => {
    for (const event of events) {
      const data: OrderCreatedEventData = event.data;

      const order = await prisma.order.create({
        data: {
          userId: data.userId,
          shippingAddressId: data.shippingAddressId,
          amount: Math.floor(data.amount),
          orderDate: data.orderDate,
          shippingMethod: data.shippingMethod,
          items: {
            create: data.items
          },
        },
      });

      await prisma.payment.create({
        data: {
          userId: data.userId,
          orderId: order.id, // <-- linking payment to order
          paymongo_payment_id: data.paymongoPaymentId,
          paymongo_checkout_id: data.paymongoCheckoutId,
          paymongo_payment_intent_id: data.paymongoIntentId,
          amount: data.amount,
          tax: data.tax,
          shipping: data.shipping,
          payer_name: data.payerName ?? "",
          payer_email: data.payerEmail ?? "",
          payer_phone: data.payerPhone ?? "",
          method: data.method,
          currency: data.currency,
          line_items: data.line_items,
        },
      });
    }
  }
);
