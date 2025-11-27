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

    const address = await request.json();

    const { fullName, phoneNumber, zipcode, area, city, province } = address;

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
            id: userId,
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
