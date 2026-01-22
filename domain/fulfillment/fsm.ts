// src/domain/fulfillment/fsm.ts

import { FulfillmentStatus } from "@/src/generated/prisma";

export const ITEM_FSM: Record<
  FulfillmentStatus,
  readonly FulfillmentStatus[]
> = {
  AWAITING_CONFIRMATION: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP"],
  READY_FOR_PICKUP: ["PICKED_UP"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
} as const
