'use client'

import React, { useState } from 'react'
import { Download, Eye, Image as ImageIcon, MapPin, Clock, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { parsePhotoEvidence } from '@/app/utils/photoParser'

interface EvidencePhotoCardProps {
  photoData: string | null | undefined
  title?: string
}

export default function EvidencePhotoCard({ photoData, title = "Foto Bukti" }: EvidencePhotoCardProps) {
  const { stamped, original, primary, hasBoth } = parsePhotoEvidence(photoData)
  const [activeTab, setActiveTab] = useState<'stamped' | 'original'>(stamped ? 'stamped' : 'original')
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  if (!primary) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
        <ImageIcon size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Tidak ada foto bukti terlampir</p>
      </div>
    )
  }

  const currentDisplayUrl = (activeTab === 'original' && original) ? original : (stamped || primary)

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon size={16} className="text-red-600 dark:text-red-400" />
            {title}
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {hasBoth 
              ? "Tersedia 2 versi berkas: dengan cap resmi & foto asli" 
              : "Berkas foto bukti dokumentasi"}
          </p>
        </div>

        {/* Tab switch if both available */}
        {hasBoth && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('stamped')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'stamped'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Ber-Timestamp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'original'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Foto Asli
            </button>
          </div>
        )}
      </div>

      {/* Image Preview Box */}
      <div className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 aspect-video md:aspect-[16/10] max-h-80 flex items-center justify-center">
        <img
          src={currentDisplayUrl}
          alt="Bukti Dokumentasi"
          className="max-h-full max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {activeTab === 'stamped' && stamped ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow flex items-center gap-1">
              <CheckCircle2 size={12} /> Cap Timestamp & GPS
            </span>
          ) : (
            <span className="bg-slate-800/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow flex items-center gap-1">
              Foto Asli (Mentah)
            </span>
          )}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="px-4 py-2 bg-white/95 text-slate-900 text-xs font-bold rounded-xl shadow-lg hover:bg-white flex items-center gap-1.5 transition active:scale-95"
          >
            <Eye size={14} /> Lihat Penuh
          </button>
        </div>
      </div>

      {/* Download Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {stamped && (
          <a
            href={stamped}
            download={`BUKTI_TIMESTAMP_${Date.now()}.jpg`}
            className="flex-1 min-w-[170px] flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-95"
          >
            <Download size={15} /> Download Ber-Timestamp
          </a>
        )}

        {original && (
          <a
            href={original}
            download={`BUKTI_ASLI_${Date.now()}.jpg`}
            className="flex-1 min-w-[170px] flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition active:scale-95"
          >
            <Download size={15} /> Download Foto Asli
          </a>
        )}

        {!hasBoth && !original && stamped && (
          <a
            href={stamped}
            download={`BUKTI_${Date.now()}.jpg`}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-95"
          >
            <Download size={15} /> Download Foto Bukti
          </a>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-3 flex flex-col">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
              title="Tutup"
            >
              <X size={20} />
            </button>
            <div className="max-h-[82vh] overflow-auto flex items-center justify-center p-2">
              <img
                src={currentDisplayUrl}
                alt="Zoom Bukti"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </div>
            <div className="p-3 flex items-center justify-between gap-2 text-xs text-slate-300 font-medium">
              <span>{activeTab === 'stamped' ? 'Mode: Foto Ber-Timestamp & GPS' : 'Mode: Foto Asli Mentah'}</span>
              <a
                href={currentDisplayUrl}
                download
                className="text-red-400 hover:underline font-bold flex items-center gap-1"
              >
                <Download size={13} /> Unduh Berkas Ini
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
