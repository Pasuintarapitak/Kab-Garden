import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงสินค้าทั้งหมดจากฐานข้อมูล พร้อมหมวดหมู่
    const posts = await prisma.post.findMany({
      include: {
        category: true 
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}