// app/admin/AdminHeader.tsx
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { Bell, Search, User, CalendarDays, ChevronDown } from 'lucide-react'

// Global instance untuk mencegah connection exhaustion saat dev
const prisma = new PrismaClient()

export default async function AdminHeader() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  let userName = "Admin"
  let userRole = "GUEST"

  // --- AMBIL DATA USER (SAFE MODE) ---
  try {
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user) {
        userName = user.name || "Admin"
        userRole = user.role || "ADMINISTRATOR"
      }
    }
  } catch (error) {
    // Silent error agar dashboard tetap jalan
  }

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 h-20 px-8 flex items-center justify-between sticky top-0 z-40 shadow-lg shadow-red-900/10">
      
      {/* BAGIAN KIRI: Sapaan Simpel & Elegan */}
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold text-white tracking-wide">
          Halo, {userName}
        </h2>
        <div className="flex items-center gap-2 text-red-100/80 text-xs font-medium mt-0.5">
          <CalendarDays size={12} />
          <span>{today}</span>
        </div>
      </div>

      {/* BAGIAN KANAN: Tools & Profile */}
      <div className="flex items-center gap-5">
        
        {/* 1. Search Bar (Lebih Pudar & Rapi) */}
        <div className="hidden md:flex items-center bg-black/10 px-3 py-2 rounded-lg border border-white/10 focus-within:bg-black/20 transition w-64">
            <Search size={16} className="text-red-100/70 mr-2" />
            <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="bg-transparent text-sm outline-none w-full text-white placeholder:text-red-100/50" 
            />
        </div>

        {/* 2. Notifikasi (Simpel) */}
        <button className="relative p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-red-600"></span>
        </button>

        {/* 3. Divider Vertikal Tipis */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1"></div>

        {/* 4. User Profile (Clean Look) */}
        <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white group-hover:text-red-100 transition">{userName}</p>
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">{userRole}</p>
            </div>
            
            {/* Avatar Circle */}
            <div className="bg-white/10 p-2 rounded-full border border-white/20 group-hover:bg-white/20 transition backdrop-blur-sm">
                <User size={20} className="text-white" />
            </div>
            
            {/* Icon Panah Bawah Kecil (Indikasi Menu) */}
            <ChevronDown size={14} className="text-red-200/70 group-hover:text-white transition" />
        </div>

      </div>
    </header>
  )
}