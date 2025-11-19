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
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    // Prisma CREATE
    await prisma.user.create({
      data: userData,
    });
  }
);


//
// USER UPDATED
//
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    // Prisma UPDATE
    await prisma.user.update({
      where: { id },
      data: userData,
    });
  }
);


//
// USER DELETED
//
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    // Prisma DELETE
    await prisma.user.delete({
      where: { id },
    });
  }
);
