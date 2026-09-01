'use client'

import { useState } from 'react'
import { PhoneCall, Siren, Flame, HeartPulse, Shield, Zap, X, ChevronUp } from 'lucide-react'

export default function QuickSosBar() {
  const [isOpen, setIsOpen] = useState(false)

  const emergencyContacts = [
    { name: 'Pemadam Kebakaran', number: '113', icon: Flame, color: 'bg-red-500' },
    { name: 'Ambulans / Medis', number: '118 / 119', icon: HeartPulse, color: 'bg-emerald-500' },
    { name: 'Kepolisian RI', number: '110', icon: Shield, color: 'bg-blue-500' },
    { name: 'Gangguan Listrik PLN', number: '123', icon: Zap, color: 'bg-amber-500' },
    { name: 'SAR / Basarnas', number: '115', icon: Siren, color: 'bg-orange-500' },
  ]

  return (
    <>
      {/* FLOATING QUICK SOS BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* POPUP CONTACT LIST */}
        {isOpen && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl w-80 space-y-3 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Siren className="text-red-600 w-5 h-5 animate-pulse" />
                <span className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                  Kontak Darurat Nasional
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {emergencyContacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.split(' ')[0]}`}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-100 dark:border-slate-750 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-xl text-white ${contact.color}`}>
                      <contact.icon size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {contact.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Panggilan Darurat Cepat</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600">
                    {contact.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* MAIN TOGGLE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xl shadow-red-600/30 hover:scale-105 transition-all border border-red-500"
          title="Buka Panggilan Darurat"
        >
          <Siren size={18} className="animate-pulse" />
          <span>{isOpen ? 'Tutup SOS' : 'Panggilan Darurat (SOS)'}</span>
        </button>
      </div>

      {/* FULL CONTACT SECTION AT BOTTOM (FOR DIRECT ANCHOR #kontak-darurat) */}
      <section id="kontak-darurat" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-8 sm:p-12 rounded-3xl border border-red-900/50 shadow-2xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                Direktori Cepat Tanggap Darurat
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Hubungi Bantuan Segera Saat Kejadian Kritis
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Gunakan nomor hotline darurat di bawah ini saat terjadi kecelakaan, kebakaran gedung, ancaman keamanan, atau musibah di lokasi kerja.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {emergencyContacts.map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.number.split(' ')[0]}`}
                  className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center transition group hover:scale-105"
                >
                  <div className={`p-2.5 rounded-2xl text-white ${c.color} mb-2 shadow`}>
                    <c.icon size={20} />
                  </div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {c.name}
                  </div>
                  <div className="text-base font-black text-red-400 mt-1 font-mono">
                    {c.number}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
