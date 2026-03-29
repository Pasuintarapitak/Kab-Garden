'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/productCard'

export default function AllProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) // 🏷️ เก็บรายชื่อหมวดหมู่
  const [selectedCategory, setSelectedCategory] = useState('all') // 🎯 หมวดหมู่ที่เลือกอยู่
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
     
      const res = await fetch('/api/posts'); 
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Data is not an array:", data);
      }

   
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (Array.isArray(catData)) {
        setCategories(catData);
      }
      
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

  // 🔍 Logic สำหรับการกรองสินค้า
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((p: any) => p.categoryId === parseInt(selectedCategory))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-green-700 italic animate-pulse">
      กำลังเตรียมต้นไม้สวยๆ ให้คุณ... 🍃
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900">Our Collection</h1>
          <p className="text-gray-500 mt-2">เลือกต้นไม้ที่ใช่ ในสไตล์ที่ชอบ</p>
        </div>

        {/* 🏷️ Category Tabs (ส่วนที่เพิ่มใหม่) */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategory === 'all' 
              ? 'bg-[#2D5A27] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-500 hover:bg-green-50'
            }`}
          >
            All Plants
          </button>
          
          {categories.map((cat: any) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === String(cat.id)
                ? 'bg-[#2D5A27] text-white shadow-lg' 
                : 'bg-gray-100 text-gray-500 hover:bg-green-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 🪴 แสดงรายการสินค้า (ใช้ filteredProducts แทน products) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard 
                key={product.id}  
                id={product.id}
                name={product.title}
                price={product.price}
                image={product.img}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-5xl mb-4">🌵</p>
            <p className="font-medium text-lg">ขออภัยครับ ยังไม่มีต้นไม้ในหมวดหมู่นี้</p>
          </div>
        )}
      </main>
    </div>
  )
}