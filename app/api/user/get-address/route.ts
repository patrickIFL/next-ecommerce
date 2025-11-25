import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.shippingAddress.findMany({
      where: { userId },
    });

    if (addresses.length === 0) {
      return NextResponse.json({
        success: true,
        message: "User has no saved address",
        addresses: addresses ?? [],
      });
    }

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
