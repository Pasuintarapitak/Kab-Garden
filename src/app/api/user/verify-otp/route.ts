import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; 

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    // 1. ดึง Token จาก DB มาเช็ค
    const storedToken = await prisma.verificationToken.findUnique({
      where: { email },
    });

   
    if (!storedToken || storedToken.token !== otp) {
      return NextResponse.json(
        { error: "รหัส OTP ไม่ถูกต้อง ❌" }, 
        { status: 400 } // 👈 
      );
    }


    if (new Date() > storedToken.expires) {
      return NextResponse.json(
        { error: "รหัส OTP หมดอายุ" }, 
        { status: 400 }
      );
    }


    return NextResponse.json({ message: "OTP Correct" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}