import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  const raw = await redis.get("categories");
  const categories = raw ? JSON.parse(raw) : [];

  return NextResponse.json({
    success: true,
    data: categories
  });
}

export async function POST() {
  const categories = [
    { id: 1, name: "Shoes", slug: "shoes" },
    { id: 2, name: "Phones", slug: "phones" },
    { id: 3, name: "Clothes", slug: "clothes" },
  ];

  await redis.set("categories", JSON.stringify(categories));

  return NextResponse.json({
    success: true,
    message: "Categories seeded successfully",
  });
}

