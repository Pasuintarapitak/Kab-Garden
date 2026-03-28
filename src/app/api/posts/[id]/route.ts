// import { PrismaClient } from "@prisma/client";
import prisma from '../../../../lib/prisma';
import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // 1. แปลง ID จาก String เป็น Number
    const postId = Number(params.id);

    // 2. ดึงข้อมูลรายชิ้น โดยใช้ findUnique
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true, // ดึงข้อมูลหมวดหมู่มาด้วย
      },
    });

    if (!post) {
      return NextResponse.json({ error: "ไม่พบสินค้านี้" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching detail:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = Number(params.id);
    const body = await req.json();
    
    // ดึงค่าจาก body ออกมา
    const { title, content, price, img, quantity, categoryId } = body;

    // อัปเดตข้อมูลด้วย Prisma โดยใช้ Singleton (prisma)
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId: Number(categoryId), // มั่นใจว่าเป็น Number เพื่อให้ตรงกับ Schema
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Update Error:", error);
    // ส่ง Error กลับไปเพื่อให้ Frontend (Axios) จับได้
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}




export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = Number(params.id);
    
    // ลบสินค้า
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    // console.error("Delete Error:", error);
    return NextResponse.json({ error: "Cannot delete product" }, { status: 500 });
  }
}