// src/domain/fulfillment/ui.ts
import { FulfillmentStatus } from "@/src/generated/prisma"

export const STATUS_LABEL: Record<FulfillmentStatus, string> = {
  AWAITING_CONFIRMATION: "Pending",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
}
