import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// GET method for fetching orders (อัปเกรดแล้ว 🚀)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        
        user: {
          select: {
            name: true,
            email: true,
            address: true,
            phone: true,
          }
        },
        items: {
          include: {
            post: {
              select: {
                title: true,
                price: true, 
                img: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse('Failed to fetch orders', { status: 500 });
  }
}

// POST method for creating a new order (คงของเดิมไว้ 100% ป้องกันระบบพัง 🛡️)
export async function POST(request: Request) {
  try {
    const { userId, orderId, items } = await request.json();

    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        orderId: orderId,
        items: {
          create: items.map((item: any) => ({
            postId: item.postId,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new NextResponse('Failed to create order', { status: 500 });
  }
}