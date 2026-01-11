import prisma from "@/app/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}
