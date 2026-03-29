'use client';
import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'; 

export default function EditCategory({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  const fetchCategory = async (categoryId: string) => {
    try {
      const res = await axios.get(`/api/categories/${categoryId}`);
      setName(res.data.name);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบข้อมูล',
        text: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
        confirmButtonColor: '#2D5A27'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (session?.user?.email) {
      try {
        const res = await axios.get(`/api/user/${session.user.email}`);
        setRole(res.data.role || null);
      } catch (error) {
        console.error('Role fetch error', error);
      }
    }
  };

  useEffect(() => {
    if (id) fetchCategory(id);
    fetchUserData();
  }, [id, session]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated' && role !== null && role !== 'admin') {
      router.push('/');
    }
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await axios.put(`/api/categories/${id}`, { name });
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'แก้ไขหมวดหมู่เรียบร้อยแล้ว 🍃',
        confirmButtonColor: '#2D5A27',
        timer: 1500
      });
      router.push('/admin'); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#88B04B] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-[#2D5A27] text-sm font-medium italic">กำลังเตรียมข้อมูล... 🍃</p>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-32 pb-16">
          <div className="bg-white rounded-3xl shadow-lg shadow-green-100/30 p-8 border border-gray-100">
            <header className="mb-8 text-center">
              <span className="text-[#88B04B] text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Management</span>
              <h2 className="text-xl font-black text-gray-800 italic">Edit Category</h2>
              <div className="w-10 h-1 bg-[#2D5A27] mx-auto mt-3 rounded-full"></div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="เช่น ไม้ฟอกอากาศ..."
                  className="w-full bg-gray-50 border-none rounded-xl p-3.5 text-sm text-gray-700 focus:ring-1 focus:ring-[#88B04B] transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#2D5A27] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-green-100 disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Save Changes 🍃'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-3 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <p className="text-center mt-6 text-gray-300 text-[9px] uppercase tracking-[0.2em]">
            REF ID: {id}
          </p>
        </div>
      </div>
    );
  }

  return null;
}