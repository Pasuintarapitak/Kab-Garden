'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Infostock() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('desc');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState('');
  const [usertop, setnametopbuy] = useState('');
  const [moneytop, setvaluetopbuy] = useState('');
  const [salesData, setSalesData] = useState([]);

  // --- API Functions ---
  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams({ category, search, sort }).toString();
      const res = await axios.get(`/api?${query}`);
      setPosts(res.data);
    } catch (err) { setError('Failed to fetch posts'); }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get(`/api`);
      setSalesData(res.data);
    } catch (err) { setError('Failed to fetch sales data'); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/categories`);
      setCategories(res.data);
    } catch (err) { setError('Failed to fetch categories'); }
  };

  const fetchtopbuy = async () => {
    try {
      const resuser = await axios.get(`/api/user`);
      setnametopbuy(resuser.data.name);
      setvaluetopbuy(resuser.data.purchaseamount);
    } catch (err) { setError('Failed to fetch top buyer'); }
  };

  const fetchUserData = async () => {
    try {
      if (session?.user?.email) {
        const userResponse = await axios.get(`/api/user/${session.user.email}`);
        setRole(userResponse.data.role);
      }
    } catch (err) { console.error('Failed to fetch user data', err); }
  };

  // --- SweetAlert2 Delete Functions ---
  const deletePost = async (id: number) => {
    const result = await Swal.fire({
      title: 'ลบสินค้าชิ้นนี้?',
      text: "คุณจะไม่สามารถกู้คืนข้อมูลสินค้าชิ้นนี้ได้อีก!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2D5A27',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-[2rem] font-sans shadow-2xl border-2 border-gray-50',
        title: 'text-gray-800 font-bold',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/posts/${id}`);
        fetchPosts();
        Swal.fire({
          title: 'ลบสำเร็จ!',
          text: 'ข้อมูลสินค้าถูกนำออกแล้ว',
          icon: 'success',
          confirmButtonColor: '#2D5A27',
          customClass: { popup: 'rounded-[2rem]' }
        });
      } catch (err) {
        Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบสินค้าได้ในขณะนี้', 'error');
      }
    }
  };

  const deleteCat = async (id: number) => {
    const result = await Swal.fire({
      title: 'ลบหมวดหมู่?',
      text: "การลบหมวดหมู่อาจส่งผลต่อการแสดงผลสินค้า!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2D5A27',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ลบหมวดหมู่',
      cancelButtonText: 'ย้อนกลับ',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/categories/${id}`);
        fetchCategories();
        Swal.fire({
          title: 'สำเร็จ!',
          icon: 'success',
          confirmButtonColor: '#2D5A27',
          customClass: { popup: 'rounded-[2rem]' }
        });
      } catch (err) {
        Swal.fire('Error!', 'ไม่สามารถลบหมวดหมู่ได้', 'error');
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchUserData();
    else if (status === 'unauthenticated') router.push('/home');
  }, [status]);

  useEffect(() => {
    if (role === 'admin') {
      fetchPosts(); fetchCategories(); fetchtopbuy(); fetchSales();
    } else if (role && role !== 'admin') router.push('/home');
  }, [role]);

  const chartData = {
    labels: salesData.map(item => item.title),
    datasets: [
      {
        label: 'Revenue (฿)',
        data: salesData.map(item => item.Sales),
        backgroundColor: '#2D5A27',
        borderRadius: 20,
        barThickness: 15,
      },
    ],
  };

  if (status === 'loading' || (status === 'authenticated' && !role)) {
    return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Loading Admin Panel...</div>;
  }

  return (
    <div className="bg-[#EDF1F0] min-h-screen pb-20 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 italic">KAB GARDEN Management System</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Stock', value: posts.length, sub: 'Items in inventory', icon: '🌿' },
            { label: 'Top Buyer', value: usertop || '-', sub: `Total: ฿${moneytop?.toLocaleString()}`, icon: '💎' },
            { label: 'Categories', value: categories.length, sub: 'Product groups', icon: '📁' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm flex items-center justify-between border border-white">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tighter">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              </div>
              <span className="text-3xl opacity-20">{stat.icon}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Table Side */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Inventory Stock</h2>
                <Link href="/admin/create">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                    + Add Product
                  </button>
                </Link>
              </div>

              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-300 uppercase tracking-widest border-b border-gray-50 italic">
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-center">In Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {posts.map((post) => (
                      <tr key={post.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-gray-700 text-sm">{post.title}</td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {post.category?.name}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`text-sm font-bold ${post.quantity <= 0 ? 'text-red-400 underline decoration-wavy' : 'text-gray-600'}`}>
                            {post.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-4">
                          <Link href={`/admin/edit/${post.id}`} className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Edit</Link>
                          <button onClick={() => deletePost(post.id)} className="text-xs font-bold text-red-300 hover:text-red-500 transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-white p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                <Link href="/admin/createcategory" className="text-xs font-bold text-[#2D5A27] hover:underline">+ New</Link>
              </div>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-[#F8F9F8] rounded-2xl group border border-transparent hover:border-gray-100 transition-all">
                    <span className="text-sm font-bold text-gray-600">{cat.name}</span>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/editcategory/${cat.id}`} className="text-[10px] font-bold text-gray-300 hover:text-gray-600 font-mono">EDIT</Link>
                      <button onClick={() => deleteCat(cat.id)} className="text-[10px] font-bold text-red-200 hover:text-red-400 font-mono">DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Performance Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-50">
                <h2 className="text-lg font-bold mb-6 text-[#2D5A27]">Sales Performance</h2>
                <div className="h-48">
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { display: false },
                        x: { grid: { display: false }, ticks: { color: '#2D5A27', font: { size: 10, weight: 'bold' } } }
                      }
                    }} 
                  />
                </div>
                <p className="text-[10px] text-[#2D5A27]/50 mt-4 text-center font-bold tracking-widest uppercase italic">
                  Real-time revenue tracking
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}