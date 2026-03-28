'use client'
import Link from "next/link";
import React from 'react'
import Image from "next/image";
import ProductCard from "./components/productCard";
import Navbar from "./components/Navbar"; // 1. อย่าลืม Import Navbar มาใส่ครับ

const popularProducts = [
  { id: "1", name: "Purple-petaled flowers", price: 200, image: "https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU" },
  { id: "2", name: "Cactus", price: 250, image: "https://fastly.picsum.photos/id/248/3872/2592.jpg?hmac=_F3LsKQyGyWnwQJogUtsd_wyx2YDYnYZ6VZmSMBCxNI" },
  { id: "3", name: "Lotus", price: 250, image: "https://fastly.picsum.photos/id/306/1024/768.jpg?hmac=rXix18Pn1poetHRHwu28zu8hUP0KobfXP28uQgomRAI" },
  { id: "4", name: "Thunberg's Meadowsweet ", price: 890, image: "https://fastly.picsum.photos/id/305/4928/3264.jpg?hmac=s2FLjeAIyYH0CZl3xuyOShFAtL8yEGiYk31URLDxQCI" },
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 2. ใส่ Navbar ไว้บนสุด */}
      <Navbar />

      {/* เพิ่ม pt-20 เพื่อไม่ให้ Navbar บังเนื้อหาข้างบน */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* ฝั่งซ้าย: แก้ไขขนาดรูปให้ Tailwind รู้จัก */}
          <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden shadow-lg rounded-sm">
            <Image 
              src="https://fastly.picsum.photos/id/18/2500/1667.jpg?hmac=JR0Z_jRs9rssQHZJ4b7xKF82kOj8-4Ackq75D_9Wmz8" 
              alt="Plant Care"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          {/* ฝั่งขวา: ข้อความ */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-tight">
              We're Plant Seller <br /> Choose & Decorate
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
      
      {/* ส่วนแสดงสินค้า */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-50">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Products</h2>
            <p className="text-gray-400 mt-2">Make earth beautiful by your choice</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#2D5A27] hover:underline flex items-center gap-1">
            See more <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {popularProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </section>
      
      {/* เพิ่มพื้นที่ข้างล่างเพื่อให้เลื่อนจอได้ยาวขึ้น จะได้เห็น Navbar เปลี่ยนสี */}
      <div className="h-[200px]"></div>
    </div>
  );
}