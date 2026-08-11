'use client'

import React, { useState, useEffect, useRef } from "react"
import { X, Camera, Upload, MapPin, RefreshCw, Download, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { stampImage } from "@/app/utils/imageStamper"

interface TimestampModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TimestampModal({ isOpen, onClose }: TimestampModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // GPS & Address
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [takenAt, setTakenAt] = useState("")
  const [detectingGps, setDetectingGps] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Webcam Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTakenAt(new Date().toISOString().slice(0, 19))
      detectLocation()
    } else {
      stopCamera()
      resetForm()
    }
  }, [isOpen])

  // Monitor tab change to manage camera stream
  useEffect(() => {
    if (activeTab === 'camera' && isOpen) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [activeTab])

  const resetForm = () => {
    setImageFile(null)
    setImagePreview(null)
    setLat("")
    setLng("")
    setAddress("")
    setDescription("")
  }

  const startCamera = async () => {
    try {
      stopCamera()
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraActive(true)
    } catch (err) {
      console.error("Camera access error:", err)
      toast.error("Gagal mengakses kamera. Silakan pilih tab Unggah Foto.")
      setActiveTab('upload')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !stream) return

    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" })
          setImageFile(file)
          setImagePreview(URL.createObjectURL(blob))
          stopCamera()
        }
      }, "image/jpeg", 0.9)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar!")
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung oleh browser Anda.")
      return
    }

    setDetectingGps(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude.toString()
        const longitude = position.coords.longitude.toString()
        setLat(latitude)
        setLng(longitude)
        
        try {
          // Reverse geocode via free OSM Nominatim API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          if (res.ok) {
            const data = await res.json()
            setAddress(data.display_name || "")
          }
        } catch (err) {
          console.warn("Reverse geocode failed", err)
        } finally {
          setDetectingGps(false)
        }
      },
      (error) => {
        console.error("GPS Error:", error)
        toast.error("Gagal mendeteksi lokasi GPS.")
        setDetectingGps(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleDownload = async () => {
    if (!imageFile) {
      toast.error("Silakan ambil atau unggah foto terlebih dahulu!")
      return
    }

    try {
      setProcessing(true)
      const stampedBlob = await stampImage(
        imageFile,
        lat || null,
        lng || null,
        description,
        address,
        takenAt
      )

      if (stampedBlob) {
        const url = URL.createObjectURL(stampedBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `stamped_${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success("Foto berstempel berhasil dibuat!")
      } else {
        toast.error("Gagal memproses gambar.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Terjadi kesalahan saat memproses gambar.")
    } finally {
      setProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-red-800 to-red-600 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-xs sm:text-base">Dokumentasi Kamera Timestamp</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/50 dark:bg-slate-950/50">
          
          {/* SISI KIRI: PENGAMBILAN GAMBAR */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700 shrink-0">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                  activeTab === 'upload' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm border border-slate-200/40 dark:border-slate-650' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Upload size={13} /> Unggah Foto
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                  activeTab === 'camera' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm border border-slate-200/40 dark:border-slate-650' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Camera size={13} /> Ambil Kamera
              </button>
            </div>

            {/* BOX DISPLAY */}
            <div className="flex-1 min-h-[200px] md:min-h-[250px] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
              
              {activeTab === 'upload' && !imagePreview && (
                <div className="text-center p-4 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-2.5">
                    <Upload size={22} className="text-slate-500" />
                  </div>
                  <p className="font-bold text-[11px] sm:text-xs">Pilih atau Seret Foto Dokumentasi</p>
                  <p className="text-[9px] text-slate-500 mt-1">Mendukung format JPG, PNG, atau JPEG</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}

              {activeTab === 'camera' && !imagePreview && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {cameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-lg flex items-center justify-center"
                      title="Ambil Foto"
                    >
                      <Camera size={18} />
                    </button>
                  )}
                </div>
              )}

              {imagePreview && (
                <div className="w-full h-full relative flex items-center justify-center p-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-[240px] md:max-h-[350px] object-contain select-none rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      if (activeTab === 'camera') startCamera()
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
                    title="Ulangi Foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SISI KANAN: FORM METADATA */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
            <div className="space-y-3 sm:space-y-4">
              {/* GPS Lokasi */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Kombinasi Koordinat GPS</span>
                  <button
                    onClick={detectLocation}
                    disabled={detectingGps}
                    className="text-[9px] font-black text-red-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <RefreshCw size={9} className={detectingGps ? "animate-spin" : ""} />
                    {detectingGps ? "Mencari..." : "Segarkan GPS"}
                  </button>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat Fisik */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alamat Lokasi</label>
                <textarea
                  placeholder="Alamat akan terisi otomatis dari GPS..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-2.5 rounded-lg sm:rounded-xl outline-none focus:border-red-500 transition resize-none"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Waktu Pengambilan</label>
                <input
                  type="datetime-local"
                  value={takenAt}
                  onChange={(e) => setTakenAt(e.target.value)}
                  className="w-full text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-2.5 rounded-lg sm:rounded-xl outline-none focus:border-red-500 transition"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi / Keterangan Temuan</label>
                <textarea
                  placeholder="Masukkan keterangan foto dokumentasi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-2.5 rounded-lg sm:rounded-xl outline-none focus:border-red-500 transition resize-none"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2 sm:gap-3">
              <button
                onClick={resetForm}
                className="flex-1 py-2 sm:py-3 px-3 sm:px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 transition"
              >
                Reset
              </button>
              <button
                onClick={handleDownload}
                disabled={processing || !imageFile}
                className="flex-[2] py-2 sm:py-3 px-3 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold shadow-md shadow-red-600/10 hover:shadow-red-600/20 transition flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                {processing ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Stempel...
                  </>
                ) : (
                  <>
                    <Download size={13} /> Stempel & Unduh
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
