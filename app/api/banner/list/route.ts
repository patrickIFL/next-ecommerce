import { NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import redis from "@/lib/redis";

const CACHE_KEY = "banner:list:active";
const CACHE_TTL = 60 * 5; // 5 minutes

export async function GET() {
  try {
    // 1. Try Redis
    const cached = await redis.get(CACHE_KEY);

    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // 2. Fetch from DB
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    const response = banners.map((b) => ({
      id: b.id,
      type: b.imageFormat === "PNG" ? "png" : "jpg",
      title: b.title,
      offer: b.offer,
      buttonText1: b.buttonText1,
      buttonText2: b.buttonText2,
      imgSrc: b.imgSrc,
      desktopImg: b.desktopImg,
      tabletImg: b.tabletImg,
      mobileImg: b.mobileImg,
    }));

    // 3. Save to Redis
    await redis.set(
      CACHE_KEY,
      JSON.stringify(response),
      "EX",
      CACHE_TTL
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Banner list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
