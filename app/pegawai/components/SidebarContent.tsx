'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FolderOpen, 
  AlertTriangle, 
  Ambulance, 
  UserCircle,
  LogOut,
  FolderArchive,
  X,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const menuItems = [
  { name: "Beranda", href: "/pegawai/dashboard", icon: Home },
  { name: "Dokumen", href: "/pegawai/ipbr", icon: FolderOpen },
  { name: "Lapor", href: "/pegawai/audit", icon: AlertTriangle },
  { name: "Insiden", href: "/pegawai/kecelakaan", icon: Ambulance },
  { name: "Arsip Dokumen", href: "/pegawai/archive", icon: FolderArchive },
];

interface SidebarContentProps {
  userName: string;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function SidebarContent({ 
  userName,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarContentProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const checkActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shadow-xl md:translate-x-0 ${
        isCollapsed ? "md:w-20" : "md:w-64"
      } ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}`}
    >
      {/* Header User */}
      <div className="h-20 bg-gradient-to-r from-red-700 to-red-600 flex items-center justify-between px-6 shadow-md z-20 shrink-0">
        {!isCollapsed || isMobileOpen ? (
          <div className="flex items-center gap-3 text-white overflow-hidden">
            <div className="p-2 bg-white/10 rounded-full border border-white/20 shrink-0">
              <UserCircle size={28} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm leading-tight truncate w-32">{userName}</h3>
              <p className="text-[10px] text-red-100 opacity-80 uppercase tracking-wider font-semibold">
                Pegawai
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto bg-white/10 p-2 rounded-xl border border-white/20 text-white flex items-center justify-center shrink-0">
            <UserCircle size={24} />
          </div>
        )}

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {(!isCollapsed || isMobileOpen) && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-3">
            Menu Pegawai
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = checkActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              title={item.name}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ${
                isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
              } ${
                isActive
                  ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                <item.icon size={18} className={isActive ? "text-red-600" : "text-slate-400"} />
              </div>
              {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* FOOTER DENGAN TOMBOL LOGOUT */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button 
          onClick={() => logout()}
          title="Keluar Aplikasi"
          className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm group"
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <LogOut size={18} className="group-hover:text-red-600 transition-colors shrink-0"/>
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="ml-2">Keluar Aplikasi</span>}
        </button>
      </div>
    </aside>
  );
}
