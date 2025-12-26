/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/app/db/prisma';
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { orderDate: "desc" },
    include: {
        shippingAddress: true,
        user: true,
        payment: true,
        items: {
            include: {
                product: true,
                variant: true
            }
        }
    }
  });
  return NextResponse.json({ success: true, orders }); 

  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  }

