import Link from "next/link";

export default function Footer() {
    return (
<footer className="bg-zinc-800 text-gray-300 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-[#88B04B]">KAB GARDEN</h2>
          <p className="text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore suscipit ad maxime? Quasi repudiandae asperiores ut non, dolore eligendi placeat?
          </p>
        </div>

        {/* Column 2: Shop */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Shopping</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-white transition">All Products</Link></li>

          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-white transition">Tracking</Link></li>
            <li><Link href="#" className="hover:text-white transition">How to buy</Link></li>

          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Created by</h3>
          <ul className="space-y-4 text-sm">
            <li>Pasu Intarapitak</li>
            <li>📞 08X-XXX-XXXX</li>
            <li>✉️ s6604062610462@email.kmutnb.ac.th</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-[10px] tracking-widest text-gray-500 uppercase">
        © 2026 KAB GARDEN. Built with Next.js & TypeScript
      </div>
    </footer>
    )
}