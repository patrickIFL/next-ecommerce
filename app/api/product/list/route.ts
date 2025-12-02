/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/app/db/prisma';
import { NextRequest, NextResponse } from "next/server";
import redis from '@/lib/redis'

export async function GET(request:NextRequest) {
  
  await redis.set('foo', 'bar');
  
  try {
    const products = await prisma.product.findMany({orderBy: {createdAt: 'desc'}});
    return NextResponse.json({ success: true, products });
    
  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}