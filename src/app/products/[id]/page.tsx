'use client'
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Swal from 'sweetalert2';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [post, setPost] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const handleAction = async (isBuyNow: boolean) => {
    if (status !== "authenticated") {
      const result = await Swal.fire({
        title: 'สิทธิพิเศษสำหรับสมาชิก',
        text: "กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้าหรือสั่งซื้อนะครับ",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2D5A27',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
        cancelButtonText: 'ไว้ก่อน',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        router.push('/user/login');
      }
      return;
    }

    try {
      const userRes = await axios.get(`/api/user/${session?.user?.email}`);
      const userId = userRes.data.id;

      const response = await axios.post('/api/cart', {
        userId,
        postId: post.id,
        quantity,
      });

      if (response.status === 200) {
        if (isBuyNow) {
          router.push('/checkout');
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'เพิ่มลงตะกร้าเรียบร้อย!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง', 'error');
    }
  };

  // --- จุดสำคัญ: แก้ไขเพื่อดัก Error ก่อน Render ---
  if (loading || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)] font-light text-gray-400">
          Loading plant details...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* รูปภาพ */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-sm shadow-sm border border-gray-100">
            <Image 
              src={post?.img} 
              alt={post?.title || "Product Image"} 
              fill 
              className="object-cover" 
              priority // ช่วยให้รูปโหลดไวขึ้นในหน้ารายละเอียด
            />
          </div>

          {/* รายละเอียด */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post?.title}</h1>
            <div className="text-2xl text-[#2D5A27] font-medium mb-8">฿{post?.price?.toLocaleString()}.00</div>
            <p className="text-gray-600 mb-8 border-t pt-8 leading-relaxed">{post?.content}</p>

            {post?.quantity > 0 ? (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">-</button>
                    <input type="number" value={quantity} readOnly className="w-12 text-center focus:outline-none font-medium" />
                    <button onClick={() => setQuantity(q => Math.min(post.quantity, q + 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">+</button>
                  </div>
                  <span className="text-xs text-gray-400">Stock: {post.quantity}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleAction(false)} className="py-4 border border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300">Add to Cart</button>
                  <button onClick={() => handleAction(true)} className="py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all duration-300">Buy Now</button>
                </div>
              </div>
            ) : (
              <div className="py-4 bg-red-50 text-red-600 font-bold text-center rounded-lg">OUT OF STOCK</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}