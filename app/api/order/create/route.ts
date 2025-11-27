/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/app/db/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const { address } = await req.json();
  // token check
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  // req payloads // coming soon - coupon code 
  if(!address) {
    return NextResponse.json(
      { success: false, message: "Invalid Data" },
      { status: 400 }
    );
  }

  try {
    // get the productId then find the product in the DB, then get the price
  const cartItems = await prisma.cartItem.findMany({ where: { userId } });
  console.log(cartItems);
  return NextResponse.json(cartItems);
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  
}

// await inngest.send({
//     name: 'order/created',
//     data: {
//         userId,
//         address,
//         items,
//         amount,
//         date: Date.now()
//     }
// })

// clear user cart
// delete all cartItems with userId this user

// respond with success and message