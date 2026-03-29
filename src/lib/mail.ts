import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    await resend.emails.send({
      from: 'KAB GARDEN <onboarding@resend.dev>', // ช่วงแรกใช้เมลนี้ไปก่อนครับ
      to: email,
      subject: 'รหัสยืนยันการเปลี่ยนรหัสผ่าน - KAB GARDEN 🍃',
      html: `
        <div style="font-family: sans-serif; color: #1a331a;">
          <h1 style="color: #2d5a27;">สวัสดีครับ 🍃</h1>
          <p>คุณได้ทำการขอเปลี่ยนรหัสผ่านสำหรับระบบ KAB GARDEN</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 15px; text-align: center;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">รหัส OTP ของคุณคือ</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #166534; margin: 0;">${otp}</h2>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            *รหัสนี้จะหมดอายุภายใน 10 นาที หากคุณไม่ได้ขอนำรหัสนี้ไปใช้ โปรดเพิกเฉยต่อข้อความนี้ครับ
          </p>
        </div>
      `
    });
    console.log(`✅ ส่ง OTP ไปที่ ${email} สำเร็จ`);
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งเมล:", error);
  }
};