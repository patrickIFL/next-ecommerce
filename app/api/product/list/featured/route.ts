/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/app/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
        isFeatured: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6, // 👈 strongly recommended for home/featured
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
