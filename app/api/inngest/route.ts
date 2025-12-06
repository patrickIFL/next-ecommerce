import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserUpdation, syncUserDeletion, createUserOrder, createPaymentRecord } from "@/src/config/inngest";

export const { POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder,
    createPaymentRecord
  ],
});
