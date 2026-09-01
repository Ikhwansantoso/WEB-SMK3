'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  X, 
  Loader2, 
  Eye, 
  AlertCircle,
  SwitchCamera
} from 'lucide-react'
import toast from 'react-hot-toast'
import { stampImage } from '@/app/utils/imageStamper'

interface TimestampPhotoInputProps {
  name?: string
  required?: boolean
  label?: string
  subLabel?: string
  customDate?: string
  onChange?: (stampedFile: File | null, originalFile: File | null) => void
  onStampedUrlChange?: (url: string | null) => void
}

export default function TimestampPhotoInput({
  name = "foto",
  required = false,
  label = "Foto Bukti (Cap Waktu & Lokasi GPS Otomatis)",
  subLabel = "Foto akan otomatis dibubuhi cap waktu, koordinat GPS, dan peta lokasi.",
  customDate,
  onChange,
  onStampedUrlChange
}: TimestampPhotoInputProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [rawPhotoFile, setRawPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // GPS info
  const [gpsData, setGpsData] = useState<{
    lat: string | null
    lng: string | null
    address: string
  }>({
    lat: null,
    lng: null,
    address: ""
  })

  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const hiddenOriginalInputRef = useRef<HTMLInputElement>(null)
  const filePickerRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Helper detect current GPS
  const getCurrentLocation = (): Promise<{ lat: string | null; lng: string | null; address: string }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: null, lng: null, address: "" })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toString()
          const lng = pos.coords.longitude.toString()
          let address = ""
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            if (res.ok) {
              const data = await res.json()
              address = data.display_name || ""
            }
          } catch {
            // ignore network fail for reverse geocode
          }
          resolve({ lat, lng, address })
        },
        () => {
          resolve({ lat: null, lng: null, address: "" })
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    })
  }

  // Stamp a selected file (incorporating customDate from form)
  const processAndStamp = async (rawFile: File, dateOverride?: string) => {
    try {
      setIsProcessing(true)
      toast.loading("Membubuhkan cap waktu & koordinat GPS...", { id: "stamping-toast" })

      // Simpan file asli tanpa stamp
      setRawPhotoFile(rawFile)

      // Detect location
      const loc = await getCurrentLocation()
      setGpsData(loc)

      // Gunakan tanggal dari form jika diisi, jika tidak baru waktu sekarang
      const targetDate = dateOverride || customDate
      const takenAt = targetDate ? new Date(targetDate).toISOString() : new Date().toISOString()
      const desc = "DOKUMENTASI K3 TELKOM INDONESIA"

      const stampedBlob = await stampImage(
        rawFile,
        loc.lat,
        loc.lng,
        desc,
        loc.address,
        takenAt
      )

      if (stampedBlob) {
        const finalFileName = `TIMESTAMP_${Date.now()}_${rawFile.name.replace(/\.[^/.]+$/, "")}.jpg`
        const finalFile = new File([stampedBlob], finalFileName, { type: "image/jpeg" })
        const url = URL.createObjectURL(stampedBlob)

        setPhotoFile(finalFile)
        setPreviewUrl(url)

        // 1. Update input hidden foto ber-timestamp (untuk server action)
        if (hiddenInputRef.current) {
          const dt = new DataTransfer()
          dt.items.add(finalFile)
          hiddenInputRef.current.files = dt.files
        }

        // 2. Update input hidden foto asli tanpa timestamp (untuk server action)
        if (hiddenOriginalInputRef.current) {
          const dtOrig = new DataTransfer()
          dtOrig.items.add(rawFile)
          hiddenOriginalInputRef.current.files = dtOrig.files
        }

        if (onChange) onChange(finalFile, rawFile)
        if (onStampedUrlChange) onStampedUrlChange(url)

        toast.dismiss("stamping-toast")
        toast.success("Foto berhasil diberi cap Timestamp & GPS!")
      } else {
        // Fallback to original
        setPhotoFile(rawFile)
        const url = URL.createObjectURL(rawFile)
        setPreviewUrl(url)
        if (hiddenInputRef.current) {
          const dt = new DataTransfer()
          dt.items.add(rawFile)
          hiddenInputRef.current.files = dt.files
        }
        if (onChange) onChange(rawFile, rawFile)
        if (onStampedUrlChange) onStampedUrlChange(url)

        toast.dismiss("stamping-toast")
        toast.error("Gagal menempelkan stamp, foto asli digunakan.")
      }
    } catch (err) {
      console.error("Stamping error:", err)
      toast.dismiss("stamping-toast")
      toast.error("Terjadi kendala saat memproses cap foto.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Jika user mengubah tanggal di form setelah foto diambil, otomatis stamp ulang dengan tanggal baru!
  useEffect(() => {
    if (rawPhotoFile && customDate) {
      processAndStamp(rawPhotoFile, customDate)
    }
  }, [customDate])

  // File Picker change
  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Berkas harus berupa gambar (JPG/PNG)!")
      return
    }

    await processAndStamp(file)
  }

  // Camera Management
  const startCamera = async () => {
    try {
      stopCamera()
      setIsCameraActive(true)

      let mediaStream: MediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
      } catch {
        // Fallback for laptop / PC webcams without facingMode
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
      }

      streamRef.current = mediaStream

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        try {
          await videoRef.current.play()
        } catch (e) {
          console.warn("Auto play warning:", e)
        }
      }
    } catch (err) {
      console.error("Camera access error:", err)
      toast.error("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser.")
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const toggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment"
    setFacingMode(nextMode)
  }

  useEffect(() => {
    if (isCameraActive) {
      startCamera()
    }
  }, [facingMode])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !streamRef.current) return

    const video = videoRef.current
    const w = video.videoWidth || video.clientWidth || 1280
    const h = video.videoHeight || video.clientHeight || 720
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(video, 0, 0, w, h)
      canvas.toBlob(async (blob) => {
        if (blob) {
          const rawFile = new File([blob], `CAMERA_${Date.now()}.jpg`, { type: "image/jpeg" })
          stopCamera()
          await processAndStamp(rawFile)
        }
      }, "image/jpeg", 0.92)
    }
  }

  const handleReset = () => {
    setPhotoFile(null)
    setRawPhotoFile(null)
    setPreviewUrl(null)
    setGpsData({ lat: null, lng: null, address: "" })
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = ""
    }
    if (hiddenOriginalInputRef.current) {
      hiddenOriginalInputRef.current.value = ""
    }
    if (filePickerRef.current) {
      filePickerRef.current.value = ""
    }
    if (onChange) onChange(null, null)
    if (onStampedUrlChange) onStampedUrlChange(null)
  }

  return (
    <div className="space-y-2">
      {/* Label section */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Camera size={14} className="text-red-600 dark:text-red-400" />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {photoFile && (
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 size={11} /> Timestamp Terverifikasi
          </span>
        )}
      </div>
      {subLabel && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-1">
          {subLabel}
        </p>
      )}

      {/* Hidden input for Native Form Submission (Foto Ber-Timestamp) */}
      <input 
        type="file" 
        name={name} 
        ref={hiddenInputRef} 
        className="hidden" 
        tabIndex={-1} 
        required={required && !photoFile}
      />

      {/* Hidden input for Native Form Submission (Foto Asli Tanpa Timestamp) */}
      <input 
        type="file" 
        name={`${name}Original`} 
        ref={hiddenOriginalInputRef} 
        className="hidden" 
        tabIndex={-1} 
      />

      {/* Hidden file picker input */}
      <input 
        type="file" 
        ref={filePickerRef} 
        accept="image/*" 
        onChange={handleFilePicked} 
        className="hidden" 
      />

      {/* LIVE CAMERA VIEWPORT */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-red-500 bg-black aspect-video flex flex-col items-center justify-center shadow-lg">
          <video 
            ref={(el) => {
              videoRef.current = el
              if (el && streamRef.current && el.srcObject !== streamRef.current) {
                el.srcObject = streamRef.current
                el.play().catch(() => {})
              }
            }}
            autoPlay 
            muted
            playsInline 
            className="w-full h-full object-cover"
          />

          {/* Camera controls overlay */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Kamera Timestamp Live
          </div>

          <button
            type="button"
            onClick={toggleFacingMode}
            className="absolute top-3 right-12 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition"
            title="Ganti Kamera Depan/Belakang"
          >
            <SwitchCamera size={18} />
          </button>

          <button
            type="button"
            onClick={stopCamera}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition"
            title="Tutup Kamera"
          >
            <X size={18} />
          </button>

          {/* Shutter Button */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full border-4 border-red-600 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              title="Ambil Foto"
            >
              <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center text-white">
                <Camera size={22} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* LOADING STATE WHEN PROCESSING STAMP */}
      {isProcessing && (
        <div className="border-2 border-dashed border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Memproses Cap Timestamp & GPS...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Menyematkan peta, alamat, waktu resmi, dan watermark K3 Telkom.</p>
          </div>
        </div>
      )}

      {/* RESULT PREVIEW (AFTER STAMPED) */}
      {!isCameraActive && !isProcessing && previewUrl && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-3">
          <div className="relative group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950 aspect-video md:aspect-[16/10] max-h-72">
            <img 
              src={previewUrl} 
              alt="Foto Bukti Timestamp" 
              className="w-full h-full object-contain mx-auto"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <Eye size={14} /> Lihat Penuh
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <RefreshCw size={14} /> Ambil Ulang
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={14} />
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                {photoFile?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                Perbesar
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold"
              >
                Ganti Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INITIAL BUTTONS (WHEN NO PHOTO LOADED & CAMERA OFF) */}
      {!isCameraActive && !isProcessing && !previewUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Camera Button */}
          <button
            type="button"
            onClick={startCamera}
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-red-500/80 bg-red-50/50 hover:bg-red-100/60 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Camera size={18} />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm">Buka Kamera Timestamp</span>
              <span className="text-[10px] text-red-600/70 dark:text-red-400/70 font-normal">Foto langsung dengan cap GPS</span>
            </div>
          </button>

          {/* 2. File Upload Button */}
          <button
            type="button"
            onClick={() => filePickerRef.current?.click()}
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-400 dark:border-slate-700 dark:hover:border-red-500 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={18} />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm text-slate-800 dark:text-slate-100">Unggah dari Galeri</span>
              <span className="text-[10px] text-slate-400 font-normal">Otomatis dibubuhi cap waktu</span>
            </div>
          </button>
        </div>
      )}

      {/* FULLSIZE PREVIEW MODAL */}
      {isPreviewModalOpen && previewUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-2 flex flex-col">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
              title="Tutup"
            >
              <X size={20} />
            </button>
            <div className="max-h-[80vh] overflow-auto flex items-center justify-center p-2">
              <img 
                src={previewUrl} 
                alt="Preview Timestamp Penuh" 
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </div>
            <div className="p-3 text-center text-xs text-slate-300 font-medium">
              Hasil foto bukti dengan cap waktu K3 Telkom resmi.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
