'use client'

import { useState } from 'react'
import { CheckCircle, AlertTriangle, AlertOctagon, HelpCircle, Calculator, Sliders, ShieldCheck, FileSpreadsheet } from 'lucide-react'
import { AUDIT_LEVELS, AUDIT_12_ELEMENTS } from '@/app/utils/auditData'

export default function AuditSimulatorSection() {
  const [selectedLevel, setSelectedLevel] = useState<'awal' | 'transisi' | 'lanjutan'>('lanjutan')
  const [fulfilledCount, setFulfilledCount] = useState<number>(150)
  const [hasCritical, setHasCritical] = useState<boolean>(false)
  const [hasMayor, setHasMayor] = useState<boolean>(false)
  const [showElementsTable, setShowElementsTable] = useState<boolean>(false)

  const currentLevelObj = AUDIT_LEVELS.find((lvl) => lvl.id === selectedLevel) || AUDIT_LEVELS[2]
  const totalCriteria = currentLevelObj.criteriaCount

  // Cap fulfilled count if level changes
  const activeFulfilled = Math.min(fulfilledCount, totalCriteria)
  const percentage = Math.round((activeFulfilled / totalCriteria) * 100)

  const getEvaluationResult = () => {
    if (hasCritical) {
      return {
        status: 'GAGAL / TIDAK LULUS',
        level: 'KRITIKAL (Koreksi Max 1x24 Jam)',
        color: 'red',
        description: 'Terdapat temuan yang dapat menimbulkan korban jiwa (fatality). Perusahaan dinilai belum berhasil menerapkan SMK3.',
      }
    }
    if (hasMayor) {
      return {
        status: 'GAGAL / BELUM BERHASIL',
        level: 'MAYOR (Koreksi Max 1 Bulan)',
        color: 'rose',
        description: 'Terdapat pelanggaran perundang-undangan atau prinsip pokok SMK3 tidak dijalankan. Penilaian tidak mengacu pada persentase.',
      }
    }
    if (percentage >= 85) {
      return {
        status: 'MEMUASKAN (Tingkat Emas)',
        level: 'Pencapaian 85% - 100%',
        color: 'emerald',
        description: 'Sistem K3 berjalan sangat efektif dan konsisten sesuai standar tertinggi PP 50/2012.',
      }
    }
    if (percentage >= 60) {
      return {
        status: 'BAIK (Tingkat Perak)',
        level: 'Pencapaian 60% - 84%',
        color: 'blue',
        description: 'Penerapan K3 telah memenuhi sebagian besar standar wajib dan layak mendapat sertifikat predikat Baik.',
      }
    }
    return {
      status: 'KURANG',
      level: 'Pencapaian 0% - 59%',
      color: 'amber',
      description: 'Penerapan K3 masih di bawah standar minimal yang dipersyaratkan oleh pemerintah.',
    }
  }

  const result = getEvaluationResult()

  return (
    <section id="audit-smk3" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Standar Audit PP 50/2012</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Kriteria & Penilaian Audit SMK3
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Pemeriksaan independen terhadap pemenuhan kriteria untuk mengukur efektivitas dan keberhasilan penerapan SMK3 perusahaan.
          </p>
        </div>

        {/* 1. 3 TINGKAT AUDIT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUDIT_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.id
            return (
              <div
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id as any)
                  setFulfilledCount(Math.round(lvl.criteriaCount * 0.9))
                }}
                className={`cursor-pointer p-6 rounded-3xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500 shadow-md shadow-red-500/10 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-red-600 dark:text-red-400 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60">
                      {lvl.badge}
                    </span>
                    {isSelected && <CheckCircle className="text-red-600 dark:text-red-400 w-5 h-5" />}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lvl.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                    {lvl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span>Sasaran: </span>
                  <span className="text-slate-700 dark:text-slate-200">{lvl.targetCompany}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 2. SIMULATOR AUDIT INTERAKTIF */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="text-red-600 dark:text-red-400 w-6 h-6" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Simulasi Penilaian Audit Mandiri (Interactive Calculator)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Uji persentase kelulusan dan dampak temuan kritis pada tingkat: <strong className="text-red-600 dark:text-red-400">{currentLevelObj.name} ({totalCriteria} Kriteria)</strong>
              </p>
            </div>

            <button
              onClick={() => setShowElementsTable(!showElementsTable)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <FileSpreadsheet size={14} className="text-red-500" />
              <span>{showElementsTable ? 'Sembunyikan 12 Elemen' : 'Lihat 12 Elemen Kriteria'}</span>
            </button>
          </div>

          {/* SLIDER & INPUT CONTROLS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              {/* SLIDER PEMENUHAN */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Jumlah Kriteria yang Terpenuhi:</span>
                  <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">
                    {activeFulfilled} / {totalCriteria} ({percentage}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalCriteria}
                  value={activeFulfilled}
                  onChange={(e) => setFulfilledCount(Number(e.target.value))}
                  className="w-full accent-red-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* TOGGLE TEMUAN KRITIS & MAYOR */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Simulasi Temuan Ketidaksesuaian:
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    hasCritical 
                      ? 'bg-red-100 dark:bg-red-950/60 border-red-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={hasCritical}
                      onChange={(e) => setHasCritical(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-red-600 rounded"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertOctagon size={13} />
                        <span>Ada Temuan KRITIKAL</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Potensi fatal/kematian (Wajib koreksi max 1x24 jam)
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    hasMayor 
                      ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={hasMayor}
                      onChange={(e) => setHasMayor(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-rose-600 rounded"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertTriangle size={13} />
                        <span>Ada Temuan MAYOR</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Pelanggaran UU / 3+ temuan berulang (Koreksi max 1 bulan)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* SIMULATOR RESULT CARD */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-md space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Hasil Prediksi Audit
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                  result.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                  result.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                  result.color === 'red' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' :
                  result.color === 'rose' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                  'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {result.level}
                </span>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {result.status}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {result.description}
              </p>
              
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Skor Pemenuhan: <strong>{percentage}%</strong></span>
                <span>Standar: PP 50/2012 Tabel 2</span>
              </div>
            </div>

          </div>

          {/* 12 ELEMEN TABLE (ACCORDION) */}
          {showElementsTable && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200 space-y-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                Rincian 12 Elemen Penilaian Audit SMK3 (PP No. 50/2012 Pasal 16)
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase">
                    <tr>
                      <th className="p-3">No</th>
                      <th className="p-3">Elemen Audit</th>
                      <th className="p-3">Tingkat Awal (64)</th>
                      <th className="p-3">Tingkat Transisi (122)</th>
                      <th className="p-3">Tingkat Lanjutan (166)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                    {AUDIT_12_ELEMENTS.map((el) => (
                      <tr key={el.number} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-400">{el.number}</td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{el.title}</td>
                        <td className="p-3 text-[11px]">{el.awal}</td>
                        <td className="p-3 text-[11px]">{el.transisi}</td>
                        <td className="p-3 text-[11px]">{el.lanjutan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  )
}
