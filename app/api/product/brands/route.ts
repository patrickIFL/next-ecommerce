import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  const raw = await redis.get("brands");
  const brands = raw ? JSON.parse(raw) : [];

  return NextResponse.json({
    success: true,
    data: brands,
  });
}

export async function POST() {
  const brands = [
    { id: 1, name: "Nike", slug: "nike" },
    { id: 2, name: "Apple", slug: "apple" },
    { id: 3, name: "Samsung", slug: "samsung" },
  ];

  await redis.set("brands", JSON.stringify(brands));

  return NextResponse.json({
    success: true,
    message: "Brands seeded successfully",
  });
}
