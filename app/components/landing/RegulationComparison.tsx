'use client'

import { useState } from 'react'
import { ArrowLeftRight, CheckCircle2, FileText, Sparkles, Filter } from 'lucide-react'
import { REGULATION_COMPARISON } from '@/app/utils/auditData'

export default function RegulationComparison() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')

  const categories = ['Semua', 'Dasar', 'Struktur', 'Prosedur', 'Sanksi']

  const filteredData = selectedCategory === 'Semua'
    ? REGULATION_COMPARISON
    : REGULATION_COMPARISON.filter((item) => item.category === selectedCategory)

  return (
    <section id="regulasi" className="py-20 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <ArrowLeftRight size={14} />
            <span>Keterbaruan Regulasi K3 2025</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Perbandingan Permenaker 1987 vs Permenaker 13 Tahun 2025
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Transformasi tata kelola Panitia Pembina K3 (P2K3), digitalisasi pelaporan Kemenaker, dan integrasi perizinan berbasis risiko OSS RBA.
          </p>
        </div>

        {/* CATEGORY FILTER BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              {cat === 'Semua' ? 'Semua Aspek (11)' : `Kategori: ${cat}`}
            </button>
          ))}
        </div>

        {/* COMPARISON CARDS / GRID */}
        <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
          {filteredData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {item.aspek}
                  </h3>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  ✨ {item.highlight}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1987 */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-750">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Permenaker 04/MEN/1987 (Lama)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {item.permenaker1987}
                  </p>
                </div>

                {/* 2025 */}
                <div className="bg-red-50/50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-200/80 dark:border-red-900/50">
                  <div className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-1">
                    Permenaker 13 Tahun 2025 (Baru & Berlaku)
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-100 font-bold leading-relaxed">
                    {item.permenaker2025}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
