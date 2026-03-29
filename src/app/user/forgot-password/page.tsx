"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage({ text: "", type: "" }); setError("");
    try {
      const res = await fetch("/api/user/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else setMessage({ text: data.error || "เกิดข้อผิดพลาด", type: "error" });
    } catch (err) { setMessage({ text: "ติดต่อเซิร์ฟเวอร์ไม่ได้", type: "error" }); } 
    finally { setLoading(false); }
  };

    const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(""); 
    
    try {
        const res = await fetch("/api/user/verify-otp", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }), 
        });
        const data = await res.json();
        
      
        // alert(`เช็คหลังบ้าน:\nStatus Code: ${res.status}\nข้อความ: ${data.message || data.error}`);

        if (res.status === 200) {
        setStep(3); 
        } else {
        setError(data.error || "รหัส OTP ผิด");
        }
    } catch (err) { 
        setError("ติดต่อระบบไม่ได้"); 
    } finally { 
        setLoading(false); 
    }
    }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); 
    try {
      const res = await fetch("/api/user/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("อัปเดตรหัสผ่านใหม่เรียบร้อย!🍃");
        window.location.href = "/user/login"; 
      } else setError(data.error || "เกิดข้อผิดพลาด");
    } catch (err) { alert("ติดต่อเซิร์ฟเวอร์ไม่ได้ครับ"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-green-50/30 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-green-100/50 p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 p-4 rounded-3xl mb-4 ">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 italic">Reset Password</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            {step === 1 && "ระบุอีเมลเพื่อรับรหัส OTP"}
            {step === 2 && `เราส่งรหัสไปที่ ${email} แล้วครับ`}
            {step === 3 && "ตั้งรหัสผ่านใหม่"}
          </p>
        </div>
        
        {message.text && (
          <p className={`text-center text-xs font-bold mb-4 p-3 rounded-xl ${ message.type === "error" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600" }`}>
            {message.text}
          </p>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-xs font-bold border border-red-100 italic">
            ⚠️ {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Email Address</label>
              <input required type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "กำลังค้นหาสมาชิก..." : "ส่งรหัส OTP 🍃"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">OTP 6-Digits</label>
              <input required maxLength={6} type="text" placeholder="0 0 0 0 0 0" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-green-800 text-white font-black text-sm shadow-lg shadow-green-200 hover:bg-green-900 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "กำลังตรวจรหัส..." : "ยืนยันรหัส OTP"}
            </button>
            <button onClick={() => setStep(1)} type="button" className="w-full text-xs text-gray-400 font-bold hover:text-green-600 transition">แก้ไขอีเมลใหม่</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">New Password</label>
              <input required type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "กำลังบันทึก..." : "อัปเดตรหัสผ่านใหม่ 🍃"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/user/login" className="text-xs font-bold text-gray-300 hover:text-green-600 transition">กลับหน้าเข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}