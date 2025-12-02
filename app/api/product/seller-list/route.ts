/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/app/db/prisma';
import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request:any) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) { 
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({orderBy: {createdAt: 'desc'}});

    return NextResponse.json({ success: true, products });
    
  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    
  }
}