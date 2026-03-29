import Link from "next/link";
import React from 'react';
import Image from "next/image";
import ProductCard from "./components/productCard";
import Navbar from "./components/Navbar";
import prisma from "../lib/prisma"

export default async function Home() {
  // 🔌 ดึงข้อมูลจากตาราง Post (ไม่ใช่ Product) เอามา 4 ชิ้นที่ขายดีที่สุด!
  const popularProducts = await prisma.post.findMany({
    take: 4,
    orderBy: {
      Sales: 'desc' // เรียงจากยอดขาย (Sales) มากไปน้อยตาม Schema เลยครับ
    }
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden shadow-lg rounded-md">
            <Image 
              src="https://fastly.picsum.photos/id/18/2500/1667.jpg?hmac=JR0Z_jRs9rssQHZJ4b7xKF82kOj8-4Ackq75D_9Wmz8" 
              alt="Plant Care"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          <div className="flex flex-col items-start text-left">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-tight">
              We&apos;re Plant Seller <br /> Choose & Decorate
            </h2>
            
            <div className="w-20 h-1 bg-[#2D5A27] mb-8"></div>

            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
              Explore our curated collection of indoor plants that bring life and serenity to your living space. 
            </p>

            <Link href="/products">
              <button className="bg-black text-white px-10 py-4 text-xs font-bold tracking-[0.3em] hover:bg-[#2D5A27] transition-all uppercase">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-50">
        <div className="flex justify-between items-end mb-12 ">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Products</h2>
            <p className="text-gray-400 mt-2">Make earth beautiful by your choice</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#2D5A27] hover:underline flex items-center gap-1">
            See more <span>&rarr;</span>
          </Link>
        </div>

     
        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 rounded-md">
            {popularProducts.map((item: any) => (
              <ProductCard 
                key={item.id}
                id={String(item.id)}
                name={item.title} 
                price={item.price || 0}
                image={item.img || "https://fastly.picsum.photos/id/248/3872/2592.jpg?hmac=_F3LsKQyGyWnwQJogUtsd_wyx2YDYnYZ6VZmSMBCxNI"} // 🚨 เปลี่ยนจาก image เป็น img
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10 col-span-full">
            <p>ยังไม่มีต้นไม้ 🍃</p>
          </div>
        )}
      </section>
      
      <div className="h-[200px]"></div>
    </div>
  );
}