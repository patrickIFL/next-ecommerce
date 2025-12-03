/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: "Name and slug are required" }, { status: 400 });
    }

    // Get current categories
    const raw = await redis.get("categories");
    const categories = raw ? JSON.parse(raw) : [];

    // Check for duplicates
    if (categories.find((c: any) => c.slug === slug)) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
    }

    // Add new category with a new id
    const newCategory = {
      id: categories.length ? Math.max(...categories.map((c: any) => c.id)) + 1 : 1,
      name,
      slug
    };
    categories.push(newCategory);

    await redis.set("categories", JSON.stringify(categories));

    return NextResponse.json({ success: true, data: newCategory, message: "Category added" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
