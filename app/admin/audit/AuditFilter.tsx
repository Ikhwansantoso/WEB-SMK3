"use client";

import { Search, FilterX } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function AuditFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Ambil state awal dari URL
    const initialSearch = searchParams.get("q") || "";
    const initialStatus = searchParams.get("status") || "ALL";
    const initialKondisi = searchParams.get("kondisi") || "ALL";

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [statusParam, setStatusParam] = useState(initialStatus);
    const [kondisiParam, setKondisiParam] = useState(initialKondisi);

    // Debounce untuk Search Input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            createQueryString("q", searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "ALL") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router]
    );

    const resetFilter = () => {
        setSearchTerm("");
        setStatusParam("ALL");
        setKondisiParam("ALL");
        router.push(pathname);
    };

    const hasActiveFilter =
        searchTerm !== "" || statusParam !== "ALL" || kondisiParam !== "ALL";

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">

            {/* Kolom Pencarian */}
            <div className="relative w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari judul, lokasi, atau deskripsi..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block pl-11 p-3 outline-none transition-all placeholder:text-slate-400 font-medium"
                />
            </div>

            <div className="flex w-full lg:w-auto flex-col sm:flex-row items-center gap-3">

                {/* Dropdown Kondisi */}
                <select
                    value={kondisiParam}
                    onChange={(e) => {
                        const val = e.target.value;
                        setKondisiParam(val);
                        createQueryString("kondisi", val);
                    }}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:ring-red-500 focus:border-red-500 block p-3 pr-8 outline-none cursor-pointer w-full sm:w-auto"
                >
                    <option value="ALL">Semua Kondisi</option>
                    <option value="AMAN">Aman</option>
                    <option value="BUTUH_PERBAIKAN">Butuh Perbaikan</option>
                </select>

                {/* Dropdown Status */}
                <select
                    value={statusParam}
                    onChange={(e) => {
                        const val = e.target.value;
                        setStatusParam(val);
                        createQueryString("status", val);
                    }}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:ring-red-500 focus:border-red-500 block p-3 pr-8 outline-none cursor-pointer w-full sm:w-auto"
                >
                    <option value="ALL">Semua Status</option>
                    <option value="OPEN">Open (Belum Selesai)</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed (Selesai)</option>
                </select>

                {/* Tombol Clear Filter */}
                {hasActiveFilter && (
                    <button
                        onClick={resetFilter}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent flex-shrink-0"
                        title="Hapus Filter"
                    >
                        <FilterX size={20} />
                    </button>
                )}
            </div>

        </div>
    );
}
