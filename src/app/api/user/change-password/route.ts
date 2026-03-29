import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; 
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    // verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "รหัสผ่านเดิมไม่ถูกต้อง " }, { status: 401 });
    }

    //   Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //  Update to Database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ 🍃" }, { status: 200 });

  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "เซิร์ฟเวอร์ขัดข้อง" }, { status: 500 });
  }
}