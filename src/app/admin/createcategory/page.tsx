'use client';

import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function CreateCategory() {
  const [name, setname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      if (session?.user?.email) {
        const userResponse = await axios.get(`/api/user/${session.user.email}`);
        setRole(userResponse.data.role || null);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchUserData();
  }, [session, status]);

  useEffect(() => {
    if (status === 'authenticated' && role !== null) {
      if (role !== 'admin') router.push('/home');
    } else if (status === 'unauthenticated') {
      router.push('/home');
    }
  }, [status, role]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/api/categories`, { name });
      setSuccess('New category has been added successfully!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (error) {
      setError('This category name might already exist.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !role) return <div className="min-h-screen flex items-center justify-center text-gray-400 italic font-bold">Verifying Admin Access...</div>;

  return (
    <div className="bg-[#F0F2F0] min-h-screen pb-20 font-sans">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 pt-40">
        <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-gray-200 overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gray-900 p-8 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight italic">Create Category</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Classification Management</p>
            </div>
            <span className="text-3xl opacity-50">📁</span>
          </div>

          <div className="p-10">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-[#2D5A27] text-sm font-black rounded-2xl text-center">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 text-sm font-black rounded-2xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="title" className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="e.g. Rare Plants, Succulents"
                  required
                  className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-lg text-gray-800"
                />
                <p className="text-[10px] text-gray-400 font-medium ml-1 italic">
                  * ชื่อหมวดหมู่จะถูกนำไปใช้ในการกรองสินค้าหน้าแรก
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[#2D5A27] text-white rounded-2xl font-black text-base shadow-xl hover:bg-[#1f3f1b] transition-all active:scale-[0.98] disabled:bg-gray-400"
                >
                  {loading ? 'Savin...' : 'CONFIRM & ADD CATEGORY'}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="w-full py-4 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors uppercase tracking-widest"
                >
                  Cancel and Return
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Decorative Hint */}
        <div className="mt-8 text-center px-10">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            KAB GARDEN Admin Console v2.0
          </p>
        </div>
      </main>
    </div>
  );
}