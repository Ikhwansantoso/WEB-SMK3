'use client'

import { useState, ChangeEvent } from "react"
import { createIbpr, updateIbpr } from "@/app/actions/ibpr"
import { Loader2, Save, X, Image as ImageIcon, FileText, CheckCircle, Trash2 } from "lucide-react"

type IbprData = {
    id?: string
    lokasi: string
    aktivitas: string
    bahaya: string
    peluang: string
    penanganan: string
}

export default function IbprForm({
    initialData,
    prefilledLocation,
    onClose
}: {
    initialData?: IbprData | null
    prefilledLocation?: string | null
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [pdfName, setPdfName] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        // Force lokasi value if prefilled
        if (!initialData && prefilledLocation) {
            formData.set('lokasi', prefilledLocation)
        }

        if (initialData?.id) {
            await updateIbpr(initialData.id, formData)
        } else {
            await createIbpr(formData)
        }

        setLoading(false)
        onClose()
    }

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPhotoPreview(null)
        }
    }

    const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPdfName(file.name)
        } else {
            setPdfName(null)
        }
    }

    const modalTitle = initialData
        ? "Edit Data IBPR"
        : prefilledLocation
            ? `Tambah Aktivitas: ${prefilledLocation}`
            : "Tambah Area / Aktivitas Baru"

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">
                    {modalTitle}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider">Lokasi / Area</label>
                        <input
                            name="lokasi"
                            defaultValue={initialData?.lokasi || prefilledLocation || ""}
                            required
                            readOnly={!!prefilledLocation && !initialData}
                            placeholder="Contoh: Gudang B3"
                            className={`w-full border rounded-xl p-3 text-sm outline-none transition-all ${(prefilledLocation && !initialData)
                                    ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                    : "bg-gray-50 border-gray-300 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                }`}
                        />
                        {prefilledLocation && !initialData && (
                            <p className="text-[10px] text-blue-600 mt-1 italic font-medium">
                                * Lokasi otomatis terkunci sesuai area yang dipilih.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider">Aktivitas</label>
                        <input
                            name="aktivitas"
                            defaultValue={initialData?.aktivitas}
                            required
                            placeholder="Contoh: Pengangkatan Limbah"
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider">Bahaya</label>
                            <textarea
                                name="bahaya"
                                defaultValue={initialData?.bahaya}
                                required
                                rows={4}
                                placeholder="Contoh: Terpeleset"
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider">Peluang (Risiko)</label>
                            <textarea
                                name="peluang"
                                defaultValue={initialData?.peluang}
                                required
                                rows={4}
                                placeholder="Contoh: Cedera Punggung"
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-wider">Pengendalian (Penanganan)</label>
                        <textarea
                            name="penanganan"
                            defaultValue={initialData?.penanganan}
                            required
                            rows={3}
                            placeholder="Contoh: Pakai APD"
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        {/* Foto Upload */}
                        <div className="relative group">
                            <label className={`w-full flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${photoPreview ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400'}`}>
                                {photoPreview ? (
                                    <div className="relative w-full h-full group-hover:opacity-50 transition-opacity">
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <p className="bg-black/50 text-white px-2 py-1 rounded text-xs">Ganti Foto</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-blue-500">
                                        <ImageIcon size={24} className="mb-2" />
                                        <p className="text-xs font-semibold">Upload Foto</p>
                                        <p className="text-[10px]">JPG, PNG (Max 5MB)</p>
                                    </div>
                                )}
                                <input type="file" name="foto" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                            {photoPreview && <div className="text-center mt-1 text-[10px] text-blue-600 font-bold flex items-center justify-center gap-1"><CheckCircle size={10} /> Foto Terpilih</div>}
                        </div>

                        {/* PDF Upload */}
                        <div className="relative group">
                            <label className={`w-full flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${pdfName ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-red-50 hover:border-red-400'}`}>
                                {pdfName ? (
                                    <div className="flex flex-col items-center justify-center px-4 text-center">
                                        <FileText size={32} className="text-red-500 mb-2" />
                                        <p className="text-xs font-bold text-red-700 line-clamp-2 break-all">{pdfName}</p>
                                        <p className="text-[10px] text-red-500 mt-1">Klik untuk ganti</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-red-500">
                                        <FileText size={24} className="mb-2" />
                                        <p className="text-xs font-semibold">Upload PDF</p>
                                        <p className="text-[10px]">(Opsional)</p>
                                    </div>
                                )}
                                <input type="file" name="dokumen" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                            </label>
                            {pdfName && <div className="text-center mt-1 text-[10px] text-red-600 font-bold flex items-center justify-center gap-1"><CheckCircle size={10} /> PDF Terpilih</div>}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Simpan Data</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
