/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const take = 10;
    const skip = (page - 1) * take;

    const total = await prisma.wishlist.count({
      where: { userId },
    });

    const records = await prisma.wishlist.findMany({
      where: {
        userId,
        product: {
          isArchived: false,
        },
      },
      include: {
        product: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const products = records.map((r) => r.product);

    const totalPages = Math.ceil(total / take);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
