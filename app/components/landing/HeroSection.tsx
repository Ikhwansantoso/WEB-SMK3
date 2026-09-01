'use client'

interface HeroSectionProps {
  userRole?: string | null;
}

export default function HeroSection({ userRole }: HeroSectionProps) {

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* BACKGROUND GLOWS & ACCENTS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-red-600/15 via-rose-500/10 to-amber-500/10 dark:from-red-600/20 dark:via-rose-600/15 dark:to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-red-200/80 dark:border-red-900/60 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-red-600 dark:text-red-400 font-extrabold uppercase tracking-wider text-[11px]">
              Telkom Indonesia K3 Portal
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px] hidden sm:inline">
              PP No. 50/2012 & Permenaker 13/2025
            </span>
          </div>
        </div>

        {/* HERO MAIN TITLE */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Sistem Manajemen Keselamatan & Kesehatan Kerja{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-600 to-red-500 dark:from-red-400 dark:via-rose-400 dark:to-red-300">
              (SMK3)
            </span>
          </h1>
          
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Pusat terpadu implementasi norma K3, pemantauan audit keselamatan, kepatuhan regulasi ketenagakerjaan, serta modul tanggap darurat dan P3K interaktif di lingkungan Telkom Indonesia.
          </p>

        </div>

      </div>
    </section>
  )
}
