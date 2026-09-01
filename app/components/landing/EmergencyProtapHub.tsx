'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Zap,
  Activity,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  ListOrdered,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { PROTAP_DATA, ProtapItem } from '@/app/utils/protapData'
import { speakProtap, stopSpeech, isSpeechSupported } from '@/app/utils/speechHelper'
import toast from 'react-hot-toast'

export default function EmergencyProtapHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'keamanan' | 'bencana' | 'p3k'>('all')
  const [activeProtapId, setActiveProtapId] = useState<string>(PROTAP_DATA[0].id)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  
  // Timer State for active card
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [timerInitialMinutes, setTimerInitialMinutes] = useState<number>(15)

  // Step checklist state: protapId -> Set of checked step indices
  const [checkedSteps, setCheckedSteps] = useState<{ [protapId: string]: number[] }>({})

  // Handle active protap selection
  const activeProtap = PROTAP_DATA.find((item) => item.id === activeProtapId) || PROTAP_DATA[0]

  // Filtered protaps
  const filteredProtaps = PROTAP_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const query = searchQuery.toLowerCase().trim()
    if (!query) return matchesCategory

    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.toLowerCase().includes(query)) ||
      item.steps.some((s) => s.toLowerCase().includes(query))

    return matchesCategory && matchesQuery
  })

  // Timer interval
  useEffect(() => {
    let interval: any = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      toast.success(`Waktu pertolongan pertama (${timerInitialMinutes} menit) telah selesai!`, {
        duration: 6000,
        icon: '🔔'
      })
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds, timerInitialMinutes])

  const startTimer = (minutes: number) => {
    setTimerInitialMinutes(minutes)
    setTimerSeconds(minutes * 60)
    setIsTimerRunning(true)
    toast.success(`Timer ${minutes} menit dimulai!`, { icon: '⏱️' })
  }

  const toggleVoice = (item: ProtapItem) => {
    if (speakingId === item.id) {
      stopSpeech()
      setSpeakingId(null)
    } else {
      stopSpeech()
      setSpeakingId(item.id)
      speakProtap(
        item.title,
        item.steps,
        () => setSpeakingId(null),
        () => {
          setSpeakingId(null)
          toast.error('Browser tidak mendukung pembacaan suara.')
        }
      )
      toast('Memutar panduan suara darurat...', { icon: '🎙️' })
    }
  }

  const toggleStepCheck = (protapId: string, stepIdx: number) => {
    setCheckedSteps((prev) => {
      const current = prev[protapId] || []
      if (current.includes(stepIdx)) {
        return { ...prev, [protapId]: current.filter((idx) => idx !== stepIdx) }
      } else {
        return { ...prev, [protapId]: [...current, stepIdx] }
      }
    })
  }

  const formatTimerDisplay = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section id="protap-darurat" className="py-20 bg-white dark:bg-slate-950 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert size={14} className="animate-pulse" />
            <span>Emergency Response & First Aid Hub</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Pusat Prosedur Tetap (Protap) K3 & P3K
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Panduan aksi cepat langkah demi langkah menghadapi insiden darurat, bencana gedung, dan pertolongan pertama dengan asisten suara otomatis.
          </p>
        </div>

        {/* SEARCH BAR & CATEGORY FILTER */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari protap darurat... (contoh: luka bakar, gempa, listrik, asam, bom, pingsan)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Protap ({PROTAP_DATA.length})
            </button>
            <button
              onClick={() => setActiveCategory('keamanan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === 'keamanan'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🛡️ Keamanan & Ancaman ({PROTAP_DATA.filter((p) => p.category === 'keamanan').length})
            </button>
            <button
              onClick={() => setActiveCategory('bencana')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === 'bencana'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🌋 Bencana & Fasilitas ({PROTAP_DATA.filter((p) => p.category === 'bencana').length})
            </button>
            <button
              onClick={() => setActiveCategory('p3k')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === 'p3k'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🩹 Pertolongan Pertama P3K ({PROTAP_DATA.filter((p) => p.category === 'p3k').length})
            </button>
          </div>
        </div>

        {/* 2 COLUMN WORKSPACE: LIST ON LEFT, DETAIL ON RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT LIST COLUMN */}
          <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredProtaps.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                Tidak ada protap yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredProtaps.map((item) => {
                const isSelected = activeProtapId === item.id
                const isSpeaking = speakingId === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveProtapId(item.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-red-50/80 dark:bg-red-950/30 border-red-500 shadow-md shadow-red-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                        item.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400' :
                        item.category === 'p3k' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.categoryLabel}
                      </span>
                      {item.timerMinutes && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> {item.timerMinutes} Menit
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-medium">
                      {item.summary}
                    </p>
                  </div>
                )
              })
            )}
          </div>

          {/* RIGHT DETAIL COLUMN (FULL PROTAP GUIDE) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
            
            {/* DETAIL HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                  {activeProtap.categoryLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activeProtap.title}
                </h3>
              </div>

              {/* VOICE AUDIO TRIGGER BUTTON */}
              <button
                onClick={() => toggleVoice(activeProtap)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
                  speakingId === activeProtap.id
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {speakingId === activeProtap.id ? (
                  <>
                    <VolumeX size={15} />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={15} className="text-red-500" />
                    <span>Dengarkan Suara (Audio)</span>
                  </>
                )}
              </button>
            </div>

            {/* FIRST AID TIMER WIDGET (IF APPLICABLE) */}
            {activeProtap.timerMinutes && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {activeProtap.timerDescription || 'Timer Tindakan Medis'}
                    </div>
                    <div className="text-[11px] text-amber-700/80 dark:text-amber-400">
                      Rekomendasi minimal pembilasan terus-menerus
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isTimerRunning ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-amber-700 dark:text-amber-300 font-mono">
                        {formatTimerDisplay(timerSeconds)}
                      </span>
                      <button
                        onClick={() => setIsTimerRunning(false)}
                        className="p-2 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-bold"
                        title="Jeda Timer"
                      >
                        <Pause size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(activeProtap.timerMinutes || 15)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow transition"
                    >
                      <Play size={12} />
                      <span>Mulai ({activeProtap.timerMinutes}m)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEPS LIST (CHECKLIST FORMAT) */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span>Langkah Tindakan Berurutan:</span>
              </div>

              <div className="space-y-2.5">
                {activeProtap.steps.map((step, sIdx) => {
                  const isChecked = (checkedSteps[activeProtap.id] || []).includes(sIdx)
                  return (
                    <div
                      key={sIdx}
                      onClick={() => toggleStepCheck(activeProtap.id, sIdx)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60 opacity-80'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-750 hover:border-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isChecked
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                        }`}>
                          {isChecked ? '✓' : sIdx + 1}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                        isChecked
                          ? 'text-slate-400 dark:text-slate-500 line-through'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {step}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* EMERGENCY CONTACT HINT */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Perlu bantuan ambulans atau evakuasi segera?</span>
              <a
                href="#kontak-darurat"
                className="text-red-600 dark:text-red-400 font-extrabold hover:underline flex items-center gap-1"
              >
                <PhoneCall size={12} />
                <span>Lihat Nomor Darurat SOS</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
