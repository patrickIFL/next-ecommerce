/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    const raw = await redis.get("brands");
    const brands = raw ? JSON.parse(raw) : [];

    // Prevent duplicates
    if (brands.find((b: any) => b.slug === slug)) {
      return NextResponse.json(
        { success: false, message: "Brand already exists" },
        { status: 400 }
      );
    }

    const newBrand = {
      id: brands.length
        ? Math.max(...brands.map((b: any) => b.id)) + 1
        : 1,
      name,
      slug,
    };

    brands.push(newBrand);

    await redis.set("brands", JSON.stringify(brands));

    return NextResponse.json({
      success: true,
      data: newBrand,
      message: "Brand added",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
