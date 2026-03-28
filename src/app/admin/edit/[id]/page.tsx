'use client';
import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

export default function Edit({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  const fetchPost = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setTitle(res.data.title);
      setIMG(res.data.img);
      setQuantity(res.data.quantity);
      setPrice(res.data.price);
      setContent(res.data.content);
      setCategoryId(res.data.categoryId);
    } catch (error) {
      setError('Failed to fetch post data');
    } finally {
      setLoading(false);
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id);
      fetchCategories();
    }
    fetchUserData();
  }, [id, session]);

  useEffect(() => {
    if (status === 'authenticated' && role !== null) {
      if (role !== 'admin') router.push('/home');
    } else if (status === 'unauthenticated') {
      router.push('/home');
    }
  }, [status, role]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/posts/${id}`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId,
      });
      router.push('/admin');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-400 italic">Loading Product Data...</div>;

  if (role === 'admin') {
    return (
      <div className="bg-[#F0F2F0] min-h-screen pb-20 font-sans">
        <Navbar />
        
        <main className="max-w-6xl mx-auto px-4 pt-32">
          <div className="mb-10 text-center md:text-left">
             <h2 className="text-4xl font-black text-gray-900 tracking-tight">Edit Product</h2>
             <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Product ID: #{id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form Side */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] shadow-xl border-2 border-gray-200 p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="space-y-6 border-b-2 border-gray-100 pb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Plant Name</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
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
                          className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] focus:ring-4 focus:ring-[#2D5A27]/5 outline-none transition-all font-bold text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

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
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] outline-none transition-all font-bold text-gray-800 text-sm"
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
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-[#2D5A27] outline-none transition-all font-bold text-gray-800 leading-relaxed"
                    ></textarea>
                  </div>

                  {error && <p className="text-red-600 text-sm font-black bg-red-50 border-2 border-red-100 p-4 rounded-2xl">{error}</p>}

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin')}
                      className="flex-1 py-5 border-2 border-gray-200 text-gray-400 rounded-2xl font-black text-base hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black text-base shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400"
                    >
                      {saving ? 'Saving...' : 'UPDATE PRODUCT'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Preview Side */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-6">
                 <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-gray-200 overflow-hidden">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Current Preview</p>
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                      {img ? (
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-10">
                          <span className="text-5xl block mb-4 opacity-30">🌱</span>
                          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No Image Provided</p>
                        </div>
                      )}
                    </div>
                 </div>
                 
                 <div className="bg-[#2D5A27] p-8 rounded-[2rem] text-white shadow-2xl border-4 border-[#1f3f1b]">
                    <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                      <span className="bg-white/20 p-1 rounded-lg">🛡️</span> Edit Mode
                    </h4>
                    <p className="text-sm text-white/90 font-bold leading-relaxed mb-4">
                      คุณกำลังแก้ไขข้อมูลของสินค้าตัวนี้ กรุณาตรวจสอบความถูกต้องของราคาและสต็อกก่อนกดบันทึก
                    </p>
                    <ul className="text-xs text-white/70 space-y-2 font-bold uppercase tracking-tighter">
                      <li>• ยอดขาย (Sales) จะไม่ได้รับผลกระทบจากการแก้ไขนี้</li>
                      <li>• การเปลี่ยนแปลงจะมีผลทันทีในหน้าแสดงสินค้า</li>
                    </ul>
                 </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return null;
}