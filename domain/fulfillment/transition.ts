// src/domain/fulfillment/transitions.ts
import { FulfillmentStatus } from "@/src/generated/prisma"
import { ITEM_FSM } from "./fsm"

export function canTransition(
  from: FulfillmentStatus,
  to: FulfillmentStatus
): boolean {
  return ITEM_FSM[from]?.includes(to) ?? false
}

export function assertTransition(
  from: FulfillmentStatus,
  to: FulfillmentStatus
) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid transition: ${from} → ${to}`)
  }
}