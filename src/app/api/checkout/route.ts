import prisma from '../../../lib/prisma';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, orderId, items, cartItemIds } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. สร้าง Order
      const order = await tx.order.create({
        data: {
          orderId,
          userId,
          items: { create: items }
        }
      });

      // 2. วนลูปอัปเดตสต็อกและลบตะกร้า (ทำข้างใน transaction นี้เลย)
      for (const item of items) {
        await tx.post.update({
          where: { id: item.postId },
          data: {
            quantity: { decrement: item.quantity },
            Sales: { increment: item.totalPrice }
          }
        });
      }

      // 3. ลบสินค้าออกจากตะกร้าทั้งหมด
      await tx.cart.deleteMany({
        where: { id: { in: cartItemIds } }
      });

      return order;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}