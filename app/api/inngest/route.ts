import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserUpdation, syncUserDeletion, createUserOrder, restoreExpiredReservations, syncUserOnLogin } from "@/src/config/inngest";

export const { POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder,
    restoreExpiredReservations,
    syncUserOnLogin
  ],
});
