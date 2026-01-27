import prisma from "@/app/db/prisma";
import { NEXT_FULFILLMENT_STATUS } from "@/domain/fulfillment/fsm";
import { FulfillmentStatus, OrderStatus } from "@/src/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const orderItem = await prisma.orderItem.findUnique({
    where: { id },
    select: {
      fulfillmentStatus: true,
      orderId: true,
    },
  });

  if (!orderItem) {
    return NextResponse.json(
      { error: "Order item not found" },
      { status: 404 }
    );
  }

  const next = NEXT_FULFILLMENT_STATUS[orderItem.fulfillmentStatus];

  if (!next) {
    return NextResponse.json(
      { error: "Fulfillment cannot be advanced" },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    // 1️⃣ Update item status
    await tx.orderItem.update({
      where: { id },
      data: { fulfillmentStatus: next },
    });

    // 2️⃣ Write status history
    await tx.orderItemStatusHistory.create({
      data: {
        orderItemId: id,
        fromStatus: orderItem.fulfillmentStatus,
        toStatus: next,
        actor: "SYSTEM", // or SELLER / COURIER / ADMIN
      },
    });

    // 3️⃣ Auto-complete order if all items delivered
    if (next === FulfillmentStatus.DELIVERED) {
      const remaining = await tx.orderItem.count({
        where: {
          orderId: orderItem.orderId,
          fulfillmentStatus: { not: FulfillmentStatus.DELIVERED },
        },
      });

      if (remaining === 0) {
        await tx.order.update({
          where: { id: orderItem.orderId },
          data: { status: OrderStatus.COMPLETED },
        });
      }
    }
  });

  return NextResponse.json({
    success: true,
    previous: orderItem.fulfillmentStatus,
    current: next,
  });
}
