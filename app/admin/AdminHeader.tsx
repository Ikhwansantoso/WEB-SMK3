'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, User, CalendarDays, ChevronDown, Menu, LogOut, Camera, Sun, Moon } from 'lucide-react'
import { logout } from "@/app/actions/auth"
import toast from 'react-hot-toast'
import TimestampModal from "@/app/components/TimestampModal"

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  openAuditsCount: number;
  incidentsCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function AdminHeader({
  userName,
  userRole,
  openAuditsCount,
  incidentsCount,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: AdminHeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isTimestampOpen, setIsTimestampOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allMenus = [
    { name: "Dashboard", href: "/admin/dashboard", keywords: ["dashboard", "beranda", "grafik", "statistik"] },
    { name: "Dokumen IBPR", href: "/admin/ibpr", keywords: ["ibpr", "risiko", "bahaya", "pengendalian"] },
    { name: "Monitoring Jam Kerja", href: "/admin/monitoring", keywords: ["jam kerja", "monitoring", "absensi", "lembur"] },
    { name: "Data Audit", href: "/admin/audit", keywords: ["audit", "temuan", "laporan audit", "kepatuhan"] },
    { name: "Laporan Insiden", href: "/admin/kecelakaan", keywords: ["insiden", "kecelakaan", "laporan kecelakaan", "kecelakaan kerja"] },
    ...(userRole === "ADMIN" ? [
      { name: "Document Tools", href: "/admin/document-tools", keywords: ["document tools", "rotate pdf", "merge pdf", "split pdf", "compress pdf", "rotasi"] },
      { name: "Data Pengguna", href: "/admin/users", keywords: ["user", "pengguna", "akun", "tambah user", "auditor", "pegawai"] },
      { name: "Buat Surat", href: "/admin/surat", keywords: ["buat surat", "cetak surat", "template surat", "surat dinas"] },
      { name: "Arsip Surat", href: "/admin/arsip", keywords: ["arsip surat", "surat masuk", "surat keluar"] }
    ] : [])
  ]

  const filteredMenus = searchQuery.trim() === "" 
    ? [] 
    : allMenus.filter(menu => 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )

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
            <span className="truncate" suppressHydrationWarning>{today}</span>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: Tools & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* 1. Search Bar (Global Menu Quick Search) */}
        <div ref={dropdownRef} className="hidden lg:block relative">
          <div className="flex items-center bg-black/10 px-3 py-2 rounded-lg border border-white/10 focus-within:bg-black/20 transition w-48 xl:w-64">
              <Search size={16} className="text-red-100/70 mr-2 shrink-0" />
              <input 
                  type="text" 
                  placeholder="Cari menu/fitur..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="bg-transparent text-sm outline-none w-full text-white placeholder:text-red-100/50" 
              />
          </div>
          
          {showDropdown && filteredMenus.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 py-1.5 border-b border-slate-50">Hasil Pencarian Menu</p>
              <div className="max-h-60 overflow-y-auto">
                {filteredMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => {
                      setSearchQuery("")
                      setShowDropdown(false)
                    }}
                    className="flex items-center px-4 py-3 hover:bg-red-50 hover:text-red-600 transition font-semibold text-slate-700"
                  >
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {showDropdown && searchQuery.trim() !== "" && filteredMenus.length === 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50 text-slate-500 text-xs text-center">
              Menu tidak ditemukan
            </div>
          )}
        </div>

        {/* Kamera Timestamp (Hanya untuk ADMIN) */}
        {userRole === "ADMIN" && (
          <button 
            onClick={() => setIsTimestampOpen(true)}
            className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Ambil Kamera Timestamp"
          >
            <Camera size={20} />
          </button>
        )}

        {/* Toggle Tema (Dark/Light) */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
          title={isDark ? "Aktifkan Tema Terang" : "Aktifkan Tema Gelap"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 2. Notifikasi (Dinamis) */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Notifikasi"
          >
              <Bell size={20} />
              {(openAuditsCount + incidentsCount > 0) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-red-600 animate-pulse"></span>
              )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 py-1.5 border-b border-slate-50">Notifikasi Sistem</p>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {openAuditsCount > 0 && (
                  <Link 
                    href="/admin/audit"
                    onClick={() => setShowNotifications(false)}
                    className="flex flex-col px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-slate-800 text-xs">Temuan Audit Pending</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Terdapat {openAuditsCount} temuan audit OPEN yang memerlukan tindak lanjut.</span>
                  </Link>
                )}
                {incidentsCount > 0 && (
                  <Link 
                    href="/admin/kecelakaan"
                    onClick={() => setShowNotifications(false)}
                    className="flex flex-col px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-slate-800 text-xs">Laporan Insiden K3</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Terdapat {incidentsCount} kasus kecelakaan kerja terdaftar.</span>
                  </Link>
                )}
                {openAuditsCount === 0 && incidentsCount === 0 && (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    Tidak ada notifikasi baru.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Divider Vertikal Tipis */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1 hidden md:block"></div>

        {/* 4. User Profile (Clean Look) with Dropdown */}
        <div ref={profileRef} className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          >
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

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-slate-800 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 md:hidden">
                <p className="font-bold text-slate-800 text-xs truncate">{userName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{userRole}</p>
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

      {userRole === "ADMIN" && (
        <TimestampModal isOpen={isTimestampOpen} onClose={() => setIsTimestampOpen(false)} />
      )}
    </header>
  )
}
