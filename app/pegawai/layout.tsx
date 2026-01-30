import PegawaiSidebar from "./components/pegawaisidebar";

export default function PegawaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigasi (Otomatis milih Sidebar atau Bottom Bar) */}
      <PegawaiSidebar />

      {/* Logic Padding:
         md:pl-64 -> Di Laptop, geser konten ke kanan 256px (tempat sidebar)
         pb-24    -> Di HP, kasih jarak bawah biar konten paling bawah gak ketutup menu
      */}
      <main className="md:pl-64 pb-24 md:pb-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
