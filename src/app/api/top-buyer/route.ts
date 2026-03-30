import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const topBuyer = await prisma.user.findFirst({
      orderBy: {
        purchaseamount: 'desc' 
      },
      select: {
        name: true,
        email: true,
        purchaseamount: true
      }
    });

    
    if (!topBuyer) {
      return new Response(JSON.stringify({ 
        name: "ยังไม่มีลูกค้า", 
        purchaseamount: 0 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

   
    const responseData = {
      name: topBuyer.name || topBuyer.email,
      purchaseamount: topBuyer.purchaseamount || 0
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error fetching top buyer:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch top buyer' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}