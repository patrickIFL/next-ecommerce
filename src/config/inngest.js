import { Inngest } from "inngest";
import { prisma } from "@/src/generated/prisma";

// -------------------------
// Inngest client
// -------------------------
export const inngest = new Inngest({ id: "next-ecommerce" });

// -------------------------
// USER CREATED
// -------------------------
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("[User Created] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data?.id || !data?.email_addresses?.[0]?.email_address) {
      console.warn("[User Created] Missing required fields");
      return;
    }

    try {
      await prisma.user.create({
        data: {
          id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0].email_address,
          image: data.image_url || null,
        },
      });
      console.log("[User Created] User created successfully:", data.id);
    } catch (err) {
      console.error("[User Created] Prisma error:", err);
    }
  }
);

// -------------------------
// USER UPDATED
// -------------------------
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("[User Updated] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data?.id || !data?.email_addresses?.[0]?.email_address) {
      console.warn("[User Updated] Missing required fields");
      return;
    }

    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0].email_address,
          image: data.image_url || null,
        },
      });
      console.log("[User Updated] User updated successfully:", data.id);
    } catch (err) {
      console.error("[User Updated] Prisma error:", err);
    }
  }
);

// -------------------------
// USER DELETED
// -------------------------
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("[User Deleted] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data?.id) {
      console.warn("[User Deleted] Missing user ID");
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
