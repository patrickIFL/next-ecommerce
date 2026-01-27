import { FulfillmentStatus } from "@/src/generated/prisma";

export const FULFILLMENT_STATUS_LABELS: Record<
  FulfillmentStatus,
  string
> = {
  AWAITING_CONFIRMATION: "Awaiting Confirmation",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};
