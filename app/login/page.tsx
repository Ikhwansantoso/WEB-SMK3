import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { KeyRound, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  // --- LOGIKA BACKEND ---
  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return redirect("/?error=invalid");
    }

    const cookieStore = await cookies();
    
    // 1. Simpan Role
    cookieStore.set("user_role", user.role);
    // 2. Simpan ID
    cookieStore.set("user_id", user.id.toString());
    
    // 3. (BARU) Simpan Nama Asli User biar bisa dipanggil "Halo, Ikhwan"
    cookieStore.set("user_name", user.name || "User");
    // Redirect sesuai Role
    if (user.role === "ADMIN") redirect("/admin/dashboard");
    else if (user.role === "PEGAWAI") redirect("/pegawai/dashboard"); // Pastikan arahnya benar
    else if (user.role === "AUDITOR") redirect("/admin/audit");
    else redirect("/");
  }

  // --- TAMPILAN UI ---
  return (
    <div className="min-h-screen relative font-sans overflow-hidden flex items-center justify-center lg:justify-end p-4 lg:p-0">
      {/* 1. BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          // Pastikan file ini ada di folder public
          backgroundImage: "url('/Landmark-Tower.jpg')",
        }}
      ></div>

      {/* 2. OVERLAY MERAH (Dibuat agak gelap supaya Glass Effect terlihat pop-up) */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* 3. KONTEN UTAMA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        {/* --- BAGIAN KIRI: DESKRIPSI --- */}
        <div className="hidden lg:block text-white space-y-6 pr-10">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 py-2 px-4 rounded-full shadow-lg">
            <img
              src="/Telkom-logo-full.png"
              alt="Logo"
              className="h-6 w-auto brightness-0 invert"
            />
            <span className="text-sm font-bold tracking-widest uppercase opacity-90">
              Telkom Regional 3
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-xl text-white">
            Safety First,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-white">
              Zero Accident.
            </span>
          </h1>

          <p className="text-lg text-red-50 font-medium leading-relaxed max-w-lg opacity-90 drop-shadow-md">
            Sistem Manajemen K3 Digital. Monitoring risiko, pelaporan insiden,
            dan audit keselamatan kerja yang terintegrasi.
          </p>

          {/* Highlights */}
          <div className="pt-4 flex gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div className="text-sm font-bold text-white">
                <span className="block text-red-200 text-xs uppercase">
                  Security
                </span>
                Terjamin
              </div>
            </div>
          </div>
        </div>

        {/* --- BAGIAN KANAN: KARTU LOGIN ULTRA GLASS --- */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/40 ring-1 ring-white/20">
            {/* Header Form */}
            <div className="px-8 py-8 flex flex-col items-center text-center relative border-b border-white/10">
              {/* Logo Telkom */}
              <div className="bg-white/90 p-3 rounded-2xl shadow-lg mb-5 backdrop-blur-sm">
                <img
                  src="/Telkom-logo-full.png"
                  alt="Telkom Logo"
                  className="h-8 w-auto"
                />
              </div>

              <h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight">
                Login Sistem
              </h2>
              <p className="text-xs text-red-50 font-medium mt-1 tracking-wide opacity-90">
                Silakan masuk dengan akun Anda
              </p>
            </div>

            {/* Body Form */}
            <div className="p-8 space-y-6">
              <form action={login} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white uppercase tracking-wider ml-1 opacity-90">
                    Email Perusahaan
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 z-10"
                      size={18}
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="nama@telkom.co.id"
                      className="w-full bg-white/60 backdrop-blur-md border border-white/30 text-slate-900 text-sm font-bold rounded-xl py-4 pl-11 pr-4 outline-none focus:bg-white/90 focus:ring-4 focus:ring-red-500/30 transition-all placeholder:text-slate-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white uppercase tracking-wider ml-1 opacity-90">
                    Password
                  </label>
                  <div className="relative group">
                    <KeyRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 z-10"
                      size={18}
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/60 backdrop-blur-md border border-white/30 text-slate-900 text-sm font-bold rounded-xl py-4 pl-11 pr-4 outline-none focus:bg-white/90 focus:ring-4 focus:ring-red-500/30 transition-all placeholder:text-slate-500 shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-red-900/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2 border border-red-500/50"
                >
                  MASUK APLIKASI <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Footer Form */}
            <div className="bg-black/10 px-8 py-4 border-t border-white/10 text-center backdrop-blur-sm">
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wide">
                &copy; 2026 Asset Management TREG 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}