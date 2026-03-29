import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

// --- 🔍 GET: ดึงข้อมูลสมาชิกทั้งหมด ---
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// --- 🛠️ PATCH: อัปเดตข้อมูลสมาชิก ---
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, phone, address, role, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updateData: any = {
      name,
      email,
      phone: phone ? String(phone) : undefined,
      address,
      role,
    };

    // 🔐 ถ้ามีการกรอกรหัสใหม่มา ให้ Hash
    if (newPassword && newPassword.trim() !== "") {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- 🗑️ DELETE: ลบสมาชิก ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}