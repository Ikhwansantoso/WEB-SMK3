'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  name: string;
  mode: 'desktop' | 'mobile';
}

export default function NavLink({ href, icon: Icon, name, mode }: NavLinkProps) {
  const pathname = usePathname();
  // Cek apakah URL aktif (misal /pegawai/dashboard aktif jika buka /pegawai/dashboard)
  const isActive = pathname.startsWith(href);

  if (mode === 'desktop') {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
          isActive
            ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Icon size={18} className={isActive ? "text-red-600" : "text-slate-400"} />
        {name}
      </Link>
    );
  }

  // Tampilan Mobile (Icon di atas, Teks di bawah)
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 transition-all ${
        isActive ? "text-red-600" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <div className={`p-1.5 rounded-xl ${isActive ? "bg-red-50" : "bg-transparent"}`}>
         <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-bold">{name}</span>
    </Link>
  );
}