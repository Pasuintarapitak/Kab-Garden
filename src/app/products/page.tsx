'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/productCard'

export default function AllProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get('/api/posts') // ดึงสินค้าทั้งหมดจาก API เดิมของคุณ
        setProducts(res.data)
      } catch (error) {
        // console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllProducts()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Products...</div>

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Collection</h1>
          <p className="text-gray-500 mt-2">เลือกต้นไม้ที่ใช่ ในสไตล์ที่ชอบ</p>
        </div>

        {/* แสดงรายการสินค้าทั้งหมด 4 คอลัมน์ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.title}
              price={product.price}
              image={product.img}
            />
          ))}
        </div>
      </main>
    </div>
  )
}