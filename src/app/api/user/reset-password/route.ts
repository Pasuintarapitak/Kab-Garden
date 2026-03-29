import { NextResponse } from "next/server";

import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Check OTP
    const storedToken = await prisma.verificationToken.findUnique({
      where: { email },
    });

    if (!storedToken || storedToken.token !== otp) {
      return NextResponse.json({ error: "รหัส OTP ไม่ถูกต้อง" }, { status: 400 });
    }

    // Hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);

  //  Verify 
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // 4. Delete Old OTP
    await prisma.verificationToken.delete({
      where: { email },
    });

    return NextResponse.json({ message: "อัปเดตรหัสผ่านใหม่เรียบร้อย 🍃" }, { status: 200 });

  } catch (error) {
    
    console.error("🔥 พังที่ด่าน Reset Password:", error); 
    return NextResponse.json({ error: "ระบบหลังบ้านขัดข้อง" }, { status: 500 });
  }
}