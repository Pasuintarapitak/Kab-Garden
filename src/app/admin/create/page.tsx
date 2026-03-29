'use client';

import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

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
    fetchCategories();
    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated' && role !== null) {
      if (role !== 'admin') router.push('/');
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, role]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId,
      });
      setSuccess('Product added to KAB GARDEN successfully!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (error) {
      setError('Failed to create product. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !role) return <div className="min-h-screen flex items-center justify-center text-gray-400 italic font-medium">Verifying Admin Access...</div>;

  return (
    <div className="bg-[#F0F2F0] min-h-screen pb-20 font-sans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 pt-32">
        <div className="mb-10 text-center md:text-left">
           <h2 className="text-4xl font-black text-gray-900 tracking-tight">Add New Product</h2>
           <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Inventory Management System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] shadow-xl border-2 border-gray-200 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Product Basic Info */}
                <div className="space-y-6 border-b-2 border-gray-100 pb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Plant Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Monstera Deliciosa"
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Price (฿)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        placeholder="0.00"
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        placeholder="Amount"
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div className="space-y-6 border-b-2 border-gray-100 pb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      required
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Choose a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setIMG(e.target.value)}
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Product Description</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your plant..."
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800 leading-relaxed"
                  ></textarea>
                </div>

                {error && <p className="text-red-600 text-sm font-black bg-red-50 border-2 border-red-100 p-4 rounded-2xl">{error}</p>}
                {success && <p className="text-[#2D5A27] text-sm font-black bg-green-50 border-2 border-green-100 p-4 rounded-2xl">{success}</p>}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-base shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'CONFIRM & CREATE PRODUCT'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
               <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-gray-200 overflow-hidden">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Live Preview</p>
                  <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-10">
                        <span className="text-5xl block mb-4 opacity-30">🌱</span>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Image will appear here</p>
                      </div>
                    )}
                  </div>
               </div>
               
               <div className="bg-[#2D5A27] p-8 rounded-[2rem] text-white shadow-2xl border-4 border-[#1f3f1b]">
                  <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                    <span className="bg-white/20 p-1 rounded-lg">📌</span> Admin Guidelines
                  </h4>
                  <ul className="text-sm text-white/90 space-y-4 font-bold leading-relaxed">
                    <li className="flex gap-3">
                      <span className="opacity-50">01</span>
                      <span>ตรวจสอบ URL รูปภาพว่าขึ้นต้นด้วย https:// เสมอ</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="opacity-50">02</span>
                      <span>สต็อกสินค้าควรเป็นจำนวนจริงเพื่อป้องกันออเดอร์ค้าง</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="opacity-50">03</span>
                      <span>การตั้งราคาควรเป็นตัวเลขกลมๆ เพื่อความสวยงามในหน้าเว็บ</span>
                    </li>
                  </ul>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}