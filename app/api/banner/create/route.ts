import { NextResponse } from "next/server";
import prisma from "@/app/db/prisma";
import { v2 as cloudinary } from "cloudinary";

/**
 * Expected FormData:
 *
 * type: CONTENT | RESPONSIVE_IMAGE
 * imageFormat: PNG | JPG | WEBP
 * title?
 * offer?
 * buttonText1?
 * buttonText2?
 * sortOrder?
 * images[]  (1 for CONTENT, 3 for RESPONSIVE_IMAGE)
 */

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const type = formData.get("type") as string;
    const imageFormat = formData.get("imageFormat") as string;

    if (!type || !imageFormat) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const title = formData.get("title") as string | null;
    const offer = formData.get("offer") as string | null;
    const buttonText1 = formData.get("buttonText1") as string | null;
    const buttonText2 = formData.get("buttonText2") as string | null;
    const sortOrder = Number(formData.get("sortOrder") ?? 0);

    const images = formData.getAll("images") as File[];

    // ---- VALIDATION ----
    if (type === "CONTENT" && images.length !== 1) {
      return NextResponse.json(
        { error: "Content banner requires exactly 1 image" },
        { status: 400 }
      );
    }

    if (type === "RESPONSIVE_IMAGE" && images.length < 1) {
      return NextResponse.json(
        { error: "Responsive banner requires images" },
        { status: 400 }
      );
    }

    // ---- CLOUDINARY UPLOAD ----
    const uploadToCloudinary = async (file: File) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "banners",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        ).end(buffer);
      });
    };

    let imgSrc: string | null = null;
    let desktopImg: string | null = null;
    let tabletImg: string | null = null;
    let mobileImg: string | null = null;

    if (type === "CONTENT") {
      imgSrc = await uploadToCloudinary(images[0]);
    }

    if (type === "RESPONSIVE_IMAGE") {
      if (images[0]) desktopImg = await uploadToCloudinary(images[0]);
      if (images[1]) tabletImg = await uploadToCloudinary(images[1]);
      if (images[2]) mobileImg = await uploadToCloudinary(images[2]);
    }

    // ---- OPTIONAL: AUTO-SHIFT SORT ORDER ----
    await prisma.banner.updateMany({
      where: { sortOrder: { gte: sortOrder } },
      data: { sortOrder: { increment: 1 } },
    });

    // ---- CREATE BANNER ----
    const banner = await prisma.banner.create({
      data: {
        type,
        imageFormat,
        title,
        offer,
        buttonText1,
        buttonText2,
        imgSrc,
        desktopImg,
        tabletImg,
        mobileImg,
        sortOrder,
      },
    });

    return NextResponse.json({
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("Create banner error:", error);

    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
