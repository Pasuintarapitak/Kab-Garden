"use client"; // สำคัญมาก: ต้องใช้ Client Component เพื่อจับการ Scroll

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // ดึงข้อมูล Session
import axios from "axios"; // ใช้เรียก API

export default function Navbar() {
  const { data: session, status } = useSession(); // เช็คสถานะการล็อกอิน
  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0); // เก็บจำนวนตะกร้าจาก DB

  // เอฟเฟกต์สำหรับดึงข้อมูล User และตะกร้าจาก Database
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchUserData = async () => {
        try {
          // ดึงข้อมูล User จาก API เดิมของคุณ
          const response = await axios.get(`/api/user/${session.user.email}`);
          const data = response.data;
          setUserData(data);
          setRole(data.role); // เก็บ Role ไว้เช็ค Admin

          // นับจำนวนของในตะกร้าจาก DB
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

  // เอฟเฟกต์สำหรับเปลี่ยนสี Navbar ตอนเลื่อนจอ
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ซ่อน Navbar ตอนกำลังโหลดสถานะ
  if (status === "loading") {
    return <div className="h-20 bg-white border-b border-gray-100 w-full fixed top-0 z-50"></div>;
  }

  return (
    <nav
      className={`
      fixed top-0 z-50 w-full transition-all duration-300
      ${isScrolled 
        ? "bg-zinc-900 shadow-md py-2" // สีเข้มตอนเลื่อน (UI ใหม่)
        : "bg-white backdrop-blur-md py-4 border-b border-gray-100" // สีขาวมินิมอล (UI ใหม่)
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          
          {/* โลโก้ด้านซ้าย */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-[#88B04B]' : 'text-[#2D5A27]'}`}>
              KAB GARDEN
            </Link>
          </div>

          {/* เมนู & ไอคอน (เลย์เอาต์ตาม UI ใหม่) */}
          <div className="ml-auto flex items-center space-x-8">
            <div className={`hidden md:flex space-x-8 items-center ${isScrolled ? 'text-gray-200' : 'text-gray-600'}`}>
              <Link href="/" className="hover:text-[#88B04B] transition font-medium text-sm">Home</Link>
              <Link href="/products" className="hover:text-[#88B04B] transition font-medium text-sm">Products</Link>
              
              {/* ถ้าล็อกอินแล้ว โชว์ประวัติ ถ้าเป็นแอดมิน โชว์ Dashboard */}
              {status === "authenticated" && (
                <>
                  <Link href="/user/profile/all" className="hover:text-[#88B04B] transition font-medium text-sm hidden lg:block">History</Link>
                  {role === 'admin' && (
                    <Link href="/admin" className="hover:text-[#88B04B] transition font-medium text-sm text-[#88B04B]">Sales/Admin</Link>
                  )}
                </>
              )}
            </div>

            <div className={`flex items-center space-x-5 ${isScrolled ? 'text-gray-200' : 'text-gray-600'}`}>
              {status === "authenticated" ? (
                // === ส่วนที่แสดงถ้า "ล็อกอินแล้ว" ===
                <>
                  <Link href="/user/profile/information" className="hover:text-[#88B04B] text-sm font-semibold">
                    {userData?.name || "Profile"}
                  </Link>
                  {/* ปุ่ม Logout */}
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="hover:text-red-400 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              ) : (
                // === ส่วนที่แสดงถ้า "ยังไม่ได้ล็อกอิน" ===
                <Link href="/user/login" className="hover:text-[#88B04B] text-sm font-medium">LOGIN</Link>
              )}

              {/* ไอคอนตะกร้าสินค้า (เลย์เอาต์ตาม UI ใหม่) */}
              <Link href="/cart" className="relative p-2 hover:text-[#88B04B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {/* วงกลมแดงโชว์เลขตะกร้า ถ้าล็อกอินและมีของ */}
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold text-white bg-[#88B04B] rounded-full translate-x-1/2 -translate-y-1/2">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}