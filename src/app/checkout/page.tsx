'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Swal from 'sweetalert2'; // 🚨 อย่าลืม Import Swal ด้วยนะครับ!

interface CartItem {
  id: number;
  value: number;
  post: {
    id: number;
    title: string;
    price: number;
    img: string;
    quantity: number;
    Sales: number;
  };
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Qr'); // Default เป็น Qr

  const totalPrice = cartItems.reduce((total, item) => total + (item.value * item.post.price), 0);
  const shippingCost = 36;

const handleCheckout = async () => {
    
  
    const checkAddr = String(address).trim().toLowerCase();

    
    if (
      !checkAddr || 
      checkAddr === '' || 
      checkAddr === 'null' || 
      checkAddr === 'undefined' || 
      checkAddr === 'กรุณาระบุที่อยู่ในการจัดส่ง' 
    ) {
      Swal.fire({
        title: 'ลืมระบุที่อยู่',
        text: 'กรุณาระบุที่อยู่จัดส่งก่อนทำการสั่งซื้อ 🏡 (แก้ไขได้ที่หน้า Profile)',
        icon: 'warning',
        confirmButtonColor: '#2D5A27',
        confirmButtonText: 'รับทราบ',
        customClass: { popup: 'rounded-[2rem]' }
      });
      return; // 🛑 เบรกแตก หยุดทันที!
    }

    if (cartItems.length === 0) {
      setError('ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อนชำระเงิน');
      return;
    }
  
    try {
      if (!userId) {
        setError('ไม่พบข้อมูลผู้ใช้งาน');
        return;
      }
  
      const orderId = Math.floor(Math.random() * 1000000).toString();
      
      const items = cartItems.map(item => ({
        postId: item.post.id,
        quantity: item.value,
        totalPrice: item.value * item.post.price,
      }));

      const cartItemIds = cartItems.map(item => item.id);
      
      await axios.post('/api/checkout', {
        userId: Number(userId),
        orderId,
        items,
        cartItemIds
      });
  
      router.push(`/bill?orderId=${orderId}`);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${session?.user?.email}`);
      const data = response.data;
      setUserData(data);
      setAddress(data.address);
      setUserId(data.id);
      if (Array.isArray(data.cart)) setCartItems(data.cart);
    } catch (error) {
      setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    else if (status === 'authenticated') fetchUserData();
  }, [status]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Processing...</div>;

  return (
    <div className="bg-[#FBFCFB] min-h-screen pb-20 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-400 text-sm mt-2">ตรวจสอบรายการและที่อยู่จัดส่งของคุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ฝั่งซ้าย: Information */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Delivery Address Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#2D5A27]/10 rounded-full flex items-center justify-center text-[#2D5A27]">
                    📍
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{address || <span className="text-red-400 italic font-medium">กรุณาระบุที่อยู่ในการจัดส่ง (แก้ไขได้ที่หน้า Profile)</span>}</p>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#2D5A27]/10 rounded-full flex items-center justify-center text-[#2D5A27]">
                    💳
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                    onClick={() => setPaymentMethod('Qr')}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'Qr' ? 'border-[#2D5A27] bg-[#2D5A27]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Qr' ? 'border-[#2D5A27]' : 'border-gray-300'}`}>
                            {paymentMethod === 'Qr' && <div className="w-2 h-2 bg-[#2D5A27] rounded-full" />}
                        </div>
                        <span className="font-bold text-gray-800 text-sm">QR Promptpay</span>
                    </div>
                </div>

                <div 
                    onClick={() => setPaymentMethod('Cash')}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'Cash' ? 'border-[#2D5A27] bg-[#2D5A27]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash' ? 'border-[#2D5A27]' : 'border-gray-300'}`}>
                            {paymentMethod === 'Cash' && <div className="w-2 h-2 bg-[#2D5A27] rounded-full" />}
                        </div>
                        <span className="font-bold text-gray-800 text-sm">Cash on Delivery</span>
                    </div>
                </div>
              </div>
            </section>

            {/* Order Items Summary */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Items ({cartItems.length})</h2>
                <div className="divide-y divide-gray-50">
                    {cartItems.map(item => (
                        <div key={item.id} className="py-4 flex gap-6 items-center">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image src={item.post.img} alt={item.post.title} fill className="object-cover rounded-xl" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{item.post.title}</h4>
                                <p className="text-xs text-gray-400">Qty: {item.value}</p>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">฿{(item.value * item.post.price).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          {/* ฝั่งขวา: Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900">฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping Fee</span>
                  <span className="font-medium text-gray-900">฿{shippingCost.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-[#2D5A27]">฿{(totalPrice + shippingCost).toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

              <button
                className="w-full py-4 bg-[#2D5A27] text-white rounded-xl font-bold shadow-lg shadow-[#2D5A27]/20 hover:bg-[#1f3f1b] transition-all duration-300 transform active:scale-[0.98]"
                onClick={handleCheckout}
              >
                Place Order
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest leading-relaxed">
                By placing your order, you agree to <br /> KAB GARDEN&apos; terms of service.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}