import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-800 text-gray-300 py-16 px-4 border-t border-green-900/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-black text-[#88B04B] flex items-center gap-2">
            {/* Leaf Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            KAB GARDEN
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            This project has been adapted from the SA Project. 
            <br/><span className="text-[#88B04B] font-semibold">Use for Pre-Cooperative.</span>
          </p>
        </div>

        {/* Column 2: Shop */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
            {/* Shopping Bag Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#88B04B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Shopping
          </h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="/products" className="hover:text-[#88B04B] transition flex items-center gap-2"><span>•</span> All Products</Link></li>
          </ul>
        </div>

        {/* Column 3: Tech Stack */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
            {/* Code Bracket Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#88B04B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Tech Stack
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-center gap-2 hover:text-white transition cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88B04B]"></span> Next.js
            </li>
            <li className="flex items-center gap-2 hover:text-white transition cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88B04B]"></span> Prisma ORM
            </li>
            <li className="flex items-center gap-2 hover:text-white transition cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88B04B]"></span> PostgreSQL
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
            {/* User Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#88B04B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Created by
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="text-white font-medium">Pasu Intarapitak</li>
            
            {/* GitHub Link */}
            <li>
              <a href="https://github.com/Pasuintarapitak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#88B04B] transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub Profile
              </a>
            </li>
            
            {/* Email Link */}
            <li>
              <a href="mailto:s6604062610462@email.kmutnb.ac.th" className="flex items-center gap-2 hover:text-[#88B04B] transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                s6604062610462@email.kmutnb.ac.th
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-[10px] tracking-widest text-gray-500 uppercase flex flex-col items-center justify-center space-y-2">
        <p>© 2026 KAB GARDEN. Built with Next.js & TypeScript</p>
      </div>
    </footer>
  )
}