'use server';

import { Inngest } from 'inngest'
import {prisma} from '@/src/generated/prisma'; 

// ==========================
// Inngest client
// ==========================
const inngest = new Inngest({ id: "next-ecommerce" });

// ==========================
// USER CREATED
// ==========================
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("[User Created] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data) {
      console.warn("[User Created] No data in event, skipping...");
      return;
    }

    const email = data?.email_addresses?.[0]?.email_address;
    if (!data.id || !email) {
      console.warn("[User Created] Missing required fields:", data);
      return;
    }

    try {
      await prisma.user.create({
        data: {
          id: data.id,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email,
          image: data.image_url || null,
        },
      });
      console.log("[User Created] User created successfully:", data.id);
    } catch (err) {
      console.error("[User Created] prisma error:", err);
    }
  }
);

// ==========================
// USER UPDATED
// ==========================
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("[User Updated] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data) {
      console.warn("[User Updated] No data in event, skipping...");
      return;
    }

    const email = data?.email_addresses?.[0]?.email_address;
    if (!data.id || !email) {
      console.warn("[User Updated] Missing required fields:", data);
      return;
    }

    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email,
          image: data.image_url || null,
        },
      });
      console.log("[User Updated] User updated successfully:", data.id);
    } catch (err) {
      console.error("[User Updated] prisma error:", err);
    }
  }
);

// ==========================
// USER DELETED
// ==========================
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("[User Deleted] Incoming event:", JSON.stringify(event));

    const data = event?.data;
    if (!data?.id) {
      console.warn("[User Deleted] Missing user ID in event, skipping...");
      return;
    }

    try {
      await prisma.user.delete({
        where: { id: data.id },
      });
      console.log("[User Deleted] User deleted successfully:", data.id);
    } catch (err) {
      console.error("[User Deleted] prisma error:", err);
    }
  }
);

module.exports = {
  inngest,
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
};
