/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function DELETE(request: NextRequest) {
  // 2. Extract cart item ID from URL
    const slug = request.url.split("/").pop();
    if (!slug) {
      return Response.json(
        { success: false, message: "No slug provided" },
        { status: 400 }
      );
    } 
  try {
    const raw = await redis.get("categories");
    const categories = raw ? JSON.parse(raw) : [];

    const filtered = categories.filter((c: any) => c.slug !== slug);

    if (filtered.length === categories.length) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    await redis.set("categories", JSON.stringify(filtered));

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
