'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); 

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClearOrder = async (orderId: number, orderCode: string) => {
    const result = await Swal.fire({
      title: 'จัดส่งออเดอร์นี้แล้ว?',
      text: `รหัสออเดอร์ #${orderCode}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2D5A27',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, เคลียร์',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/api/order/${orderId}`, { status: 'completed' });
        fetchOrders(); 
        Swal.fire({
          title: 'เคลียร์สำเร็จ!',
          text: 'ออเดอร์ถูกย้ายไปที่ประวัติแล้ว 📦',
          icon: 'success',
          confirmButtonColor: '#2D5A27',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' }
        });
      } catch (error) {
        Swal.fire('Error!', 'ไม่สามารถเคลียร์ออเดอร์ได้', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-white p-10 flex justify-center items-center mt-8">
        <span className="text-[#88B04B] animate-pulse font-medium text-sm">กำลังโหลดข้อมูลออเดอร์... 📦</span>
      </div>
    );
  }

  const displayOrders = orders.filter((o: any) => 
    activeTab === 'pending' ? o.status !== 'completed' : o.status === 'completed'
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden mt-8">
      {/* Header & Tabs */}
      <div className="p-8 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-black text-gray-800 italic">Customer Orders</h2>
          
          <div className="flex bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-[#2D5A27] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ออเดอร์ใหม่ 
              <span className="ml-2 bg-red-400 text-white px-2 py-0.5 rounded-full text-[9px]">
                {orders.filter((o: any) => o.status !== 'completed').length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ประวัติ (จัดส่งแล้ว)
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4">Order ID & Date</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Products Ordered</th>
              <th className="px-6 py-4 text-center">Actions / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayOrders.length > 0 ? displayOrders.map((order: any) => {
              const orderTotal = order.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
              
              return (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Order ID & Date */}
                  <td className="px-6 py-5 align-top">
                    <p className="font-bold text-sm text-gray-800">#{order.orderId}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                      {new Date(order.createdAt).toLocaleDateString('th-TH')}
                    </p>
                    <p className="font-black text-[#2D5A27] text-xs mt-2">฿{orderTotal.toLocaleString()}</p>
                  </td>

                  {/* Customer Details */}
                  <td className="px-6 py-5 align-top">
                    <p className="font-bold text-sm text-gray-700">{order.user?.name || 'ลูกค้าทั่วไป'}</p>
                    {/* 🚨 แก้ไขตรงนี้: เอา truncate ออก และใส่ whitespace-normal เพื่อให้มันขึ้นบรรทัดใหม่ */}
                    <p className="text-[11px] text-gray-500 mt-1 whitespace-normal break-words max-w-[250px] leading-relaxed">
                      📍 {order.user?.address || <span className="text-red-400 italic font-medium">ไม่ระบุที่อยู่</span>}
                    </p>
                    <p className="text-[10px] font-medium text-gray-500 mt-1">📞 {order.user?.phone || '-'}</p>
                  </td>

                  {/* Products Ordered */}
                  <td className="px-6 py-5 align-top">
                    <ul className="space-y-1.5">
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-[#88B04B] text-[10px] mt-0.5">▶</span>
                          <span>
                            <span className="font-medium">{item.post?.title || 'Unknown'}</span>
                            <span className="text-gray-400 ml-1 font-bold">x{item.quantity}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Actions (ปุ่มเคลียร์ / สถานะ) */}
                  <td className="px-6 py-5 align-top text-center">
                    {activeTab === 'pending' ? (
                      <button 
                        onClick={() => handleClearOrder(order.id, order.orderId)}
                        className="bg-[#2D5A27] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-green-100 active:scale-95"
                      >
                        Clear Order
                      </button>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 w-fit mx-auto">
                        <span className="text-green-500 text-xs">✔</span> Completed
                      </span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="text-center py-16">
                  <span className="text-4xl block mb-3">📦</span>
                  <span className="text-gray-400 text-sm font-medium">
                    {activeTab === 'pending' ? 'ยังไม่มีออเดอร์ใหม่เข้า' : 'ยังไม่มีประวัติการส่งสินค้า'}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}