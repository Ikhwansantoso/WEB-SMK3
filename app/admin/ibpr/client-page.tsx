'use client'

import { useState } from "react"
import { deleteIbpr } from "@/app/actions/ibpr"
import { Plus, Trash2, Edit, ArrowLeft, MapPin, FolderOpen, FileText, Image as ImageIcon, ChevronRight, AlertTriangle, ShieldCheck, Activity } from "lucide-react"
import IbprForm from "./form"

type IbprItem = {
    id: string
    lokasi: string
    aktivitas: string
    bahaya: string
    peluang: string
    penanganan: string
    fotoRuangan?: string | null
    dokumenIbpr?: string | null
    createdAt: Date
    updatedAt: Date
}

export default function IbprClientPage({ groupedData }: { groupedData: Record<string, IbprItem[]> }) {
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<IbprItem | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (confirm("Yakin hapus data ini?")) {
            await deleteIbpr(id)
        }
    }

    const handleEdit = (item: IbprItem) => {
        setEditItem(item)
        setShowForm(true)
    }

    const handleAddNew = () => {
        setEditItem(null)
        setShowForm(true)
    }

    // Helper to format text with newlines or bullets
    const formatText = (text: string) => {
        if (!text) return "-"

        const lines = text.split(/\n| - /).filter(line => line.trim() !== "")

        if (lines.length > 1) {
            return (
                <ul className="list-disc pl-4 space-y-1">
                    {lines.map((line, idx) => (
                        <li key={idx}>{line.replace(/^-/, '').trim()}</li>
                    ))}
                </ul>
            )
        }
        return text
    }

    return (
        <div className="space-y-8">
            {/* Header / Top Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                {selectedLocation ? (
                    <div>
                        <button
                            onClick={() => setSelectedLocation(null)}
                            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-2 text-sm"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Daftar Area
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="text-blue-600" />
                            Area: {selectedLocation}
                        </h1>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Dokumen IBPR</h1>
                        <p className="text-slate-500">Identifikasi Bahaya dan Pengendalian Risiko</p>
                    </div>
                )}

                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 w-full md:w-auto justify-center"
                >
                    <Plus size={20} />
                    {selectedLocation ? "Tambah Aktivitas Bar" : "Tambah Area Baru"}
                </button>
            </div>

            {Object.keys(groupedData).length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen size={32} />
                    </div>
                    <p className="text-slate-900 font-bold text-lg">Belum ada data IBPR.</p>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">Data yang Anda tambahkan akan muncul di sini. Mulailah dengan menambahkan area kerja.</p>
                </div>
            ) : (
                <>
                    {/* VIEW 1: LOCATION GRID (CARD STYLE) */}
                    {!selectedLocation && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Object.entries(groupedData).map(([lokasi, items]) => (
                                <div
                                    key={lokasi}
                                    onClick={() => setSelectedLocation(lokasi)}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
                                >
                                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                                <MapPin size={24} />
                                            </div>
                                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700">
                                                {items.length} Aktivitas
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-700 line-clamp-2">
                                            {lokasi}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1">
                                            Klik untuk detail bahaya & risiko.
                                        </p>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-600 group-hover:text-blue-600">
                                            <span>Lihat Detail</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* VIEW 2: ACTIVITY LIST (CARD STYLE) */}
                    {selectedLocation && groupedData[selectedLocation] && (
                        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4">
                            {groupedData[selectedLocation].map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">

                                    {/* Left: Photo & Info */}
                                    <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 flex flex-col p-4 shrink-0">
                                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 mb-3 group">
                                            {item.fotoRuangan ? (
                                                <>
                                                    <img
                                                        src={item.fotoRuangan}
                                                        alt={item.aktivitas}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <a href={item.fotoRuangan} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-medium text-xs gap-1">
                                                        <ImageIcon size={14} /> Perbesar
                                                    </a>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">
                                            {item.aktivitas}
                                        </h3>

                                        <div className="mt-auto pt-3 flex flex-col gap-2">
                                            {item.dokumenIbpr && (
                                                <a href={item.dokumenIbpr} target="_blank" className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                                                    <FileText size={14} /> Dokumen PDF
                                                </a>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <button onClick={() => handleEdit(item)} className="flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:border-red-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={14} /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Details (Hazard, Risk, Control) */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3 text-red-600 font-bold text-xs uppercase tracking-wider">
                                                <AlertTriangle size={16} /> Bahaya
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium leading-relaxed">
                                                {formatText(item.bahaya)}
                                            </div>
                                        </div>

                                        <div className="p-5 bg-gradient-to-b from-transparent to-orange-50/30">
                                            <div className="flex items-center gap-2 mb-3 text-orange-600 font-bold text-xs uppercase tracking-wider">
                                                <Activity size={16} /> Peluang (Risiko)
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium leading-relaxed">
                                                {formatText(item.peluang)}
                                            </div>
                                        </div>

                                        <div className="p-5 bg-gradient-to-b from-transparent to-green-50/30">
                                            <div className="flex items-center gap-2 mb-3 text-green-600 font-bold text-xs uppercase tracking-wider">
                                                <ShieldCheck size={16} /> Pengendalian
                                            </div>
                                            <div className="text-sm text-slate-700 font-medium leading-relaxed">
                                                {formatText(item.penanganan)}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showForm && (
                <IbprForm
                    initialData={editItem}
                    prefilledLocation={selectedLocation}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    )
}
