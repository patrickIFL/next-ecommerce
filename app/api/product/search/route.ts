// import { NextResponse } from "next/server";
// import prisma from "@/app/db/prisma";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const q = searchParams.get("q") || "";

//   if (!q) {
//     return NextResponse.json({ data: [], success: true });
//   }

//   const products = await prisma.product.findMany({
//     where: {
//       OR: [
//         {
//           name: {
//             contains: q,
//             mode: "insensitive",
//           },
//         },
//         {
//           category: {
//             name: {
//               contains: q,
//               mode: "insensitive",
//             },
//           },
//         },
//         {
//           category: {
//             slug: {
//               contains: q,
//               mode: "insensitive",
//             },
//           },
//         },
//       ],
//     },
//     include: {
//       category: true,
//     },
//   });

//   return NextResponse.json({ success: true, data: products });
// }
