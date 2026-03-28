'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface OrderItem {
  title: string;
  quantity: number;
  totalPrice: number;
}

interface OrderData {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
}

const formatCurrency = (amount: number | undefined) => {
  return `฿${(amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export default function Bill() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/order/${orderId}`);
      setOrderData(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      const orderId = new URLSearchParams(window.location.search).get('orderId');
      if (orderId) {
        fetchOrderDetails(orderId);
      } else {
        router.push('/');
      }
    }
  }, [router, status]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Generating your receipt...</div>;
  if (!orderData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading order data</div>;

  const { orderId, createdAt, items = [] } = orderData;
  const shippingCost = 36;
  const subTotal = items.reduce((total, item) => total + item.totalPrice, 0);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] pb-20">
      <Navbar />
      
      <div className="max-w-xl mx-auto pt-32 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-50">
          
          {/* Header Section */}
          <div className="bg-[#2D5A27] text-white py-12 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Payment Successful</h1>
              <p className="text-white/70 text-sm mt-1 font-light">Thank you for your purchase!</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Tracking Info */}
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">#{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                <p className="text-sm font-medium text-gray-700">{formatDate(createdAt)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-6 mb-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</p>
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity} × {formatCurrency(item.totalPrice / item.quantity)}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50/50 rounded-2xl p-6 space-y-3 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping Fee</span>
                <span className="font-medium text-gray-900">{formatCurrency(shippingCost)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-bold text-[#2D5A27]">{formatCurrency(subTotal + shippingCost)}</span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mb-10">
              <p className="text-gray-400 text-xs italic font-light">"May your new plant bring joy to your space."</p>
              <p className="text-[#2D5A27] font-bold text-sm mt-2">KAB GARDEN</p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Link href="/">
                <button className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-black hover:-translate-y-1 transition-all duration-300 active:scale-95">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}