'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios';

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.email) {
      
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${session.user.email}`);
          setUserData(response.data);
        } catch (error) {
          setError('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [router, status, session]);

  // ⏳ หน้าต่างตอนโหลด (Skeleton Loading) ให้ดูโปรขึ้น
  if (loading) {
    return (
      <div className="col-span-2 bg-white shadow-xl shadow-green-100/50 rounded-[2rem] p-8 border border-gray-100 animate-pulse">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded-xl"></div>
          <div className="h-8 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-xs font-bold text-red-500 bg-red-50 rounded-2xl text-center border border-red-100">⚠️ {error}</div>;

  return (
    <div className="col-span-2 bg-white shadow-xl shadow-green-100/50 rounded-[2rem] p-8 border border-gray-100">
      
      {/* 🧑‍💻 Profile Header Section */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        {/* รูปโปรไฟล์แบบตัวอักษรย่อ */}
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-black shadow-inner">
          {userData?.name ? userData.name.charAt(0).toUpperCase() : '🌿'}
        </div>
        <div className="overflow-hidden">
          <h2 className="text-xl font-black text-gray-800 truncate">{userData?.name || "KAB Member"}</h2>
          <p className="text-xs font-bold text-gray-400 truncate">{session?.user?.email}</p>
        </div>
      </div>

      {/* 📌 Menu Items Section */}
      <div className="space-y-6">
        
        {/* ⚙️ My Account */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3 ml-2">My Account</h3>
          <div className="space-y-1">
            <Link 
              href="/user/profile/information" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all active:scale-95"
            >
              <span className="text-lg">👤</span> ข้อมูลส่วนตัว
            </Link>
            
       
            <Link 
              href="/user/profile/change-password" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all active:scale-95"
            >
              <span className="text-lg">🔑</span> เปลี่ยนรหัสผ่าน
            </Link>
          </div>
        </div>

        {/* 📦 My Purchases */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3 ml-2">My Purchases</h3>
          <div className="space-y-1">
            <Link 
              href="/user/profile/all" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all active:scale-95"
            >
              <span className="text-lg">📦</span> ประวัติการสั่งซื้อ
            </Link>
          </div>
        </div>

        {/* 🚪 Logout (Optional - เผื่ออยากเพิ่ม) }
        <div className="pt-4 mt-4 border-t border-gray-100">
           <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95">
             <span className="text-lg">🚪</span> ออกจากระบบ
           </button>
        </div> */}

      </div>
    </div>
  );
}