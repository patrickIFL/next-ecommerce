import prisma from "@/app/db/prisma"
import { assertTransition } from "@/domain/fulfillment/transition"


async function markReadyForPickup(orderItemId: string) {
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
  })

  if (!item) throw new Error("Order item not found")

  assertTransition(item.fulfillmentStatus, "READY_FOR_PICKUP")

  return prisma.orderItem.update({
    where: { id: orderItemId },
    data: {
      fulfillmentStatus: "READY_FOR_PICKUP",
    },
  })
}

export async function POST(req: Request) {
  const { orderItemId } = await req.json()

  await markReadyForPickup(orderItemId)

  return Response.json({ success: true })
}

