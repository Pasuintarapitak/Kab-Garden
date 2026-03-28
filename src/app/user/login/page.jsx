'use client'
import Link from "next/link";
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });
            if (result.error) {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                return false;
            }
            router.push('/products'); 
        } catch (error) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white font-sans">
            
            {/* === ฝั่งซ้าย: Gallery Space (รูปใหญ่ชิดขอบ) === */}
            {/* ปรับ p-20 เป็น p-4 หรือ p-8 เพื่อเว้นขอบขาวเล็กน้อยเหมือนกรอบรูป Modern */}
            <div className="hidden md:flex flex-col justify-center items-center bg-[#F9FAF9] p-6 lg:p-8 border-r border-gray-100">
                {/* ขยาย max-w ให้ใหญ่ขึ้นจนตีเต็มพื้นที่ฝั่งซ้าย */}
                <div className="relative w-full max-w-[700px] aspect-[1/1] overflow-hidden rounded-3xl shadow-3xl shadow-gray-200/40 border border-white">
                    <Image 
                        src="https://fastly.picsum.photos/id/248/3872/2592.jpg?hmac=_F3LsKQyGyWnwQJogUtsd_wyx2YDYnYZ6VZmSMBCxNI" 
                        alt="KAB Garden Aesthetic"
                        priority
                        fill
                        className="object-cover scale-105" 
                    />
                </div>
            </div>

            {/* === ฝั่งขวา: Minimal Login Form === */}
            <div className="flex justify-center items-center p-12 bg-white border-l border-gray-50">
                <div className="w-full max-w-sm">
                    
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            Sign in
                        </h1>
                        <p className="text-gray-400 font-light text-sm">
                            Welcome back to KAB GARDEN. Please enter your details.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs p-4 rounded-xl mb-8 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#2D5A27]/5 focus:border-[#2D5A27] transition-all outline-none text-sm"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="password">
                                    Password
                                </label>
                                <Link href="#" className="text-[11px] text-[#2D5A27] hover:font-bold transition-all">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#2D5A27]/5 focus:border-[#2D5A27] transition-all outline-none text-sm"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="w-full py-4 rounded-xl bg-[#2D5A27] text-white text-sm font-bold tracking-wide shadow-lg shadow-[#2D5A27]/20 hover:bg-[#1f3f1b] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                            type="submit"
                        >
                            Sign in to Garden
                        </button>

                        <div className="text-center mt-10">
                            <p className="text-gray-400 text-xs">
                                Don't have an account?{" "}
                                <Link className="font-bold text-[#2D5A27] hover:underline underline-offset-4" href="/user/register">
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}