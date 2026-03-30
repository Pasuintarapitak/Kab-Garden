// src/app/api/order/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderId: params.id },
      include: {
        items: {
          include: {
            post: true // Include the related post details
          }
        }
      }
    });

    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    const formattedOrder = {
      orderId: order.orderId,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => ({
        postId: item.postId,
        title: item.post.title, // Add post title
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }))
    };

    return new Response(JSON.stringify(formattedOrder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET Error:', error);
    return new Response('An error occurred while fetching the order.', {
      status: 500,
    });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return new NextResponse('Failed to update order', { status: 500 });
  }
}