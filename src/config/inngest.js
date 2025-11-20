import { Inngest } from "inngest";
import { prisma } from "@/src/generated/prisma";

export const inngest = new Inngest({ id: "next-ecommerce" });

//
// USER CREATED
//
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    if (!event.data) {
      console.warn("No data in event:", event);
      return;
    }

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    if (!id || !email_addresses?.[0]?.email_address) {
      console.warn("Incomplete user data:", event.data);
      return;
    }

    const userData = {
      id,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses[0].email_address,
      image: image_url ?? null,
    };

    try {
      await prisma.user.create({ data: userData });
    } catch (err) {
      console.error("Error creating user:", err);
    }
  }
);

//
// USER UPDATED
//
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    if (!event.data) {
      console.warn("No data in event:", event);
      return;
    }

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    if (!id || !email_addresses?.[0]?.email_address) {
      console.warn("Incomplete user data:", event.data);
      return;
    }

    const userData = {
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses[0].email_address,
      image: image_url ?? null,
    };

    try {
      await prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }
);

//
// USER DELETED
//
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    if (!event.data || !event.data.id) {
      console.warn("No id in event:", event);
      return;
    }

    const { id } = event.data;

    try {
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
);
