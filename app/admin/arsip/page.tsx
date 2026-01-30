"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Trash2,
  Archive,
  Download,
  Plus,
  CheckSquare,
  ArrowLeft,
  Send,
  Settings,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";

export default function ArsipPage() {
  const [listArsip, setListArsip] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // STATE TELEGRAM
  const [showTelModal, setShowTelModal] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState({
    botToken: "",
    chatId: "",
  });
  const [selectedItemForTel, setSelectedItemForTel] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState("");

  // STATE PRINTING
  const [printData, setPrintData] = useState<any>(null);
  const printComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("smk3_arsip_surat");
    const savedConfig = localStorage.getItem("smk3_telegram_config");

    if (savedData) setListArsip(JSON.parse(savedData));
    if (savedConfig) setTelegramConfig(JSON.parse(savedConfig));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus dokumen ini selamanya?")) {
      const updated = listArsip.filter((item) => item.id !== id);
      setListArsip(updated);
      localStorage.setItem("smk3_arsip_surat", JSON.stringify(updated));
    }
  };

  const handleOpenTelegram = (item: any) => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setSelectedItemForTel(item);
      setShowTelModal(true);
    } else {
      generateAndSendPDF(item, telegramConfig.botToken, telegramConfig.chatId);
    }
  };

  const saveConfigAndSend = () => {
    localStorage.setItem(
      "smk3_telegram_config",
      JSON.stringify(telegramConfig)
    );
    setShowTelModal(false);
    alert("Pengaturan Telegram berhasil disimpan!");
    if (selectedItemForTel) {
      generateAndSendPDF(
        selectedItemForTel,
        telegramConfig.botToken,
        telegramConfig.chatId
      );
    }
  };

  // 🔥 FUNGSI GENERATE PDF (ANTI ERROR OPT & ALIGNMENT FIX) 🔥
  const generateAndSendPDF = async (
    item: any,
    token: string,
    chatId: string
  ) => {
    setIsSending(true);
    setSendingStatus("Menyiapkan dokumen...");

    const dataToPrint = { ...item.data, savedTemplateType: item.type };
    setPrintData(dataToPrint);

    setTimeout(async () => {
      try {
        const element = printComponentRef.current;
        if (!element) throw new Error("Template tidak ditemukan");

        setSendingStatus("Mengonversi ke PDF (HD)...");

        // FIX: Import library dengan casting 'any' agar tidak error TypeScript
        const html2pdfModule = await import("html2pdf.js");
        const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

        // FIX: Konfigurasi OPT dibuat explisit sebagai object 'any'
        const opt: any = {
          margin: [0, 0, 0, 0], // Margin 0 agar layout dikontrol CSS
          filename: `Surat_${item.nomor.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2, 
            useCORS: true, 
            scrollY: 0,
            windowWidth: 1200, 
            letterRendering: true,
            // Abaikan CSS global biar tidak error lab/oklch
            ignoreElements: (node: any) => node.tagName === 'STYLE' || node.tagName === 'LINK',
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };

        // FIX: Panggil library dengan rantai method yang aman
        const worker = html2pdf().set(opt).from(element);
        const pdfBlob = await worker.output("blob");

        if (pdfBlob.size > 49 * 1024 * 1024) {
          throw new Error("Ukuran file > 50MB. Telegram menolak.");
        }

        setSendingStatus("Mengirim ke Telegram...");

        const formData = new FormData();
        const safeFilename = opt.filename;
        formData.append("chat_id", chatId);
        formData.append("document", pdfBlob, safeFilename);

        let headerTitle = "📄 DOKUMEN BARU";
        let messagePerihal = item.perihal;

        if (item.type === "UNDANGAN") {
          headerTitle = "📢 UNDANGAN RAPAT DINAS";
        } else if (item.type === "LAPORAN") {
          headerTitle = "📑 LAPORAN TRIWULAN P2K3";
          const d = item.data;
          messagePerihal = `Laporan Triwulanan P2K3 Telkom Regional III Periode Triwulan-${d.triwulan} Tahun ${d.tahun}`;
        }

        const caption = `
${headerTitle}
--------------------------------
📌 *Nomor:* ${item.nomor}
📝 *Perihal:* ${messagePerihal}

_Dokumen PDF terlampir._
`.trim();

        formData.append("caption", caption);
        formData.append("parse_mode", "Markdown");

        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendDocument`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (result.ok) {
          alert("✅ Sukses! File PDF telah dikirim.");
        } else {
          alert("❌ Gagal kirim: " + result.description);
          if (result.error_code === 401 || result.error_code === 400)
            setShowTelModal(true);
        }
      } catch (error: any) {
        console.error(error);
        alert(`❌ Error: ${error.message || "Gagal memproses."}`);
      } finally {
        setIsSending(false);
        setSendingStatus("");
        setPrintData(null);
        setSelectedItemForTel(null);
      }
    }, 1500);
  };

  // --- PRINT MANUAL ---
  const handleDownloadClick = (item: any) => {
    const dataToPrint = { ...item.data, savedTemplateType: item.type };
    setPrintData(dataToPrint);
    setTimeout(() => {
        const handlePrint = useReactToPrint({
            contentRef: printComponentRef,
            documentTitle: `Surat_${item.nomor.replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
        handlePrint();
    }, 500);
  };

  const filteredList = listArsip.filter(
    (item) =>
      (item.nomor &&
        item.nomor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.perihal &&
        item.perihal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans relative">
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --primary: 0 72% 51%;
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
          --ring: 0 72% 51%;
          --radius: 0.5rem;
        }
      `}</style>

      {/* LOADING OVERLAY */}
      {isSending && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-lg font-bold">{sendingStatus}</p>
          <p className="text-sm text-slate-300">
            Mohon tunggu, sedang memproses...
          </p>
        </div>
      )}

      {/* MODAL CONFIG */}
      {showTelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[400px] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Settings size={18} /> Pengaturan Telegram
              </h3>
              <button
                onClick={() => setShowTelModal(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded border">
              Masukkan <b>Bot Token</b> dan <b>Chat ID</b> agar sistem bisa
              mengirim PDF otomatis ke Grup Telegram.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Contoh: 123456:ABC-Def..."
                value={telegramConfig.botToken}
                onChange={(e) =>
                  setTelegramConfig({
                    ...telegramConfig,
                    botToken: e.target.value,
                  })
                }
                className="w-full border p-2 rounded text-sm text-black"
              />
              <input
                type="text"
                placeholder="Contoh: -100123456789"
                value={telegramConfig.chatId}
                onChange={(e) =>
                  setTelegramConfig({
                    ...telegramConfig,
                    chatId: e.target.value,
                  })
                }
                className="w-full border p-2 rounded text-sm text-black"
              />
              <button
                onClick={saveConfigAndSend}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition mt-2"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white">
            <Archive size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">
              Arsip Surat
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
              Database Dokumen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTelModal(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-3 rounded-xl transition"
            title="Atur Telegram Bot"
          >
            <Settings size={20} />
          </button>
          <Link
            href="/admin/surat"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition transform hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> BUAT SURAT BARU
          </Link>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="p-6 flex-1 overflow-hidden flex flex-col max-w-6xl mx-auto w-full">
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari Nomor Surat atau Perihal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition shadow-sm text-sm font-medium text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 pb-10">
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group cursor-default"
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded border ${
                        item.type === "UNDANGAN"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-green-50 text-green-600 border-green-100"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      • {item.createdAt}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">
                    {item.nomor}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {item.perihal}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => handleOpenTelegram(item)}
                    disabled={isSending}
                    className="px-4 py-2.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-lg text-xs font-bold hover:bg-sky-500 hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> {isSending ? "..." : "TELEGRAM"}
                  </button>

                  <button
                    onClick={() => handleDownloadClick(item)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> PDF
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center h-full">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <Archive size={48} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-1">
                Belum ada arsip
              </h3>
              <p className="text-sm text-slate-500">
                Buat surat baru untuk melihatnya di sini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* HIDDEN TEMPLATE UNTUK PDF */}
      <div
        style={{
          position: "fixed",
          top: -10000,
          left: -10000,
          width: "210mm",
          zIndex: -50,
        }}
      >
        <div ref={printComponentRef} id="element-to-print">
          {printData && <SuratTemplate data={printData} />}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// 🔥 SURAT TEMPLATE (TABEL UNTUK HEADER = RAPI 100%) 🔥
// ===========================================
function SuratTemplate({ data }: { data: any }) {
  const templateType =
    data.savedTemplateType || (data.triwulan ? "LAPORAN" : "UNDANGAN");
  const isLaporan = templateType === "LAPORAN";

  const logoUrl = "/Telkom-logo-fu.png";

  const styles = {
    page: { 
        backgroundColor: "white", 
        width: "210mm", 
        padding: "20mm", 
        color: "black", 
        fontFamily: "Arial, sans-serif", 
        fontSize: "11pt", 
        lineHeight: "1.15", 
        position: "relative" as "relative",
        boxSizing: "border-box" as "border-box",
    },
    borderTable: { border: "1px solid black", borderCollapse: "collapse" as "collapse", width: "100%", fontSize: "10pt" },
    cell: { border: "1px solid black", padding: "4px", verticalAlign: "top" },
    logo: { height: "70px", width: "auto", objectFit: "contain" as "contain", marginRight: "5px" }, 
    
    // STYLE KHUSUS HEADER TABLE
    headerTable: {
        width: "100%",
        borderCollapse: "collapse" as "collapse",
        marginBottom: "1rem",
        fontSize: "11pt",
        border: "none",
    },
    headerCellLabel: {
        width: "90px", // Lebar kolom label
        verticalAlign: "top",
        paddingBottom: "2px",
    },
    headerCellColon: {
        width: "15px", // Lebar kolom titik dua
        verticalAlign: "top",
        paddingBottom: "2px",
    },
    headerCellValue: {
        verticalAlign: "top",
        paddingBottom: "2px",
    },
    
    watermark: {
        position: "absolute" as "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 0,
        pointerEvents: "none" as "none",
        overflow: "hidden"
    },
    watermarkText: {
        color: "#cbd5e1",
        fontSize: "80pt",
        fontWeight: "800",
        transform: "rotate(-45deg)",
        opacity: 0.4,
        userSelect: "none" as "none"
    }
  };

  return (
    <div style={styles.page}>
      {data.watermark && (
        <div style={styles.watermark}>
          <p style={styles.watermarkText}>
            {data.watermark}
          </p>
        </div>
      )}

      {!isLaporan ? (
        // --- UNDANGAN ---
        <div style={{ position: "relative", zIndex: 10 }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0.5rem", fontFamily: "Arial", margin: 0 }}>
              Notadinas
            </h1>
            <img
              src={logoUrl}
              alt="Logo"
              crossOrigin="anonymous"
              style={styles.logo}
            />
          </div>

          {/* 🔥 GANTI GRID DENGAN TABEL AGAR LURUS SEMPURNA 🔥 */}
          <table style={styles.headerTable}>
            <tbody>
                <tr>
                    <td style={styles.headerCellLabel}>Nomor</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.nomorSurat}</td>
                </tr>
                <tr>
                    <td style={styles.headerCellLabel}>Kepada</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.kepada}</td>
                </tr>
                <tr>
                    <td style={styles.headerCellLabel}>Dari</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.dari}</td>
                </tr>
                <tr>
                    <td style={styles.headerCellLabel}>Lampiran</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.lampiran}</td>
                </tr>
                <tr>
                    <td style={styles.headerCellLabel}>Perihal</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={{ ...styles.headerCellValue, fontWeight: "bold" }}>{data.perihal}</td>
                </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "justify", marginBottom: "2rem" }}>
            {/* INDENTASI POIN 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "25px 1fr", marginBottom: "0.5rem" }}>
              <span>1.</span>
              <p>
                Menunjuk PP 50 tahun 2012 tentang Penerapan Sistem Manajemen
                Keselamatan dan Kesehatan Kerja dan Prosedur Mutu SMK3 Telkom
                Group.
              </p>
            </div>
            {/* INDENTASI POIN 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "25px 1fr", marginBottom: "0.5rem" }}>
              <span>2.</span>
              <div style={{ width: "100%" }}>
                <p style={{ marginBottom: "0.5rem" }}>
                  Sehubungan dengan hal tersebut diatas kami mengundang Saudara
                  untuk hadir pada:
                </p>
                <table style={styles.borderTable} className="page-break-inside-avoid">
                  <tbody>
                    <tr>
                      <td style={{ ...styles.cell, fontWeight: "bold", width: "100px" }}>Hari</td>
                      <td style={{ ...styles.cell, width: "10px", textAlign: "center" }}>:</td>
                      <td style={styles.cell}>{data.hari}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.cell, fontWeight: "bold" }}>Tanggal</td>
                      <td style={{ ...styles.cell, textAlign: "center" }}>:</td>
                      <td style={styles.cell}>{data.tglAcara}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.cell, fontWeight: "bold" }}>Waktu</td>
                      <td style={{ ...styles.cell, textAlign: "center" }}>:</td>
                      <td style={styles.cell}>{data.waktu}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.cell, fontWeight: "bold" }}>Tempat</td>
                      <td style={{ ...styles.cell, textAlign: "center" }}>:</td>
                      <td style={styles.cell}>{data.tempat}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.cell, fontWeight: "bold" }}>Agenda</td>
                      <td style={{ ...styles.cell, textAlign: "center" }}>:</td>
                      <td style={styles.cell}>{data.agenda}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* INDENTASI POIN 3 */}
            <div style={{ display: "grid", gridTemplateColumns: "25px 1fr", marginBottom: "0.5rem" }}>
              <span>3.</span>
              <p>
                Untuk koordinasi lebih lanjut terkait undangan ini dapat
                menghubungi PIC kami {data.pic}.
              </p>
            </div>
            {/* INDENTASI POIN 4 */}
            <div style={{ display: "grid", gridTemplateColumns: "25px 1fr" }}>
              <span>4.</span>
              <p>
                Demikian kami sampaikan, atas perhatian dan kerja samanya kami
                sampaikan terima kasih.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "3rem", textAlign: "left" }} className="page-break-inside-avoid">
            <p style={{ marginBottom: "4rem" }}>
              {data.kota}, {data.tglTTD}
            </p>
            <p style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid black", display: "inline-block", marginBottom: "0.25rem" }}>
              {data.pejabat}
            </p>
            <p style={{ fontWeight: "bold" }}>{data.nikPejabat}</p>
          </div>

          <div style={{ marginTop: "1rem", fontSize: "9pt" }}>
            <p style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "0.25rem" }}>Tembusan:</p>
            <div style={{ whiteSpace: "pre-wrap", marginLeft: "1rem", lineHeight: "1.3" }}>
              {data.tembusanUndangan}
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "8pt", fontStyle: "italic" }}>References</p>
          </div>
        </div>
      ) : (
        // --- LAPORAN ---
        <div style={{ position: "relative", zIndex: 10, fontSize: "10pt" }}>
          
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <img
              src={logoUrl}
              alt="Logo"
              crossOrigin="anonymous"
              style={styles.logo}
            />
          </div>

          {/* TABEL HEADER LAPORAN */}
          <table style={styles.headerTable}>
            <tbody>
                <tr>
                    <td style={styles.headerCellLabel}>Nomor</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.nomorSurat}</td>
                </tr>
            </tbody>
          </table>

          <div style={{ marginBottom: "1.5rem" }}>
            {data.kota}, {data.tglTTD}
          </div>

          <div style={{ marginTop: "0.5rem" }}>
              <p>Kepada</p>
              <p>
                Yth. <strong>{data.dinas}</strong>
              </p>
              <p style={{ fontWeight: "bold" }}>{data.dinasProv}</p>
              <p style={{ maxWidth: "300px", whiteSpace: "pre-wrap" }}>
                {data.alamatDinas}
              </p>
          </div>

          {/* TABEL HEADER BAWAH LAPORAN */}
          <table style={{ ...styles.headerTable, marginTop: "1rem" }}>
            <tbody>
                <tr>
                    <td style={styles.headerCellLabel}>Lampiran</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={styles.headerCellValue}>{data.lampiran}</td>
                </tr>
                <tr>
                    <td style={styles.headerCellLabel}>Perihal</td>
                    <td style={styles.headerCellColon}>:</td>
                    <td style={{ ...styles.headerCellValue, fontWeight: "bold" }}>{data.perihal}</td>
                </tr>
            </tbody>
          </table>

          <div style={{ marginBottom: "1.5rem", textAlign: "justify", lineHeight: "1.4" }}>
            <p style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>Dengan Hormat,</p>
            <p style={{ marginBottom: "0.5rem" }}>
              Pertama-tama perkenankan pada kesempatan ini, kami selaku
              perwakilan manajemen PT. Telkom Indonesia cq. Telkom Regional III
              Jateng, DIY, Jatim, Bali, & Nusra menyampaikan terima kasih atas
              kerja sama yang baik selama ini antara PT. Telkom Indonesia
              (Persero) Tbk dengan Dinas Tenaga Kerja dan Transmigrasi Provinsi
              Jawa Timur. Kami berharap semoga Saudara Pimpinan dan seluruh
              jajaran senantiasa diberikan kesehatan dan selalu dalam lindungan
              Tuhan Yang Maha Esa.
            </p>
            <p>
              Bersama dengan surat ini, kami sampaikan laporan P2K3 Telkom
              Regional III Periode Triwulan {data.triwulan} Tahun {data.tahun},
              sebagai berikut:
            </p>
          </div>

          <table style={styles.borderTable}>
            <tbody>
              {/* ISI TABEL SAMA SEPERTI SEBELUMNYA */}
              <tr>
                <td style={{ ...styles.cell, width: "1.5rem" }}>1.</td>
                <td style={{ ...styles.cell, width: "200px", fontWeight: "bold" }}>
                  Nama Perusahaan
                </td>
                <td style={styles.cell}>PT. Telkom Indonesia Tbk Regional III</td>
              </tr>
              <tr>
                <td style={styles.cell}>2.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>Alamat</td>
                <td style={styles.cell}>Jl. Ketintang No. 156, Surabaya</td>
              </tr>
              <tr>
                <td style={styles.cell}>3.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Jumlah Tenaga Kerja
                </td>
                <td style={styles.cell}>
                  Pria = {data.jmlPria} org, Wanita = {data.jmlWanita} org.
                  Total = {Number(data.jmlPria) + Number(data.jmlWanita)} org
                </td>
              </tr>
              <tr>
                <td style={styles.cell}>4.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  P2K3 dibentuk
                </td>
                <td style={styles.cell}>{data.tglP2K3}</td>
              </tr>
              <tr>
                <td style={styles.cell}>5.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Jumlah Pengurus
                </td>
                <td style={styles.cell}>{data.jmlPengurus}</td>
              </tr>
              <tr>
                <td style={styles.cell}>6.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Jabatan dalam Pengurus
                </td>
                <td style={styles.cell}>
                  a. Ketua: {data.ketua}
                  <br />
                  b. Sekretaris: {data.sekretaris}
                </td>
              </tr>
              <tr>
                <td style={styles.cell}>7.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Keanggotaan P2K3
                </td>
                <td style={styles.cell}>Tetap</td>
              </tr>
              <tr>
                <td style={styles.cell}>8.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Safety Policy
                </td>
                <td style={styles.cell}>Ada</td>
              </tr>
              <tr>
                <td style={styles.cell}>9.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Pelaksanaan Kegiatan
                </td>
                <td style={styles.cell}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <CheckSquare size={12} color="black" /> 
                    <span>a. Program K3 : Ada</span>
                  </div>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    b. Pelaksanaan Evaluasi Meliputi:
                  </div>
                  <div style={{ paddingLeft: "1.25rem", marginBottom: "0.5rem" }}>
                    <div>1. Peralatan Mesin : [☑] Ada</div>
                    <div>2. Alat Pelindung Diri (APD) : [☑] Ada</div>
                    <div>3. Pencegahan Kebakaran : [☑] Ada</div>
                    <div>4. Lingkungan Perusahaan : [☑] Ada</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <CheckSquare size={12} color="black" />
                    <span>c. Analisa Kecelakaan : Nihil</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <CheckSquare size={12} color="black" />
                    <span>d. Pelaporan Kecelakaan : Nihil</span>
                  </div>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    e. Apakah P2K3 Melaksanakan:
                  </div>
                  <div style={{ paddingLeft: "1.25rem", marginBottom: "0.5rem" }}>
                    <div>• Latihan K3 : [☑] Ya</div>
                    <div>• Penyuluhan K3 : [☑] Ya</div>
                    <div>• Ceramah K3 : [☑] Ya</div>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckSquare size={12} color="black" /> f. Rapat Rutin : Ya
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckSquare size={12} color="black" /> g. Jadwal Rapat Disusun : Ya
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckSquare size={12} color="black" /> h. Hasil Sidang Diarsipkan : Ya
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckSquare size={12} color="black" /> i. Hasil Sidang Ditindaklanjuti
                      : Ya
                    </div>
                  </div>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>j. Inspeksi Lapangan:</div>
                  <div style={{ paddingLeft: "1.25rem", marginBottom: "0.5rem" }}>
                    <div>• Secara Berkala : [☑] Ya</div>
                    <div>• Sesudah Kecelakaan : [☑] Ya</div>
                  </div>
                  <div>
                    <div>k. Kerja sama antar unit : Ya</div>
                    <div>l. Partisipasi Anggota : Aktif</div>
                    <div>m. Koordinasi Kegiatan : Aktif</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={styles.cell}>10.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>
                  Hambatan
                </td>
                <td style={styles.cell}>{data.hambatan}</td>
              </tr>
              <tr>
                <td style={styles.cell}>11.</td>
                <td style={{ ...styles.cell, fontWeight: "bold" }}>Saran</td>
                <td style={styles.cell}>{data.saran}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginBottom: "2rem" }}>
            Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan
            terimakasih.
          </p>
          <div style={{ marginBottom: "3rem", textAlign: "left" }} className="page-break-inside-avoid">
            <p style={{ fontWeight: "bold" }}>Hormat Kami,</p>
            <div style={{ height: "5rem" }}></div>
            <p style={{ fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", letterSpacing: "0.05em" }}>
              {data.ketua}
            </p>
            <p style={{ fontWeight: "bold" }}>{data.jabatanLaporan}</p>
          </div>
          <div style={{ fontSize: "9pt" }}>
            <p style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "0.25rem" }}>Tembusan:</p>
            <div style={{ whiteSpace: "pre-wrap", marginLeft: "1rem", lineHeight: "1.5" }}>
              {data.tembusanLaporan}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}