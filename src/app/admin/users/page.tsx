"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States สำหรับ Modal แก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [error, setError] = useState("");


  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 🛡️ ระบบตรวจสอบสิทธิ์ (Guard) ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/user/login"); 
    } else if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/"); 
      } else {
        fetchUsers(); 
      }
    }
  }, [status, session, router, fetchUsers]);

  // --- 🛠️ ฟังก์ชันจัดการ Modal ---
  const handleEditClick = (user: any) => {
    setEditingUser({ ...user });
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSave = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      const data = await res.json();

      if (res.ok) {
        alert("อัปเดตข้อมูลสวนเรียบร้อยแล้ว 🍃");
        handleCloseModal();
        fetchUsers(); // รีโหลดตาราง
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการอัปเดต");
      }
    } catch (err) {
      setError("ไม่สามารถติดต่อ Server ได้");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจนะว่าจะลบสมาชิกคนนี้? ข้อมูลจะหายไป!")) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchUsers();
  };

  // --- ⏳ แสดงหน้า Loading ระหว่างเช็คสิทธิ์ ---
  if (status === "loading" || (status === "authenticated" && (session?.user as any)?.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-medium text-green-700 italic animate-pulse">
        กำลังตรวจสอบสิทธิ์... 🍃
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
        <span className="bg-green-100 p-2 rounded-2xl">🍃</span> 
        ระบบจัดการสมาชิก KAB GARDEN
      </h1>
      
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-50/50 text-green-900 uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="p-5 border-b border-green-100">ID</th>
              <th className="p-5 border-b border-green-100">ชื่อ-อีเมล</th>
              <th className="p-5 border-b border-green-100">ที่อยู่ / เบอร์โทร</th>
              <th className="p-5 border-b border-green-100 text-center">บทบาท</th>
              <th className="p-5 border-b border-green-100 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-green-50/30 transition duration-150">
                <td className="p-5 text-gray-400 font-mono text-xs">#{user.id}</td>
                <td className="p-5">
                  <div className="font-bold text-gray-800">{user.name || "ยังไม่ตั้งชื่อ"}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </td>
                <td className="p-5 text-sm">
                  <div className="text-gray-500 truncate w-48 mb-1" title={user.address}>{user.address || "-"}</div>
                  <div className="text-green-700 font-bold text-xs">{user.phone || "-"}</div>
                </td>
                <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                        {user.role}
                    </span>
                </td>
                <td className="p-5 text-right space-x-3">
                  <button onClick={() => handleEditClick(user)} className="text-green-600 hover:text-green-800 font-bold text-xs">แก้ไข</button>
                  <span className="text-gray-200">|</span>
                  <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 font-bold text-xs">ลบสมาชิก</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal ป๊อปอัปสำหรับแก้ไข --- */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-1 italic">Edit Member Info</h2>
            <p className="text-gray-400 mb-8 text-xs font-medium uppercase tracking-widest">System ID: #{editingUser.id}</p>
            
            {error && <p className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-xs font-bold border border-red-100">{error}</p>}

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Member Name</label>
                <input type="text" name="name" value={editingUser.name || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Email Address</label>
                <input type="email" name="email" value={editingUser.email || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Garden Role</label>
                <select name="role" value={editingUser.role} onChange={handleInputChange} className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer font-bold text-green-700">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button onClick={handleCloseModal} className="px-6 py-3 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleModalSave} className="px-8 py-3 rounded-2xl text-xs font-black text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95">Save Changes 🍃</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}