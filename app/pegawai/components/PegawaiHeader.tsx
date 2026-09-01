'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  User, 
  CalendarDays, 
  Menu, 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Ambulance, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus
} from 'lucide-react'
import { logout } from "@/app/actions/auth"
import toast from 'react-hot-toast'
import { PegawaiReportNotification } from "../layout"

interface PegawaiHeaderProps {
  userName: string;
  userReports?: PegawaiReportNotification[];
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function PegawaiHeader({
  userName,
  userReports = [],
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: PegawaiHeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isDark, setIsDark] = useState(false)
  
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
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Hitung laporan yang masih pending / aktif
  const activeReportsCount = userReports.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS' || r.status === 'INVESTIGASI').length

  const formatReportDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string, kondisi?: string) => {
    if (status === 'CLOSED' || kondisi === 'AMAN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={10} /> Selesai / Aman
        </span>
      )
    }
    if (status === 'IN_PROGRESS' || status === 'INVESTIGASI') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
          <Clock size={10} /> Sedang Diinvestigasi
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
        <AlertCircle size={10} /> Menunggu Tindak Lanjut
      </span>
    )
  }

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
            <span className="truncate" suppressHydrationWarning>{today}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: profile info */}
      <div className="flex items-center gap-3">
        {/* Toggle Tema (Dark/Light) */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
          title={isDark ? "Aktifkan Tema Terang" : "Aktifkan Tema Gelap"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications (KHUSUS STATUS LAPORAN PEGAWAI) */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Status Laporan Anda"
          >
            <Bell size={20} />
            {activeReportsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-red-600 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 text-slate-800 dark:text-slate-200 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase text-slate-800 dark:text-white tracking-wider">
                    Status Laporan Anda
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Daftar laporan K3 & Insiden yang Anda kirimkan
                  </span>
                </div>
                {userReports.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    {userReports.length} Laporan
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {userReports.length > 0 ? (
                  userReports.map((report) => (
                    <Link
                      key={report.id}
                      href={report.href}
                      onClick={() => setShowNotifications(false)}
                      className="flex flex-col px-4 py-3 hover:bg-red-50/60 dark:hover:bg-slate-800/60 transition group space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 text-xs group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-1">
                          {report.type === 'TEMUAN' ? (
                            <span className="p-1 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 shrink-0">
                              <AlertTriangle size={12} />
                            </span>
                          ) : (
                            <span className="p-1 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 shrink-0">
                              <Ambulance size={12} />
                            </span>
                          )}
                          <span className="truncate">{report.title}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0 font-medium">
                          {formatReportDate(report.date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                        <span className="truncate max-w-[150px]">📍 {report.location}</span>
                        {getStatusBadge(report.status, report.kondisi)}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 px-4 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum Ada Laporan</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Anda belum mengirimkan laporan temuan bahaya atau insiden.</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-1">
                      <Link
                        href="/pegawai/audit"
                        onClick={() => setShowNotifications(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition"
                      >
                        <Plus size={12} /> Lapor Temuan
                      </Link>
                      <Link
                        href="/pegawai/kecelakaan"
                        onClick={() => setShowNotifications(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition"
                      >
                        <Plus size={12} /> Lapor Insiden
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {userReports.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-[11px]">
                  <Link
                    href="/pegawai/audit"
                    onClick={() => setShowNotifications(false)}
                    className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    + Lapor Temuan
                  </Link>
                  <Link
                    href="/pegawai/kecelakaan"
                    onClick={() => setShowNotifications(false)}
                    className="font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    + Lapor Insiden
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 text-slate-800 dark:text-slate-200 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 md:hidden">
                <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{userName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">PEGAWAI</p>
              </div>
              
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 hover:text-red-700 transition font-bold text-xs"
              >
                <LogOut size={16} />
                Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
