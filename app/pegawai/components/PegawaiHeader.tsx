'use client'

import { Bell, User, CalendarDays, Menu } from 'lucide-react'

interface PegawaiHeaderProps {
  userName: string;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function PegawaiHeader({
  userName,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: PegawaiHeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header className="bg-gradient-to-r from-red-700 to-red-600 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-lg shadow-red-900/10 shrink-0 text-white">
      {/* LEFT: Toggle Button & Greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-red-100 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block text-red-100 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col justify-center ml-1">
          <h2 className="text-sm md:text-lg font-bold tracking-wide truncate max-w-[120px] md:max-w-none">
            Halo, {userName}
          </h2>
          <div className="flex items-center gap-1.5 text-red-100/80 text-[10px] md:text-xs font-medium mt-0.5">
            <CalendarDays size={11} className="shrink-0" />
            <span className="truncate">{today}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: profile info */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-red-600"></span>
        </button>

        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1 hidden md:block"></div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold truncate max-w-[100px]">{userName}</p>
            <p className="text-[9px] font-bold text-red-200 uppercase tracking-widest">PEGAWAI</p>
          </div>
          <div className="bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-sm">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  )
}
