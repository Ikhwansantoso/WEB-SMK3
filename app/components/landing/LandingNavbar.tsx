'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Moon, Sun, Menu, X, ArrowRight, AlertOctagon } from 'lucide-react'

interface LandingNavbarProps {
  userRole?: string | null;
  userName?: string | null;
}

export default function LandingNavbar({ userRole, userName }: LandingNavbarProps) {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  const getDashboardUrl = () => {
    if (!userRole) return '/login'
    if (userRole === 'ADMIN') return '/admin/dashboard'
    if (userRole === 'PEGAWAI') return '/pegawai/dashboard'
    if (userRole === 'AUDITOR') return '/admin/audit'
    return '/login'
  }

  const navLinks = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Dasar Hukum & Siklus', href: '#dasar-hukum' },
    { name: 'Kriteria Audit', href: '#audit-smk3' },
    { name: 'Regulasi 2025', href: '#regulasi' },
    { name: 'Protap Darurat & P3K', href: '#protap-darurat', highlight: true },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO & TITLE */}
        <Link href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center">
            <img
              src="/Telkom-logo-full.png"
              alt="Telkom Indonesia"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="hidden sm:flex flex-col border-l border-slate-300 dark:border-slate-700 pl-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="text-emerald-500 w-4 h-4" />
              <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white">
                PORTAL SMK3
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
              Telkom Indonesia
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                link.highlight
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.highlight && <AlertOctagon size={14} className="text-red-500 animate-pulse" />}
              {link.name}
            </a>
          ))}
        </nav>

        {/* RIGHT CONTROLS: Theme Toggle + Login / Dashboard Button */}
        <div className="flex items-center gap-2.5">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          {/* DASHBOARD / LOGIN CTA */}
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all hover:scale-[1.02]"
          >
            <span>{userRole ? `Dashboard (${userName || userRole})` : 'Masuk Portal'}</span>
            <ArrowRight size={14} />
          </Link>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                link.highlight
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={getDashboardUrl()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full block py-2.5 text-center rounded-xl text-xs font-bold bg-red-600 text-white shadow"
            >
              {userRole ? 'Buka Dashboard' : 'Login Akun'}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
