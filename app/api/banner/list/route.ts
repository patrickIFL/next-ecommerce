// GET /api/banner/list
import { NextResponse } from "next/server";
import prisma from "@/app/db/prisma";

export async function GET() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json(
    banners.map((b) => ({
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
    }))
  );
}
