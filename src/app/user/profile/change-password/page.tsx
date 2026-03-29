'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Swal from 'sweetalert2';

export default function ChangePassword() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify comfirm password
    if (newPassword !== confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน', text: 'กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน', confirmButtonColor: '#2D5A27' });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'สำเร็จ!', text: 'เปลี่ยนรหัสผ่านเรียบร้อย 🪴', confirmButtonColor: '#2D5A27' });
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        Swal.fire({ icon: 'error', title: 'ล้มเหลว', text: data.error, confirmButtonColor: '#ef4444' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'ติดต่อเซิร์ฟเวอร์ไม่ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <Sidebar />
          <div className="md:col-span-4 bg-white shadow-xl shadow-green-100/50 rounded-[2rem] p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 border-b border-gray-100 pb-6 mb-8 flex items-center gap-3">
              <span className="text-3xl">🔑</span> Change Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="text-sm font-bold text-gray-500 w-48">Old Password</label>
                <input required type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none w-full" placeholder="รหัสผ่านปัจจุบัน" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="text-sm font-bold text-gray-500 w-48">New Password</label>
                <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none w-full" placeholder="รหัสผ่านใหม่" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="text-sm font-bold text-gray-500 w-48">Confirm Password</label>
                <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none w-full" placeholder="ยืนยันรหัสผ่านใหม่" />
              </div>

              <div className="flex justify-end pt-6">
                <button type="submit" disabled={loading} className="bg-[#2D5A27] text-white py-3 px-10 rounded-xl font-bold hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-green-100">
                  {loading ? "กำลังบันทึก..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}