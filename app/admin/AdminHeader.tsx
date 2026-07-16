'use client'

import { Bell, Search, User, CalendarDays, ChevronDown, Menu } from 'lucide-react'

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function AdminHeader({
  userName,
  userRole,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: AdminHeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-lg shadow-red-900/10 shrink-0">
      
      {/* BAGIAN KIRI: Toggle Button & Sapaan */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden text-red-100 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block text-red-100 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col justify-center ml-1">
          <h2 className="text-sm md:text-lg font-bold text-white tracking-wide truncate max-w-[120px] md:max-w-none">
            Halo, {userName}
          </h2>
          <div className="flex items-center gap-1.5 text-red-100/80 text-[10px] md:text-xs font-medium mt-0.5">
            <CalendarDays size={11} className="shrink-0" />
            <span className="truncate">{today}</span>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: Tools & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* 1. Search Bar (Lebih Pudar & Rapi) */}
        <div className="hidden lg:flex items-center bg-black/10 px-3 py-2 rounded-lg border border-white/10 focus-within:bg-black/20 transition w-48 xl:w-64">
            <Search size={16} className="text-red-100/70 mr-2 shrink-0" />
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
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1 hidden md:block"></div>

        {/* 4. User Profile (Clean Look) */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white group-hover:text-red-100 transition truncate max-w-[100px]">{userName}</p>
                <p className="text-[9px] font-bold text-red-200 uppercase tracking-widest">{userRole}</p>
            </div>
            
            {/* Avatar Circle */}
            <div className="bg-white/10 p-2 rounded-full border border-white/20 group-hover:bg-white/20 transition backdrop-blur-sm">
                <User size={18} className="text-white" />
            </div>
            
            {/* Icon Panah Bawah Kecil */}
            <ChevronDown size={14} className="text-red-200/70 group-hover:text-white transition" />
        </div>

      </div>
    </header>
  )
}
