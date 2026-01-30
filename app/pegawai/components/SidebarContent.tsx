'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FolderOpen, 
  AlertTriangle, 
  Ambulance, 
  UserCircle,
  LogOut // Import Icon LogOut
} from "lucide-react";
import { logout } from "@/app/actions/auth"; // Import action logout tadi

const menuItems = [
  { name: "Beranda", href: "/pegawai/dashboard", icon: Home },
  { name: "Dokumen", href: "/pegawai/ipbr", icon: FolderOpen },
  { name: "Lapor", href: "/pegawai/audit", icon: AlertTriangle },
  { name: "Insiden", href: "/pegawai/kecelakaan", icon: Ambulance },
];

export default function SidebarContent({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex-col z-50 shadow-lg">
        
        {/* Header User */}
        <div className="h-20 bg-gradient-to-r from-red-700 to-red-600 flex items-center px-6 shadow-md z-20">
           <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-full border border-white/20">
                  <UserCircle size={28} />
              </div>
              <div className="overflow-hidden">
                  <h3 className="font-bold text-sm leading-tight truncate w-32">{userName}</h3>
                  <p className="text-[10px] text-red-100 opacity-80 uppercase tracking-wider font-semibold">
                      Pegawai
                  </p>
              </div>
           </div>
        </div>

        {/* Menu List */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-red-600" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* FOOTER DENGAN TOMBOL LOGOUT */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm group"
          >
            <LogOut size={18} className="group-hover:text-red-600 transition-colors"/>
            Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* === MOBILE NAVBAR === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-between items-center">
          {menuItems.map((item) => {
             const isActive = pathname.startsWith(item.href);
             return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isActive ? "text-red-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl ${isActive ? "bg-red-50" : "bg-transparent"}`}>
                     <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-bold">{item.name}</span>
                </Link>
             );
          })}
          
          {/* Logout Icon Mobile (Opsional, icon pintu keluar kecil) */}
          <button onClick={() => logout()} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600">
             <div className="p-1.5">
                <LogOut size={24} />
             </div>
             <span className="text-[10px] font-bold">Keluar</span>
          </button>
      </nav>
    </>
  );
}