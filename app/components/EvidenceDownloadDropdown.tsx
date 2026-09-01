'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Download, ExternalLink, Eye, ChevronDown, CheckCircle2, Image as ImageIcon, X } from 'lucide-react'
import { parsePhotoEvidence } from '@/app/utils/photoParser'

interface EvidenceDownloadDropdownProps {
  photoData: string | null | undefined
}

export default function EvidenceDownloadDropdown({ photoData }: EvidenceDownloadDropdownProps) {
  const { stamped, original, primary, hasBoth } = parsePhotoEvidence(photoData)
  const [isOpen, setIsOpen] = useState(false)
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!primary) {
    return <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
  }

  // If only 1 file exists, simple link / button
  if (!hasBoth) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <a
          href={primary}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold inline-flex items-center gap-1"
        >
          Lihat <ExternalLink size={11} />
        </a>
        <a
          href={primary}
          download={`BUKTI_${Date.now()}.jpg`}
          title="Unduh Berkas"
          className="p-1 text-slate-400 hover:text-red-600 transition"
        >
          <Download size={12} />
        </a>
      </div>
    )
  }

  // If both exist, dropdown selector
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition shadow-sm"
      >
        <ImageIcon size={12} />
        Bukti (2 Versi)
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-1.5 space-y-1 text-left">
          <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Pilihan Unduhan Bukti
          </div>

          {/* Stamped download */}
          {stamped && (
            <a
              href={stamped}
              download={`BUKTI_TIMESTAMP_${Date.now()}.jpg`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-2 px-2.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg transition"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Ber-Timestamp (GPS)
              </span>
              <Download size={13} />
            </a>
          )}

          {/* Original download */}
          {original && (
            <a
              href={original}
              download={`BUKTI_ASLI_${Date.now()}.jpg`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-2 px-2.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition"
            >
              <span className="flex items-center gap-1.5">
                <ImageIcon size={13} className="text-slate-500" />
                Foto Asli (Mentah)
              </span>
              <Download size={13} />
            </a>
          )}

          <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

          {/* Preview action */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setPreviewModalUrl(stamped || primary)
            }}
            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition"
          >
            <Eye size={13} /> Pratinjau di Layar
          </button>
        </div>
      )}

      {/* Modal Preview */}
      {previewModalUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 p-2 flex flex-col">
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X size={18} />
            </button>
            <div className="max-h-[80vh] overflow-auto flex items-center justify-center p-2">
              <img src={previewModalUrl} alt="Preview Bukti" className="max-w-full max-h-full object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
