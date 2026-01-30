"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useState, useRef, useEffect, Suspense } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  RefreshCcw,
  PenTool,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  LayoutTemplate,
  FileText,
  Stamp,
  CheckSquare,
  Save,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// TIPE TEMPLATE
type TemplateType = "UNDANGAN" | "LAPORAN";

export default function SuratPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Memuat Editor...</div>}
    >
      <style jsx global>{`
        :root {
          /* Kita paksa warna jadi standar (Hex/HSL) khusus di halaman ini */
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --primary: 0 72% 51%; /* Merah Telkom */
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --card: 0 0% 100%;
          --ring: 0 72% 51%;
          --radius: 0.5rem;
        }
      `}</style>
      <SuratEditor />
    </Suspense>
  );
}

function SuratEditor() {
  const componentRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Cek ID di URL untuk menentukan Mode (Buat Baru vs Lihat Arsip)
  const arsipId = searchParams.get("id");
  const isViewMode = !!arsipId;

  const getToday = () =>
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // --- STATE CONFIG ---
  const [zoom, setZoom] = useState(0.7);
  const [activeTab, setActiveTab] = useState<"HEADER" | "ISI" | "FOOTER">(
    "HEADER",
  );
  const [template, setTemplate] = useState<TemplateType>("UNDANGAN");

  // --- STATE DATA ---
  const [nomorSurat, setNomorSurat] = useState(
    "C.Tel.01/UM 410/T3R-0G050000/2025",
  );
  const [lampiran, setLampiran] = useState("-");
  const [kota, setKota] = useState("Surabaya");
  const [tglTTD, setTglTTD] = useState(getToday());
  const [watermark, setWatermark] = useState("");

  // Undangan
  const [kepada, setKepada] = useState(
    "Sdr. Tim P2K3 Kantor Telkom Regional III",
  );
  const [dari, setDari] = useState("Ketua III P2K3 Kantor Telkom Regional III");
  const [perihal, setPerihal] = useState(
    "Undangan Rapat Rutin Bulanan Organisasi P2K3",
  );
  const [hari, setHari] = useState("Senin");
  const [tglAcara, setTglAcara] = useState(getToday());
  const [waktu, setWaktu] = useState("13.30 WIB – Selesai");
  const [tempat, setTempat] = useState("Ruang ATB Lt. 11 (Offline)");
  const [agenda, setAgenda] = useState("Evaluasi K3 & Laporan Insiden");
  const [pic, setPic] = useState("Aufal (08123456789)");
  const [pejabat, setPejabat] = useState("NUGROHO ADI PRACOYO");
  const [nikPejabat, setNikPejabat] = useState("NIK: 820016");
  const [tembusanUndangan, setTembusanUndangan] = useState(
    "1. Sdr. Ketua I P2K3 Kantor Telkom Regional III\n2. Sdr. Ketua II P2K3 Kantor Telkom Regional III\n3. Sdr. Sekretaris P2K3 Kantor Telkom Regional III",
  );

  // Laporan
  const [dinas, setDinas] = useState(
    "Kepala Dinas Tenaga Kerja dan Transmigrasi",
  );
  const [dinasProv, setDinasProv] = useState("Prov. Jawa Timur");
  const [alamatDinas, setAlamatDinas] = useState(
    "Jl. Dukuh Menanggal 124-126\nSurabaya",
  );
  const [triwulan, setTriwulan] = useState("I");
  const [tahun, setTahun] = useState("2025");
  const [jmlPria, setJmlPria] = useState("243");
  const [jmlWanita, setJmlWanita] = useState("197");
  const [tglP2K3, setTglP2K3] = useState("30 September 2024");
  const [jmlPengurus, setJmlPengurus] = useState(
    "14 Orang (SK. P2K3 terlampir)",
  );
  const [ketua, setKetua] = useState("NUGROHO ADI PRACOYO");
  const [sekretaris, setSekretaris] = useState("AUFAL NAWASANJANI");
  const [hambatan, setHambatan] = useState("-");
  const [saran, setSaran] = useState("-");
  const [jabatanLaporan, setJabatanLaporan] = useState(
    "Ketua III P2K3 Kantor Telkom Regional III",
  );
  const [tembusanLaporan, setTembusanLaporan] = useState(
    "1. Sdr. EVP Telkom Regional III\n2. Sdr. Sekretaris P2K3\n3. Arsip",
  );

  // --- LOAD ARSIP (READ ONLY) ---
  useEffect(() => {
    if (arsipId) {
      const savedArsip = localStorage.getItem("smk3_arsip_surat");
      if (savedArsip) {
        const list = JSON.parse(savedArsip);
        const found = list.find((item: any) => item.id === arsipId);
        if (found) {
          const d = found.data;
          setTemplate(found.type);
          setNomorSurat(d.nomorSurat);
          setLampiran(d.lampiran);
          setKota(d.kota);
          setTglTTD(d.tglTTD);
          setWatermark(d.watermark);
          setKepada(d.kepada);
          setDari(d.dari);
          setPerihal(d.perihal);
          setHari(d.hari);
          setTglAcara(d.tglAcara);
          setWaktu(d.waktu);
          setTempat(d.tempat);
          setAgenda(d.agenda);
          setPic(d.pic);
          setPejabat(d.pejabat);
          setNikPejabat(d.nikPejabat);
          setTembusanUndangan(d.tembusanUndangan);
          setDinas(d.dinas);
          setDinasProv(d.dinasProv);
          setAlamatDinas(d.alamatDinas);
          setTriwulan(d.triwulan);
          setTahun(d.tahun);
          setJmlPria(d.jmlPria);
          setJmlWanita(d.jmlWanita);
          setTglP2K3(d.tglP2K3);
          setJmlPengurus(d.jmlPengurus);
          setKetua(d.ketua);
          setSekretaris(d.sekretaris);
          setHambatan(d.hambatan);
          setSaran(d.saran);
          setJabatanLaporan(d.jabatanLaporan);
          setTembusanLaporan(d.tembusanLaporan);
        }
      }
    }
  }, [arsipId]);

  // --- SIMPAN KE ARSIP ---
  const handleSaveArsip = () => {
    const currentState = {
      nomorSurat,
      lampiran,
      kota,
      tglTTD,
      watermark,
      kepada,
      dari,
      perihal,
      hari,
      tglAcara,
      waktu,
      tempat,
      agenda,
      pic,
      pejabat,
      nikPejabat,
      tembusanUndangan,
      dinas,
      dinasProv,
      alamatDinas,
      triwulan,
      tahun,
      jmlPria,
      jmlWanita,
      tglP2K3,
      jmlPengurus,
      ketua,
      sekretaris,
      hambatan,
      saran,
      jabatanLaporan,
      tembusanLaporan,
    };

    const newArsip = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString("id-ID"),
      type: template,
      nomor: nomorSurat,
      perihal: perihal,
      data: currentState,
    };

    const existingData = localStorage.getItem("smk3_arsip_surat");
    const listArsip = existingData ? JSON.parse(existingData) : [];
    const updatedList = [newArsip, ...listArsip];

    localStorage.setItem("smk3_arsip_surat", JSON.stringify(updatedList));
    alert("✅ Surat BERHASIL disimpan ke Arsip!");
    router.push("/admin/arsip"); // Redirect ke Arsip
  };

  const handleDownloadPDF = async () => {
    if (componentRef.current === null) return;

    try {
      // 1. Convert HTML ke Gambar PNG (High Quality)
      const dataUrl = await toPng(componentRef.current, {
        cacheBust: true, // Paksa ambil gambar baru (anti-cache)
        pixelRatio: 2, // Bikin resolusi tinggi biar ga pecah
        backgroundColor: "#ffffff", // Pastikan background putih
      });

      // 2. Masukkan ke PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Surat_${nomorSurat.replace(/[\/\\:.]/g, "-")}.pdf`);
    } catch (err) {
      console.error("Gagal convert:", err);
      alert("Gagal memproses PDF. Coba refresh halaman.");
    }
  };

  // --- RENDER FORM INPUT ---
  const renderInputContent = () => {
    // TAB HEADER
    if (activeTab === "HEADER")
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Info Mode */}
          {isViewMode && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-bold mb-4 flex items-center gap-2">
              <Eye size={16} /> MODE ARSIP (Hanya Lihat & Download)
            </div>
          )}
          <div className="space-y-4">
            <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2 pb-2 border-b border-slate-100">
              <LayoutTemplate size={14} className="text-red-600" /> Kop & Tujuan
            </p>

            <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                <Stamp size={10} /> Watermark (Opsional)
              </p>
              <input
                disabled={isViewMode}
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="Masukkan NIP"
                className="w-full bg-white border-b border-slate-300 text-sm py-1 outline-none text-black placeholder:text-slate-300 disabled:bg-slate-100"
              />
            </div>

            <InputGroup
              disabled={isViewMode}
              label="Nomor Surat"
              val={nomorSurat}
              set={setNomorSurat}
            />
            <InputGroup
              disabled={isViewMode}
              label="Tanggal Surat"
              val={tglTTD}
              set={setTglTTD}
            />
            <InputGroup
              disabled={isViewMode}
              label="Lampiran"
              val={lampiran}
              set={setLampiran}
            />

            {template === "UNDANGAN" ? (
              <>
                <InputGroup
                  disabled={isViewMode}
                  label="Kepada"
                  val={kepada}
                  set={setKepada}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Dari"
                  val={dari}
                  set={setDari}
                />
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Perihal
                  </label>
                  <textarea
                    disabled={isViewMode}
                    rows={3}
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition resize-none placeholder:text-slate-300 disabled:bg-slate-50"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl mb-4 mt-2">
                  <p className="text-[10px] font-bold text-yellow-600 uppercase mb-3">
                    Tujuan Dinas
                  </p>
                  <InputGroup
                    disabled={isViewMode}
                    label="Kepada Yth"
                    val={dinas}
                    set={setDinas}
                  />
                  <InputGroup
                    disabled={isViewMode}
                    label="Provinsi"
                    val={dinasProv}
                    set={setDinasProv}
                  />
                  <div className="mt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Alamat
                    </label>
                    <textarea
                      disabled={isViewMode}
                      rows={2}
                      value={alamatDinas}
                      onChange={(e) => setAlamatDinas(e.target.value)}
                      className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition resize-none placeholder:text-slate-300 disabled:bg-slate-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    disabled={isViewMode}
                    label="Triwulan Ke"
                    val={triwulan}
                    set={setTriwulan}
                  />
                  <InputGroup
                    disabled={isViewMode}
                    label="Tahun"
                    val={tahun}
                    set={setTahun}
                  />
                </div>
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Perihal
                  </label>
                  <textarea
                    disabled={isViewMode}
                    rows={3}
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition resize-none placeholder:text-slate-300 disabled:bg-slate-50"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      );

    // TAB ISI
    if (activeTab === "ISI")
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {template === "UNDANGAN" ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2 pb-2 border-b border-slate-100">
                Detail Acara
              </p>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  disabled={isViewMode}
                  label="Hari"
                  val={hari}
                  set={setHari}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Tanggal Acara"
                  val={tglAcara}
                  set={setTglAcara}
                />
              </div>
              <InputGroup
                disabled={isViewMode}
                label="Waktu"
                val={waktu}
                set={setWaktu}
              />
              <InputGroup
                disabled={isViewMode}
                label="Tempat"
                val={tempat}
                set={setTempat}
              />
              <InputGroup
                disabled={isViewMode}
                label="Agenda"
                val={agenda}
                set={setAgenda}
              />
              <InputGroup
                disabled={isViewMode}
                label="PIC"
                val={pic}
                set={setPic}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText size={14} className="text-green-600" /> Data Laporan
              </p>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  disabled={isViewMode}
                  label="Jml Pria"
                  val={jmlPria}
                  set={setJmlPria}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Jml Wanita"
                  val={jmlWanita}
                  set={setJmlWanita}
                />
              </div>
              <InputGroup
                disabled={isViewMode}
                label="Tgl Bentuk P2K3"
                val={tglP2K3}
                set={setTglP2K3}
              />
              <InputGroup
                disabled={isViewMode}
                label="Jml Pengurus"
                val={jmlPengurus}
                set={setJmlPengurus}
              />
              <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl mt-2">
                <p className="text-[10px] font-bold text-green-600 uppercase mb-3">
                  Pengurus Inti
                </p>
                <InputGroup
                  disabled={isViewMode}
                  label="Ketua"
                  val={ketua}
                  set={setKetua}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Sekretaris"
                  val={sekretaris}
                  set={setSekretaris}
                />
              </div>
              <div className="mt-4 pt-2">
                <InputGroup
                  disabled={isViewMode}
                  label="Hambatan"
                  val={hambatan}
                  set={setHambatan}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Saran"
                  val={saran}
                  set={setSaran}
                />
              </div>
            </div>
          )}
        </div>
      );

    // TAB FOOTER
    if (activeTab === "FOOTER")
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-4">
            <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2 pb-2 border-b border-slate-100">
              Tanda Tangan
            </p>
            <InputGroup
              disabled={isViewMode}
              label="Kota (Tempat)"
              val={kota}
              set={setKota}
            />

            {template === "UNDANGAN" ? (
              <>
                <InputGroup
                  disabled={isViewMode}
                  label="Nama Pejabat"
                  val={pejabat}
                  set={setPejabat}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="NIK"
                  val={nikPejabat}
                  set={setNikPejabat}
                />
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tembusan
                  </label>
                  <textarea
                    disabled={isViewMode}
                    rows={4}
                    value={tembusanUndangan}
                    onChange={(e) => setTembusanUndangan(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition resize-none placeholder:text-slate-300 disabled:bg-slate-50"
                  />
                </div>
              </>
            ) : (
              <>
                <InputGroup
                  disabled={isViewMode}
                  label="Nama Pejabat"
                  val={ketua}
                  set={setKetua}
                />
                <InputGroup
                  disabled={isViewMode}
                  label="Jabatan"
                  val={jabatanLaporan}
                  set={setJabatanLaporan}
                />
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tembusan (Laporan)
                  </label>
                  <textarea
                    disabled={isViewMode}
                    rows={4}
                    value={tembusanLaporan}
                    onChange={(e) => setTembusanLaporan(e.target.value)}
                    className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition resize-none placeholder:text-slate-300 disabled:bg-slate-50"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans fixed inset-0 z-50">
      {/* --- SIDEBAR EDITOR (KIRI) --- */}
      <div className="w-[400px] bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20 flex-shrink-0 h-screen">
        {/* 1. HEADER SIDEBAR (FIXED) */}
        <div className="p-6 border-b border-slate-100 bg-white space-y-5 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-50 p-2.5 rounded-xl">
                <PenTool size={22} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-800 text-xl leading-none">
                  {isViewMode ? "Lihat Arsip" : "Editor Surat"}
                </h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  SMK3 System
                </p>
              </div>
            </div>
            {/* Tombol Back hanya muncul jika bukan dari sidebar */}
            <Link
              href="/admin/arsip"
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-600 transition"
            >
              <ArrowLeft size={22} />
            </Link>
          </div>

          {/* SWITCHER TEMPLATE (Hanya aktif di Mode Buat Baru) */}
          <div
            className={`bg-slate-100 p-1.5 rounded-xl flex shadow-inner ${isViewMode ? "opacity-50 pointer-events-none" : ""}`}
          >
            <button
              onClick={() => setTemplate("UNDANGAN")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${template === "UNDANGAN" ? "bg-white text-red-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
              Undangan
            </button>
            <button
              onClick={() => setTemplate("LAPORAN")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${template === "LAPORAN" ? "bg-white text-green-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}
            >
              Laporan
            </button>
          </div>
        </div>

        {/* 2. TAB NAV (FIXED) */}
        <div className="flex border-b border-slate-100 bg-white text-[11px] uppercase tracking-wide px-2 shrink-0">
          <TabButton
            label="1. Header"
            active={activeTab === "HEADER"}
            onClick={() => setActiveTab("HEADER")}
          />
          <TabButton
            label="2. Isi"
            active={activeTab === "ISI"}
            onClick={() => setActiveTab("ISI")}
          />
          <TabButton
            label="3. Penutup"
            active={activeTab === "FOOTER"}
            onClick={() => setActiveTab("FOOTER")}
          />
        </div>

        {/* 3. SCROLLABLE CONTENT (FLEX-1) */}
        <div
          className={`flex-1 overflow-y-auto p-6 custom-scrollbar bg-white ${isViewMode ? "opacity-90" : ""}`}
        >
          {renderInputContent()}
        </div>

        {/* 4. FOOTER ACTIONS (FIXED BOTTOM) */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2 shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          {isViewMode ? (
            // MODE ARSIP: Hanya boleh CETAK
            <>
             handleDownloadPDF
              <Link
                href="/admin/arsip"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition"
              >
                <ArrowLeft size={18} /> KEMBALI KE ARSIP
              </Link>
            </>
          ) : (
            // MODE EDITOR: Hanya boleh SIMPAN
            <>
              <button
                onClick={handleSaveArsip}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex justify-center items-center gap-2 transition transform active:scale-[0.98]"
              >
                <Save size={18} /> SIMPAN KE ARSIP
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                *Surat harus disimpan ke arsip sebelum diunduh.
              </p>
            </>
          )}
        </div>
      </div>

      {/* --- PREVIEW AREA (KANAN) --- */}
      <div className="flex-1 bg-slate-100 relative flex flex-col overflow-hidden">
        {/* Toolbar Zoom */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/50 flex items-center gap-4 z-30">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-bold font-mono w-12 text-center text-slate-800">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-8 pt-24 custom-scrollbar">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition:
                "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {/* === KERTAS A4 === */}
            <div
              ref={componentRef}
              className="bg-white w-[210mm] min-h-[297mm] px-[20mm] py-[15mm] text-black shadow-2xl relative font-sans text-[11pt] leading-normal"
            >
              {/* WATERMARK */}
              {watermark && (
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                  <p className="text-slate-300 text-[80pt] font-extrabold -rotate-45 opacity-40 whitespace-nowrap select-none">
                    {watermark}
                  </p>
                </div>
              )}

              {template === "UNDANGAN" && (
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <h1 className="text-2xl font-bold mt-2 font-arial pb-1">
                      Notadinas
                    </h1>
                    <img
                      src={
                        typeof window !== "undefined"
                          ? `${window.location.origin}/Telkom-logo-fu.png`
                          : "/Telkom-logo-fu.png"
                      }
                      alt="Logo"
                      crossOrigin="anonymous"
                      className="h-24 object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-[90px_10px_1fr] gap-y-1 mb-6">
                    <div>Nomor</div> <div>:</div> <div>{nomorSurat}</div>
                    <div>Kepada</div> <div>:</div> <div>{kepada}</div>
                    <div>Dari</div> <div>:</div> <div>{dari}</div>
                    <div>Lampiran</div> <div>:</div> <div>{lampiran}</div>
                    <div className="align-top">Perihal</div>
                    <div className="align-top">:</div>
                    <div className="font-bold align-top leading-snug">
                      {perihal}
                    </div>
                  </div>
                  <div className="space-y-4 text-justify mb-10">
                    <div className="flex gap-4">
                      <span className="min-w-[15px]">1.</span>
                      <p>
                        Menunjuk PP 50 tahun 2012 tentang Penerapan Sistem
                        Manajemen Keselamatan dan Kesehatan Kerja dan Prosedur
                        Mutu SMK3 Telkom Group.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="min-w-[15px]">2.</span>
                      <div className="w-full">
                        <p className="mb-4">
                          Sehubungan dengan hal tersebut diatas kami mengundang
                          Saudara untuk hadir pada:
                        </p>
                        <table className="w-full border-collapse border border-black text-sm">
                          <tbody>
                            <tr className="border-b border-black">
                              <td className="border-r border-black p-2 font-bold w-[100px]">
                                Hari
                              </td>
                              <td className="border-r border-black p-2 w-[10px]">
                                :
                              </td>
                              <td className="p-2">{hari}</td>
                            </tr>
                            <tr className="border-b border-black">
                              <td className="border-r border-black p-2 font-bold">
                                Tanggal
                              </td>
                              <td className="border-r border-black p-2">:</td>
                              <td className="p-2">{tglAcara}</td>
                            </tr>
                            <tr className="border-b border-black">
                              <td className="border-r border-black p-2 font-bold">
                                Waktu
                              </td>
                              <td className="border-r border-black p-2">:</td>
                              <td className="p-2">{waktu}</td>
                            </tr>
                            <tr className="border-b border-black">
                              <td className="border-r border-black p-2 font-bold">
                                Tempat
                              </td>
                              <td className="border-r border-black p-2">:</td>
                              <td className="p-2">{tempat}</td>
                            </tr>
                            <tr>
                              <td className="border-r border-black p-2 font-bold">
                                Agenda
                              </td>
                              <td className="border-r border-black p-2">:</td>
                              <td className="p-2">{agenda}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <span className="min-w-[15px]">3.</span>
                      <p>
                        Untuk koordinasi lebih lanjut terkait undangan ini dapat
                        menghubungi PIC kami {pic}.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="min-w-[15px]">4.</span>
                      <p>
                        Demikian kami sampaikan, atas perhatian dan kerja
                        samanya kami sampaikan terima kasih.
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 text-left">
                    <p className="mb-20">
                      {kota}, {tglTTD}
                    </p>
                    <p className="font-bold uppercase tracking-wide border-b border-black inline-block mb-1">
                      {pejabat}
                    </p>
                    <p className="font-bold">{nikPejabat}</p>
                  </div>

                  <div className="mt-8 text-[9pt]">
                    <p className="font-bold underline mb-1">Tembusan:</p>
                    <div className="whitespace-pre-wrap ml-4 leading-relaxed">
                      {tembusanUndangan}
                    </div>
                    <p className="mt-2 text-[8pt] italic">References</p>
                  </div>
                </div>
              )}

              {template === "LAPORAN" && (
                <div className="text-[10pt] relative z-10">
                  <div className="flex justify-end items-start mb-4">
                    <img
                      src={
                        typeof window !== "undefined"
                          ? `${window.location.origin}/Telkom-logo-fu.png`
                          : "/Telkom-logo-fu.png"
                      }
                      alt="Logo"
                      crossOrigin="anonymous"
                      className="h-24 object-contain"
                    />
                  </div>

                  <div className="mb-6 space-y-2">
                    <div className="grid grid-cols-[80px_10px_1fr]">
                      <div>Nomor</div> <div>:</div> <div>{nomorSurat}</div>
                    </div>
                    <div>
                      {kota}, {tglTTD}
                    </div>
                    <div className="mt-4">
                      <p>Kepada</p>
                      <p>
                        Yth. <strong>{dinas}</strong>
                      </p>
                      <p className="font-bold">{dinasProv}</p>
                      <p className="max-w-[300px] whitespace-pre-wrap">
                        {alamatDinas}
                      </p>
                    </div>
                    <div className="grid grid-cols-[80px_10px_1fr] mt-4">
                      <div>Lampiran</div> <div>:</div> <div>{lampiran}</div>
                      <div className="mt-1">Perihal</div>{" "}
                      <div className="mt-1">:</div>
                      <div className="font-bold mt-1 leading-snug">
                        {perihal}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 text-justify leading-relaxed">
                    <p className="font-bold mb-2">Dengan Hormat,</p>
                    <p className="mb-2">
                      Pertama-tama perkenankan pada kesempatan ini, kami selaku
                      perwakilan manajemen PT. Telkom Indonesia cq. Telkom
                      Regional III Jateng, DIY, Jatim, Bali, & Nusra
                      menyampaikan terima kasih atas kerja sama yang baik selama
                      ini antara PT. Telkom Indonesia (Persero) Tbk dengan Dinas
                      Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur. Kami
                      berharap semoga Saudara Pimpinan dan seluruh jajaran
                      senantiasa diberikan kesehatan dan selalu dalam lindungan
                      Tuhan Yang Maha Esa.
                    </p>
                    <p>
                      Bersama dengan surat ini, kami sampaikan laporan P2K3
                      Telkom Regional III Periode Triwulan {triwulan} Tahun{" "}
                      {tahun}, sebagai berikut:
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-black text-[9pt] mb-6">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 w-6 align-top">
                          1.
                        </td>
                        <td className="border-r border-black p-1 w-[200px] font-bold">
                          Nama Perusahaan
                        </td>
                        <td className="p-1">
                          PT. Telkom Indonesia Tbk Regional III
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          2.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Alamat
                        </td>
                        <td className="p-1">Jl. Ketintang No. 156, Surabaya</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          3.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Jumlah Tenaga Kerja
                        </td>
                        <td className="p-1">
                          Pria = {jmlPria} org, Wanita = {jmlWanita} org. Total
                          = {Number(jmlPria) + Number(jmlWanita)} org
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          4.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          P2K3 dibentuk
                        </td>
                        <td className="p-1">{tglP2K3}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          5.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Jumlah Pengurus
                        </td>
                        <td className="p-1">{jmlPengurus}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          6.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Jabatan dalam Pengurus
                        </td>
                        <td className="p-1">
                          a. Ketua: {ketua}
                          <br />
                          b. Sekretaris: {sekretaris}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          7.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Keanggotaan P2K3
                        </td>
                        <td className="p-1">Tetap</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          8.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Safety Policy
                        </td>
                        <td className="p-1">Ada</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          9.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Pelaksanaan Kegiatan
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckSquare size={12} className="text-black" />{" "}
                            <span>a. Program K3 : Ada</span>
                          </div>
                          <div className="font-bold mb-1">
                            b. Pelaksanaan Evaluasi Meliputi:
                          </div>
                          <div className="pl-5 mb-2 space-y-1">
                            <div>1. Peralatan Mesin : [☑] Ada</div>
                            <div>2. Alat Pelindung Diri (APD) : [☑] Ada</div>
                            <div>3. Pencegahan Kebakaran : [☑] Ada</div>
                            <div>4. Lingkungan Perusahaan : [☑] Ada</div>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckSquare size={12} className="text-black" />
                            <span>c. Analisa Kecelakaan : Nihil</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckSquare size={12} className="text-black" />
                            <span>d. Pelaporan Kecelakaan : Nihil</span>
                          </div>
                          <div className="font-bold mb-1">
                            e. Apakah P2K3 Melaksanakan:
                          </div>
                          <div className="pl-5 mb-2 space-y-1">
                            <div>• Latihan K3 : [☑] Ya</div>
                            <div>• Penyuluhan K3 : [☑] Ya</div>
                            <div>• Ceramah K3 : [☑] Ya</div>
                          </div>
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-2">
                              <CheckSquare size={12} /> f. Rapat Rutin : Ya
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckSquare size={12} /> g. Jadwal Rapat Disusun
                              : Ya
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckSquare size={12} /> h. Hasil Sidang
                              Diarsipkan : Ya
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckSquare size={12} /> i. Hasil Sidang
                              Ditindaklanjuti : Ya
                            </div>
                          </div>
                          <div className="font-bold mb-1">
                            j. Inspeksi Lapangan:
                          </div>
                          <div className="pl-5 mb-2 space-y-1">
                            <div>• Secara Berkala : [☑] Ya</div>
                            <div>• Sesudah Kecelakaan : [☑] Ya</div>
                          </div>
                          <div className="space-y-1">
                            <div>k. Kerja sama antar unit : Ya</div>
                            <div>l. Partisipasi Anggota : Aktif</div>
                            <div>m. Koordinasi Kegiatan : Aktif</div>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 align-top">
                          10.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Hambatan
                        </td>
                        <td className="p-1">{hambatan}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 align-top">
                          11.
                        </td>
                        <td className="border-r border-black p-1 font-bold">
                          Saran
                        </td>
                        <td className="p-1">{saran}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="mb-8">
                    Demikian disampaikan, atas perhatian dan kerjasamanya
                    diucapkan terimakasih.
                  </p>

                  <div className="mb-12 text-left">
                    <p className="font-bold">Hormat Kami,</p>
                    <div className="h-20"></div>
                    <p className="font-bold uppercase underline tracking-wide">
                      {ketua}
                    </p>
                    <p className="font-bold">{jabatanLaporan}</p>
                  </div>

                  <div className="text-[9pt]">
                    <p className="font-bold underline mb-1">Tembusan:</p>
                    <div className="whitespace-pre-wrap ml-4 leading-relaxed">
                      {tembusanLaporan}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  val,
  set,
  disabled,
}: {
  label: string;
  val: string;
  set: (s: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        disabled={disabled}
        type="text"
        value={val}
        onChange={(e) => set(e.target.value)}
        className="w-full py-2 bg-transparent border-b border-slate-300 text-sm font-medium text-black outline-none focus:border-red-600 transition placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-500"
        placeholder="..."
      />
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-xs font-bold flex justify-center items-center border-b-2 transition ${active ? "border-red-600 text-red-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
    >
      {label}
    </button>
  );
}
