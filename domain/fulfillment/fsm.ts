import { FulfillmentStatus } from "@/src/generated/prisma";

export const NEXT_FULFILLMENT_STATUS: Record<
  FulfillmentStatus,
  FulfillmentStatus | null
> = {
  AWAITING_CONFIRMATION: FulfillmentStatus.PREPARING,
  PREPARING: FulfillmentStatus.READY_FOR_PICKUP,
  READY_FOR_PICKUP: FulfillmentStatus.PICKED_UP,
  PICKED_UP: FulfillmentStatus.IN_TRANSIT,
  IN_TRANSIT: FulfillmentStatus.OUT_FOR_DELIVERY,
  OUT_FOR_DELIVERY: FulfillmentStatus.DELIVERED,
  DELIVERED: null,
  CANCELLED: null,
  RETURNED: null,
};
