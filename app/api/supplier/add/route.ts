import prisma from "@/app/db/prisma";
import { SupplierType } from "@/src/generated/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, externalId } = body;

    // Basic validation
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    // Validate enum value
    if (!Object.values(SupplierType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid supplier type" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        type,
        externalId: externalId || null,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("Create supplier error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
