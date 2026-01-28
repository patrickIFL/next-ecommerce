import { FulfillmentStatus } from "@/src/generated/prisma";

// fsm.ts
export const ITEM_FSM: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  AWAITING_CONFIRMATION: [FulfillmentStatus.PREPARING],
  PREPARING: [FulfillmentStatus.READY_FOR_PICKUP],
  READY_FOR_PICKUP: [FulfillmentStatus.PICKED_UP],
  PICKED_UP: [FulfillmentStatus.IN_TRANSIT],
  IN_TRANSIT: [FulfillmentStatus.OUT_FOR_DELIVERY],
  OUT_FOR_DELIVERY: [FulfillmentStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
}

export function getNextFulfillmentStatus(
  status: FulfillmentStatus
): FulfillmentStatus | null {
  const next = ITEM_FSM[status]
  return next?.length ? next[0] : null
}

