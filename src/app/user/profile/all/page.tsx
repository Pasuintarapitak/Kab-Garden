'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';

interface OrderItem {
  postId: number;
  quantity: number;
  totalPrice: number;
  post: {
    title: string;
    img: string;
  };
}

interface Order {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AllOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // คำนวณยอดรวมทั้งหมดของทุก Order (รวมค่าส่ง ฿36 ต่อหนึ่งคำสั่งซื้อ)
  const totalOrderAmount = orders.reduce((total, order) => {
    const orderTotal = order.items.reduce(
      (orderSum, item) => orderSum + item.totalPrice,
      36
    );
    return total + orderTotal;
  }, 0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && (session?.user as any)?.id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('/api/getorder', {
            params: { userId: (session?.user as any)?.id }, // แก้ขีดแดงด้วย as any
          });
          setOrders(response.data);
        } catch (error) {
          setError('Failed to fetch orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [router, status, session?.user]);

 
  useEffect(() => {
    if (orders.length > 0 && session?.user?.email) {
      const updatePurchaseAmount = async () => {
        try {
          await axios.put(`/api/user/${session.user.email}`, {
            purchaseamount: totalOrderAmount
          });
        } catch (error) {
          console.error('Update purchase amount failed:', error);
        }
      };
      updatePurchaseAmount();
    }
  }, [orders, totalOrderAmount, session?.user?.email]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Loading orders...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#FBFCFB]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
                <p className="text-gray-400 text-sm">ประวัติการสั่งซื้อทั้งหมดของคุณ</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-[#2D5A27]">฿{totalOrderAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map(order => {
                  const totalOrderPrice = order.items.reduce(
                    (total, item) => total + item.totalPrice,
                    36
                  );

                  return (
                    <div key={order.orderId} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-50 flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-500">
                          Order ID: <span className="text-gray-900 font-bold">#{order.orderId}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      <div className="px-8 py-2 divide-y divide-gray-50">
                        {order.items.map(item => (
                          <div key={item.postId} className="py-6 flex gap-6 items-center">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image 
                                src={item.post.img} 
                                alt={item.post.title} 
                                fill 
                                className="object-cover rounded-xl" 
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{item.post.title}</h4>
                              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">฿{item.totalPrice.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <div className="px-8 py-6 bg-gray-50/30 flex justify-between items-center border-t border-gray-50">
                        <span className="text-xs text-gray-400 italic font-light">Includes shipping fee ฿36.00</span>
                        <div className="text-right">
                          <span className="text-sm text-gray-500 mr-3 font-medium">Order Total:</span>
                          <span className="text-xl font-bold text-[#2D5A27]">฿{totalOrderPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-light">No orders found in your garden.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}