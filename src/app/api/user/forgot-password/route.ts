import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendOtpEmail } from "../../../../lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "ไม่พบอีเมลนี้" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.upsert({
      where: { email },
      update: { token: otp, expires },
      create: { email, token: otp, expires },
    });

    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: "ส่งรหัสแล้ว" });
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}