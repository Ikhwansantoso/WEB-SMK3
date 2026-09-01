'use client'

import Link from 'next/link'
import { ShieldCheck, Heart } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COL 1: LOGO & ABOUT */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/Telkom-logo-full.png"
                alt="Telkom Indonesia"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <div className="border-l border-slate-700 pl-3">
                <span className="font-black text-white text-sm block">
                  PORTAL SMK3
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  PT Telkom Indonesia (Persero) Tbk
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs max-w-md font-medium leading-relaxed">
              Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3) terpadu berlandaskan PP No. 50 Tahun 2012 dan Permenaker 13 Tahun 2025 untuk menjamin zero accident dan perlindungan optimal seluruh insan Telkom Group.
            </p>
          </div>

          {/* COL 2: QUICK NAV */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#hero" className="hover:text-white transition">Beranda</a>
              </li>
              <li>
                <a href="#dasar-hukum" className="hover:text-white transition">Dasar Hukum & 5 Siklus</a>
              </li>
              <li>
                <a href="#audit-smk3" className="hover:text-white transition">166 Kriteria Audit</a>
              </li>
              <li>
                <a href="#regulasi" className="hover:text-white transition">Permenaker 2025</a>
              </li>
              <li>
                <a href="#protap-darurat" className="text-red-400 hover:text-red-300 transition">Buku Protap K3 & P3K</a>
              </li>
            </ul>
          </div>

          {/* COL 3: STANDARISASI */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              Standarisasi K3
            </h4>
            <ul className="space-y-2 font-medium text-slate-400">
              <li>PP No. 50 Tahun 2012</li>
              <li>UU No. 13 Tahun 2003 (Ketenagakerjaan)</li>
              <li>UU No. 1 Tahun 1970 (Keselamatan Kerja)</li>
              <li>Permenaker No. 13 Tahun 2025 (P2K3)</li>
              <li>ISO 45001:2018 (OH&S Management)</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} PT Telkom Indonesia (Persero) Tbk. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Utamakan Keselamatan & Kesehatan Kerja (Safety First)</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
