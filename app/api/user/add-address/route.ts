/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const zipcode = formData.get("zipcode") as string;
    const area = formData.get("area") as string;
    const city = formData.get("city") as string;
    const province = formData.get("province") as string;

    const newAddress = await prisma.shippingAddress.create({
      data: {
        fullName,
        phoneNumber,
        zipcode,
        area,
        city,
        province,
        user: {
          connect: {
            id: userId, // <- REQUIRED for Prisma
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address added.",
      newAddress,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
