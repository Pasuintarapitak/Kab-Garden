"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // 🍔 State สำหรับเปิด-ปิดเมนูมือถือ

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${session.user.email}`);
          const data = response.data;
          setUserData(data);
          setRole(data.role);

          if (data.cart && Array.isArray(data.cart)) {
            const totalItems = data.cart.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [status, session]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (status === "loading") {
    return <div className="h-20 bg-white border-b border-gray-100 w-full fixed top-0 z-50"></div>;
  }

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-zinc-900 shadow-md py-2" : "bg-white backdrop-blur-md py-4 border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 🌿 โลโก้ */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-[#88B04B]' : 'text-[#2D5A27]'}`}>
              KAB GARDEN
            </Link>
          </div>

          {/* 💻 Desktop Menu (ซ่อนในมือถือ) */}
          <div className="hidden md:flex items-center space-x-8">
            <div className={`flex space-x-8 items-center ${isScrolled ? 'text-gray-200' : 'text-gray-600'}`}>
              <Link href="/" className="hover:text-[#88B04B] transition font-medium text-sm">Home</Link>
              <Link href="/products" className="hover:text-[#88B04B] transition font-medium text-sm">Products</Link>
              {status === "authenticated" && (
                <>
                  <Link href="/user/profile/all" className="hover:text-[#88B04B] transition font-medium text-sm">History</Link>
                  {role === 'admin' && (
                    <Link href="/admin" className="hover:text-[#88B04B] transition font-medium text-sm text-[#88B04B]">Sales/Admin</Link>
                  )}
                </>
              )}
            </div>

            <div className={`flex items-center space-x-5 ${isScrolled ? 'text-gray-200' : 'text-gray-600'}`}>
              {status === "authenticated" ? (
                <>
                  <Link href="/user/profile/information" className="hover:text-[#88B04B] text-sm font-semibold italic">
                    {userData?.name || "Profile"}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              ) : (
                <Link href="/user/login" className="hover:text-[#88B04B] text-sm font-medium">LOGIN</Link>
              )}
              <Link href="/cart" className="relative p-2 hover:text-[#88B04B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold text-white bg-[#88B04B] rounded-full translate-x-1/2 -translate-y-1/2">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* 📱 Mobile Icons & Hamburger Button (โชว์เฉพาะมือถือ) */}
          <div className="md:hidden flex items-center space-x-4">
            {/* ตะกร้า (ยังโชว์ในมือถือ) */}
            <Link href="/cart" className={`relative p-2 ${isScrolled ? 'text-gray-200' : 'text-gray-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold text-white bg-[#88B04B] rounded-full translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 🍔 ปุ่ม 3 ขีด */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${isScrolled ? 'text-white' : 'text-[#2D5A27]'}`}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu Content (แผงเมนูตอนกดเปิด) */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen bg-white shadow-xl py-6' : 'max-h-0'}`}>
        <div className="px-6 space-y-4 flex flex-col items-center">
          <Link onClick={() => setIsOpen(false)} href="/" className="text-gray-600 font-bold py-2 border-b border-gray-100 w-full text-center hover:text-[#88B04B]">Home</Link>
          <Link onClick={() => setIsOpen(false)} href="/products" className="text-gray-600 font-bold py-2 border-b border-gray-100 w-full text-center hover:text-[#88B04B]">Products</Link>
          {status === "authenticated" ? (
            <>
              <Link onClick={() => setIsOpen(false)} href="/user/profile/all" className="text-gray-600 font-bold py-2 border-b border-gray-100 w-full text-center hover:text-[#88B04B]">History</Link>
              {role === 'admin' && (
                <Link onClick={() => setIsOpen(false)} href="/admin" className="text-[#88B04B] font-bold py-2 border-b border-gray-100 w-full text-center italic">Sales/Admin Dashboard</Link>
              )}
              <Link onClick={() => setIsOpen(false)} href="/user/profile/information" className="text-green-800 font-bold py-2 border-b border-gray-100 w-full text-center italic">My Profile</Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-500 font-bold py-4 w-full text-center"
              >
                Logout 🚪
              </button>
            </>
          ) : (
            <Link onClick={() => setIsOpen(false)} href="/user/login" className="bg-[#2D5A27] text-white font-bold py-3 px-10 rounded-xl w-full text-center shadow-lg">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
}