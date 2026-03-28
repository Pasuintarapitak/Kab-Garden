'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Image from "next/image"; // ใช้ Next/Image เพื่อความเร็ว
import Link from "next/link";

export default function Cart() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [address, setAddress] = useState('');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const fetchUserData = async () => {
        try {
            const userResponse = await axios.get(`/api/user/${session?.user?.email}`);
            setUserData(userResponse.data);
            setAddress(userResponse.data.address);
            if (Array.isArray(userResponse.data.cart)) {
                setCartItems(userResponse.data.cart);
            }
        } catch (error) {
            console.error('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        try {
            if (newQuantity <= 0) {
                await axios.delete(`/api/cart/${cartItemId}`);
            } else {
                await axios.put(`/api/cart/${cartItemId}`, { value: newQuantity });
            }
            fetchUserData(); // Refresh ข้อมูล
        } catch (error) {
            alert('ไม่สามารถอัปเดตจำนวนได้');
        }
    };

    const saveAddress = async () => {
        try {
            await axios.put(`/api/user/${session?.user?.email}`, { address });
            setIsEditing(false);
        } catch (error) {
            alert('ไม่สามารถบันทึกที่อยู่ได้');
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/user/login');
        else if (status === 'authenticated') fetchUserData();
    }, [status]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-light text-gray-400">Loading your garden...</div>;

    const totalPrice = cartItems.reduce((total, item) => total + (item.value * (item.post?.price ?? 0)), 0);
    const shippingCost = cartItems.length > 0 ? 36 : 0;

    return (
        <div className="bg-[#FBFCFB] min-h-screen pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 pt-32">
                <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* --- รายการสินค้า (Left Side) --- */}
                    <div className="lg:col-span-8 space-y-6">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
                                    <div className="relative w-28 h-28 flex-shrink-0">
                                        <Image src={item.post.img} alt={item.post.title} fill className="object-cover rounded-xl" />
                                    </div>
                                    
                                    <div className="flex flex-col justify-between flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{item.post.title}</h3>
                                                <p className="text-sm text-gray-400 mt-1">Stock: {item.post.quantity}</p>
                                            </div>
                                            <p className="text-lg font-semibold text-[#2D5A27]">฿{item.post.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.value - 1)}
                                                    className="px-3 hover:bg-gray-50 transition-colors"
                                                >-</button>
                                                <span className="w-10 text-center text-sm font-medium">{item.value}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.value + 1)}
                                                    className="px-3 hover:bg-gray-50 transition-colors"
                                                    disabled={item.value >= item.post.quantity}
                                                >+</button>
                                            </div>
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, 0)}
                                                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors mb-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">Your cart is empty.</p>
                                <Link href="/products" className="text-[#2D5A27] font-bold mt-4 inline-block hover:underline">Go Shopping</Link>
                            </div>
                        )}
                    </div>

                    {/* --- ส่วนสรุปผล (Right Side) --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-50 sticky top-32">
                            <h2 className="text-xl font-bold mb-8">Order Summary</h2>
                            
                            {/* Address Section */}
                            <div className="mb-8 pb-8 border-b border-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Address</span>
                                    <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-[#2D5A27] font-bold">
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <textarea 
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full p-3 text-sm border border-gray-100 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-[#2D5A27] transition-all"
                                            rows={3}
                                        />
                                        <button onClick={saveAddress} className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all">Save Address</button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 leading-relaxed">{address || 'No address provided.'}</p>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900">฿{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="font-medium text-gray-900">฿{shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-[#2D5A27]">฿{(totalPrice + shippingCost).toLocaleString()}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => router.push('/checkout')}
                                disabled={cartItems.length === 0}
                                className="w-full py-4 bg-[#2D5A27] text-white rounded-xl font-bold shadow-lg shadow-[#2D5A27]/20 hover:bg-[#1f3f1b] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}