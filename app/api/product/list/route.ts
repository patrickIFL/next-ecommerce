/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/app/db/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  try {
    const products = await prisma.product.findMany({});
    return NextResponse.json({ success: true, products });
    
  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}