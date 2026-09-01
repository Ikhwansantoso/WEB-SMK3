'use client'

import { useState, useEffect } from 'react'
import { Scale, FileCheck2, Target, ShieldAlert, RefreshCcw, Check, Sparkles, ChevronRight, X, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react'

export default function LegalAndCycleSection() {
  const [activeCycleTab, setActiveCycleTab] = useState(0)
  const [selectedLegalIndex, setSelectedLegalIndex] = useState<number | null>(null)

  useEffect(() => {
    if (selectedLegalIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedLegalIndex])

  const legalItems = [
    {
      title: 'Pasal 27 ayat (2) UUD 1945',
      subtitle: 'Landasan Konstitusional Hak Pekerja',
      desc: 'Tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan.',
      tag: 'UUD 1945',
      color: 'blue',
      fullContent: {
        headline: 'Bunyi Pasal 27 Ayat (2) UUD 1945',
        quote: '“Tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan.”',
        keyPoints: [
          'Landasan konstitusional dan filosofis tertinggi negara Republik Indonesia yang melindungi martabat seluruh pekerja.',
          'Penghidupan yang layak mencakup jaminan atas lingkungan kerja yang aman, sehat, higienis, dan terlindungi dari potensi bahaya.',
          'Menjadi dasar hukum pembentukan seluruh regulasi perlindungan keselamatan dan kesehatan kerja di tingkat undang-undang maupun peraturan pemerintah.'
        ],
        obligations: 'Kewajiban negara dan pengusaha untuk menjamin keselamatan jasmani dan rohani setiap insan pekerja.'
      }
    },
    {
      title: 'UU No. 13 Tahun 2003',
      subtitle: 'Ketenagakerjaan (Pasal 35, 86, 87)',
      desc: 'Setiap pekerja berhak atas perlindungan K3 dan setiap perusahaan wajib menerapkan sistem manajemen K3 yang terintegrasi.',
      tag: 'Undang-Undang',
      color: 'rose',
      fullContent: {
        headline: 'Pasal Pokok UU No. 13 Tahun 2003',
        quote: '“Setiap perusahaan wajib menerapkan sistem manajemen keselamatan dan kesehatan kerja yang terintegrasi dengan sistem manajemen perusahaan.” (Pasal 87 ayat 1)',
        keyPoints: [
          'Pasal 35 ayat (3): Pemberi kerja dalam mempekerjakan tenaga kerja wajib memberikan perlindungan yang mencakup kesejahteraan, keselamatan, dan kesehatan baik mental maupun fisik tenaga kerja.',
          'Pasal 86 ayat (1): Setiap pekerja/buruh mempunyai hak untuk memperoleh perlindungan atas keselamatan dan kesehatan kerja, moral dan kesusilaan, serta perlakuan yang sesuai dengan harkat dan martabat manusia.',
          'Pasal 87 ayat (1): Kewajiban mutlak bagi setiap entitas korporasi untuk menerapkan SMK3 yang terintegrasi penuh ke dalam sistem manajemen inti perusahaan.'
        ],
        obligations: 'Sanksi administratif dan hukum berlaku bagi pengusaha yang lalai menyediakan standar keselamatan kerja yang layak.'
      }
    },
    {
      title: 'PP No. 50 Tahun 2012',
      subtitle: 'Penerapan Sistem Manajemen K3',
      desc: 'Wajib bagi perusahaan yang mempekerjakan paling sedikit 100 tenaga kerja atau memiliki potensi bahaya tinggi.',
      tag: 'Peraturan Pemerintah',
      color: 'amber',
      fullContent: {
        headline: 'Kriteria Wajib & 5 Pilar PP 50/2012',
        quote: '“Kewajiban menerapkan SMK3 berlaku bagi perusahaan yang mempekerjakan paling sedikit 100 orang atau memiliki tingkat potensi bahaya tinggi.” (Pasal 5 ayat 2)',
        keyPoints: [
          'Kriteria Wajib (Pasal 5): Mempekerjakan ≥100 orang atau memiliki potensi bahaya peledakan, kebakaran, pencemaran, dan penyakit akibat kerja.',
          '5 Pilar Pokok (Pasal 6): Penetapan Kebijakan K3, Perencanaan K3, Pelaksanaan Rencana K3, Pemantauan & Evaluasi Kinerja K3, dan Peninjauan & Peningkatan Kinerja SMK3.',
          'Audit Independen (Pasal 16): Penilaian kepatuhan melalui audit eksternal berjenjang (Tingkat Awal 64 kriteria, Transisi 122 kriteria, Lanjutan 166 kriteria).'
        ],
        obligations: 'Laporan audit SMK3 wajib disampaikan kepada Menteri Ketenagakerjaan, instansi pembina sektor usaha, dan dinas tenaga kerja provinsi.'
      }
    }
  ]

  const cycles = [
    {
      step: '01',
      title: 'Penetapan Kebijakan K3 & Komitmen',
      desc: 'Penyusunan visi, komitmen pimpinan puncak, penelaahan awal, identifikasi bahaya, serta konsultasi aktif bersama perwakilan pekerja/serikat buruh.',
      details: [
        'Komitmen tertulis & ditandatangani pimpinan puncak',
        'Tinjauan awal kondisi K3 perusahaan',
        'Sosialisasi kebijakan ke seluruh pekerja, tamu, dan mitra'
      ]
    },
    {
      step: '02',
      title: 'Perencanaan K3',
      desc: 'Menghasilkan rencana K3 terukur berbasis identifikasi potensi bahaya, penilaian risiko (IBPR), skala prioritas, dan pemenuhan perundang-undangan.',
      details: [
        'Penyusunan sasaran K3 yang dapat diukur',
        'Penetapan skala prioritas pekerjaan berisiko tinggi',
        'Alokasi sumber daya manusia, anggaran, & sarana'
      ]
    },
    {
      step: '03',
      title: 'Pelaksanaan Rencana K3',
      desc: 'Eksekusi operasional didukung SDM kompeten (bersertifikat), pembentukan P2K3, SOP/Instruksi Kerja (JSA), dan kesiapsiagaan tanggap darurat.',
      details: [
        'Penyediaan fasilitas P3K dan pelatihan rutin',
        'Pengendalian teknis, izin kerja (Permit to Work), & APD',
        'SOP tanggap darurat kecelakaan & bencana industri'
      ]
    },
    {
      step: '04',
      title: 'Pengukuran & Evaluasi Kinerja K3',
      desc: 'Inspeksi berkala tempat kerja, pengujian lingkungan kerja (fisik, kimia, ergonomi), pemantauan kesehatan pekerja, dan audit internal berkala.',
      details: [
        'Inspeksi tempat kerja dengan checklist standar',
        'Audit internal SMK3 oleh auditor independen kompeten',
        'Penyelidikan & analisis akar penyebab insiden kecelakaan'
      ]
    },
    {
      step: '05',
      title: 'Peninjauan & Peningkatan Berkelanjutan',
      desc: 'Tinjauan manajemen berkala untuk mengevaluasi efektivitas kebijakan, menindaklanjuti temuan audit, dan mengadaptasi perkembangan IPTEK.',
      details: [
        'Evaluasi pemenuhan target kinerja K3 tahunan',
        'Tindak lanjut rekomendasi perbaikan temuan audit',
        'Peningkatan berkelanjutan (Continuous Improvement)'
      ]
    }
  ]

  const activeLegal = selectedLegalIndex !== null ? legalItems[selectedLegalIndex] : null

  return (
    <section id="dasar-hukum" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 scroll-mt-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <Scale size={14} />
            <span>Regulasi & Kerangka Kerja</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Dasar Hukum & Siklus Penerapan SMK3
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Kewajiban kepatuhan hukum ketenagakerjaan Republik Indonesia dan siklus perbaikan berkelanjutan untuk perlindungan seluruh insan perusahaan. <span className="text-red-600 dark:text-red-400 font-bold">Klik kartu untuk rincian pasal lengkap.</span>
          </p>
        </div>

        {/* 1. DASAR HUKUM GRID (INTERAKTIF DAPAT DIKLIK) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedLegalIndex(idx)}
              className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/50 dark:hover:border-red-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.tag}
                  </span>
                  <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                    <Scale size={18} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5 mb-3">
                  {item.subtitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-red-600 dark:text-red-400">
                <span className="flex items-center gap-1 group-hover:underline">
                  <span>Lihat Rincian & Bunyi Pasal</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400">Buka Modal</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DEFINISI & TUJUAN SECTION */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold px-3 py-1 bg-white/15 rounded-full uppercase tracking-wider text-red-200">
              Pengertian Resmi PP 50/2012
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Apa itu SMK3?
            </h3>
            <p className="text-xs sm:text-sm text-red-100 font-normal leading-relaxed opacity-95">
              Bagian dari sistem manajemen perusahaan secara keseluruhan dalam rangka <strong className="text-white font-bold">pengendalian risiko</strong> yang berkaitan dengan kegiatan kerja guna terciptanya tempat kerja yang <strong className="text-white font-bold">aman, efisien dan produktif</strong>.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-200 flex items-center gap-1.5">
              <Target size={15} />
              <span>3 Tujuan Utama Penerapan:</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-red-50 font-medium">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                <span>Meningkatkan efektivitas perlindungan K3 yang terencana, terukur, terstruktur, dan terintegrasi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                <span>Mencegah dan mengurangi kecelakaan kerja serta penyakit akibat kerja (PAK).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                <span>Menciptakan tempat kerja yang aman, nyaman, dan efisien guna mendorong produktivitas kerja.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. 5 TAHAP SIKLUS PENERAPAN SMK3 (INTERAKTIF) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                5 Prinsip Siklus SMK3 (Continuous Improvement)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Klik tahapan untuk melihat rincian pemenuhan sistem:
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
              <RefreshCcw size={13} className="animate-spin" />
              <span>Siklus Berkelanjutan</span>
            </div>
          </div>

          {/* SIKLUS TABS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {cycles.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCycleTab(idx)}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  activeCycleTab === idx
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`text-[10px] font-black tracking-widest block uppercase ${
                  activeCycleTab === idx ? 'text-red-200' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  Langkah {item.step}
                </span>
                <span className="text-xs font-bold line-clamp-2 mt-1">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* ACTIVE SIKLUS DETAIL CARD */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-extrabold text-xs rounded-xl border border-red-100 dark:border-red-900">
                Tahap {cycles[activeCycleTab].step}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {cycles[activeCycleTab].title}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-6 leading-relaxed">
              {cycles[activeCycleTab].desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cycles[activeCycleTab].details.map((detail, dIdx) => (
                <div
                  key={dIdx}
                  className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-750 flex items-start gap-2.5"
                >
                  <span className="p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                    <Check size={13} />
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL RINCIAN PASAL DASAR HUKUM (GLOBAL FIXED OVERLAY) */}
      {activeLegal && (
        <div
          onClick={() => setSelectedLegalIndex(null)}
          className="fixed inset-0 w-screen h-screen min-h-screen z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
          >
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-800 to-red-600 flex items-center justify-between text-white shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Scale size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-200 block">
                    {activeLegal.tag} Republik Indonesia
                  </span>
                  <h3 className="text-base sm:text-lg font-black">{activeLegal.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedLegalIndex(null)}
                className="p-1.5 hover:bg-white/10 rounded-full transition"
                title="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 flex-1">
              
              {/* HEADLINE & QUOTE */}
              <div className="bg-red-50 dark:bg-red-950/40 p-4 sm:p-5 rounded-2xl border border-red-200/80 dark:border-red-900/60">
                <h4 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-1.5">
                  {activeLegal.fullContent.headline}
                </h4>
                <p className="text-sm sm:text-base font-bold italic text-slate-900 dark:text-white leading-relaxed">
                  {activeLegal.fullContent.quote}
                </p>
              </div>

              {/* KEY POINTS */}
              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Poin Kunci & Implikasi Hukum K3:
                </h5>
                <div className="space-y-2.5">
                  {activeLegal.fullContent.keyPoints.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-750 flex items-start gap-3"
                    >
                      <span className="p-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
                        <Check size={12} />
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OBLIGATION NOTICE */}
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                <ShieldCheck size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 leading-snug">
                  {activeLegal.fullContent.obligations}
                </p>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedLegalIndex(null)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Tutup Rincian
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
