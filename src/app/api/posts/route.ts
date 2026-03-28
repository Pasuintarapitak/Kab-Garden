import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงสินค้าทั้งหมดจากฐานข้อมูล Supabase
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc' // ให้สินค้าใหม่ขึ้นก่อน
      }
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}