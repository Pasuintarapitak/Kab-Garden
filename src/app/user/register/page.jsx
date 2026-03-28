'use client'
import axios from "axios";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from 'sweetalert2';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // เพิ่ม State สำหรับ Confirm
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        //  (Client-side Validation)
        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
            return;
        }

   
        if (password.length < 4) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
            return;
        }

        try {
            await axios.post('/api/auth/signup', {
                email,
                password
            });
            
            await Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                text: 'ยินดีต้อนรับสู่ครอบครัว KAB GARDEN ครับ',
                confirmButtonColor: '#2D5A27',
            });
            
            router.push('/user/login');
        } catch (error) {
            console.log('Error:', error);
            setError('อีเมลนี้อาจถูกใช้งานแล้ว หรือเกิดข้อผิดพลาดที่ระบบ');
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white font-sans text-gray-900">
            
         
            <div className="hidden md:flex flex-col justify-center items-center bg-[#F9FAF9] p-8 border-r border-gray-100">
                <div className="relative w-full max-w-[650px] aspect-[1/1] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white">
                    <Image 
                        src="https://images.unsplash.com/photo-1545241047-6083a3684587" 
                        alt="KAB Garden Atmosphere"
                        priority
                        fill
                        className="object-cover scale-105" 
                    />
                </div>
            </div> 

       
            <div className="flex justify-center items-center p-12 bg-white">
                <div className="w-full max-w-sm">
                    
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                            Join Us
                        </h1>
                        <p className="text-gray-400 font-light text-sm">
                            Create an account to start your green journey.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs p-4 rounded-xl mb-6 border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
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

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#2D5A27]/5 focus:border-[#2D5A27] transition-all outline-none text-sm"
                                type="password"
                                placeholder="At least 4 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#2D5A27]/5 focus:border-[#2D5A27] transition-all outline-none text-sm"
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="w-full py-4 mt-4 rounded-xl bg-[#2D5A27] text-white text-sm font-bold tracking-wide shadow-lg shadow-[#2D5A27]/20 hover:bg-[#1f3f1b] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                            type="submit"
                        >
                            Sign Up
                        </button>

                        <div className="text-center mt-8">
                            <p className="text-gray-400 text-xs">
                                Already a member?{" "}
                                <Link className="font-bold text-[#2D5A27] hover:underline underline-offset-4" href="/user/login">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}