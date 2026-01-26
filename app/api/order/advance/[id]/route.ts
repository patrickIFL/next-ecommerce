import prisma from "@/app/db/prisma";
import { OrderStatus } from "@/src/generated/prisma";
import { NextResponse } from "next/server";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  AWAITING_CONFIRMATION: OrderStatus.CONFIRMED,
  CONFIRMED: OrderStatus.SOURCING,
  SOURCING: OrderStatus.IN_PROGRESS,
  IN_PROGRESS: OrderStatus.COMPLETED,
  COMPLETED: null,
  CANCELLED: null,
  REFUNDED: null,
};

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ REQUIRED

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const next = NEXT_STATUS[order.status];
  if (!next) {
    return NextResponse.json(
      { error: "Order cannot be advanced" },
      { status: 400 }
    );
  }

  await prisma.order.update({
    where: { id },
    data: { status: next },
  });

  return NextResponse.json({ success: true });
}
