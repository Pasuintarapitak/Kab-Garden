// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // ปรับ path ตามโปรเจคของคุณ

// [READ] ดึงรายชื่อ User ทั้งหมด
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// [DELETE] ลบ User
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// [UPDATE] แก้ไขข้อมูล User แบบครบวงจร
export async function PATCH(req: Request) {
  try {
    // รับค่าทั้งหมดที่ส่งมาจากหน้าบ้าน
    const { id, name, email, address, phone, role } = await req.json();

    // ตรวจสอบข้อมูลเบื้องต้น (เช่น อีเมลห้ามว่าง)
    if (!id || !email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // สั่ง Prisma อัปเดตข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        name, 
        email, 
        address, 
        // แปลง phone เป็น Int เพราะใน Schema กำหนดเป็น Int?
        phone: phone ? Number(phone) : null, 
        role 
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    // ดัก Error กรณีอีเมลซ้ำ (Prisma error code P2002)
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}