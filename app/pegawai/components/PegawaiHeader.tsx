'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, User, CalendarDays, Menu, LogOut, ChevronDown, Camera, Sun, Moon } from 'lucide-react'
import { logout } from "@/app/actions/auth"
import toast from 'react-hot-toast'
import TimestampModal from "@/app/components/TimestampModal"

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

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isTimestampOpen, setIsTimestampOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
      toast.success("Tema Terang Diaktifkan")
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
      toast.success("Tema Gelap Diaktifkan")
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        {/* Kamera Timestamp */}
        <button 
          onClick={() => setIsTimestampOpen(true)}
          className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
          title="Ambil Kamera Timestamp"
        >
          <Camera size={20} />
        </button>

        {/* Toggle Tema (Dark/Light) */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
          title={isDark ? "Aktifkan Tema Terang" : "Aktifkan Tema Gelap"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-red-600"></span>
        </button>

        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1 hidden md:block"></div>

        {/* User Profile dropdown */}
        <div ref={profileRef} className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold truncate max-w-[100px]">{userName}</p>
              <p className="text-[9px] font-bold text-red-200 uppercase tracking-widest">PEGAWAI</p>
            </div>
            <div className="bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-sm group-hover:bg-white/20 transition">
              <User size={18} />
            </div>
            <ChevronDown size={14} className="text-red-200/70 group-hover:text-white transition" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-slate-800 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 md:hidden">
                <p className="font-bold text-slate-800 text-xs truncate">{userName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">PEGAWAI</p>
              </div>
              
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition font-bold text-xs"
              >
                <LogOut size={16} />
                Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>

      <TimestampModal isOpen={isTimestampOpen} onClose={() => setIsTimestampOpen(false)} />
    </header>
  )
}
