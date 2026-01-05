/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function DELETE(request: NextRequest) {
  const slug = request.url.split("/").pop();

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "No slug provided" },
      { status: 400 }
    );
  }

  try {
    const raw = await redis.get("brands");
    const brands = raw ? JSON.parse(raw) : [];

    const filtered = brands.filter((b: any) => b.slug !== slug);

    if (filtered.length === brands.length) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    await redis.set("brands", JSON.stringify(filtered));

    return NextResponse.json({
      success: true,
      message: "Brand deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
