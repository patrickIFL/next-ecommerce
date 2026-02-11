import prisma from "@/app/db/prisma";
import authSeller from "@/lib/authSeller";
import { OrderStatus } from "@/src/generated/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const isSeller = await authSeller(userId);

  if (!isSeller) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

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
