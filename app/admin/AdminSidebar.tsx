'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  FileText,
  FolderOpen,
  Users,
  Ambulance,
  Printer,
  Archive,
  Activity,
  FolderArchive,
  X,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface AdminSidebarProps {
  userRole: string;
  openAuditsCount: number;
  incidentsCount: number;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  setIsCollapsed: (val: boolean) => void;
}

export default function AdminSidebar({
  userRole,
  openAuditsCount,
  incidentsCount,
  isCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  setIsCollapsed,
}: AdminSidebarProps) {
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
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shadow-xl lg:translate-x-0 ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      } ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}`}
    >
      {/* --- HEADER SIDEBAR --- */}
      <div className="h-20 bg-gradient-to-r from-red-900 to-red-700 flex items-center justify-between px-6 relative shadow-md z-20 shrink-0">
        {!isCollapsed || isMobileOpen ? (
          <img
            src="/Telkom-logo-full.png"
            alt="Telkom Indonesia"
            className="h-14 w-auto object-contain filter drop-shadow-sm"
          />
        ) : (
          <div className="mx-auto bg-white/10 p-2 rounded-xl border border-white/20 text-white font-bold text-xs tracking-tighter shadow-sm flex items-center justify-center">
            SMK3
          </div>
        )}

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* --- MENU NAVIGASI --- */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {(!isCollapsed || isMobileOpen) && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-3">
            Main Menu
          </div>
        )}

        {/* Dashboard Link */}
        <Link
          href="/admin/dashboard"
          onClick={handleLinkClick}
          title="Dashboard"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/dashboard")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <LayoutDashboard
              size={20}
              className={checkActive("/admin/dashboard") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
          </div>
          {(!isCollapsed || isMobileOpen) && <span>Dashboard</span>}
        </Link>

        {/* Dokumen IBPR Link */}
        <Link
          href="/admin/ibpr"
          onClick={handleLinkClick}
          title="Dokumen IBPR"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/ibpr")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <FolderOpen
              size={20}
              className={checkActive("/admin/ibpr") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
          </div>
          {(!isCollapsed || isMobileOpen) && <span>Dokumen IBPR</span>}
        </Link>

        {/* Monitoring Jam Kerja Link */}
        <Link
          href="/admin/monitoring"
          onClick={handleLinkClick}
          title="Monitoring Jam Kerja"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/monitoring")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <Activity
              size={20}
              className={checkActive("/admin/monitoring") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
          </div>
          {(!isCollapsed || isMobileOpen) && <span>Monitoring Jam Kerja</span>}
        </Link>

        {/* Data Audit Link */}
        <Link
          href="/admin/audit"
          onClick={handleLinkClick}
          title="Data Audit"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/audit")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <FileText
              size={20}
              className={checkActive("/admin/audit") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
            {openAuditsCount > 0 && isCollapsed && !isMobileOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <>
              <span className="flex-1">Data Audit</span>
              {openAuditsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {openAuditsCount}
                </span>
              )}
            </>
          )}
        </Link>

        {/* Laporan Insiden Link */}
        <Link
          href="/admin/kecelakaan"
          onClick={handleLinkClick}
          title="Laporan Insiden"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/kecelakaan")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <Ambulance
              size={20}
              className={checkActive("/admin/kecelakaan") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
            {incidentsCount > 0 && isCollapsed && !isMobileOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <>
              <span className="flex-1">Laporan Insiden</span>
              {incidentsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {incidentsCount}
                </span>
              )}
            </>
          )}
        </Link>

        {/* Arsip Dokumen Link */}
        <Link
          href="/admin/archive"
          onClick={handleLinkClick}
          title="Arsip Dokumen"
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
          } ${
            checkActive("/admin/archive")
              ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
              : "text-slate-600 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
            <FolderArchive
              size={20}
              className={checkActive("/admin/archive") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
            />
          </div>
          {(!isCollapsed || isMobileOpen) && <span>Arsip Dokumen</span>}
        </Link>

        {/* Administrator Section */}
        {userRole === "ADMIN" && (
          <>
            <div className="my-4 border-t border-slate-100"></div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-3">
                Administrator
              </div>
            )}

            {/* Data Pengguna Link */}
            <Link
              href="/admin/users"
              onClick={handleLinkClick}
              title="Data Pengguna"
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
                isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
              } ${
                checkActive("/admin/users")
                  ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                <Users
                  size={20}
                  className={checkActive("/admin/users") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
                />
              </div>
              {(!isCollapsed || isMobileOpen) && <span>Data Pengguna</span>}
            </Link>

            {/* Buat Surat Link */}
            <Link
              href="/admin/surat"
              onClick={handleLinkClick}
              title="Buat Surat"
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
                isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
              } ${
                checkActive("/admin/surat")
                  ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                <Printer
                  size={20}
                  className={checkActive("/admin/surat") ? "text-red-600" : "text-slate-400 group-hover:text-red-600 transition-colors"}
                />
              </div>
              {(!isCollapsed || isMobileOpen) && <span>Buat Surat</span>}
            </Link>

            {/* Arsip Surat Link */}
            <Link
              href="/admin/arsip"
              onClick={handleLinkClick}
              title="Arsip Surat"
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group font-medium ${
                isCollapsed && !isMobileOpen ? "justify-center" : "justify-start"
              } ${
                checkActive("/admin/arsip")
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
                <Archive
                  size={20}
                  className={checkActive("/admin/arsip") ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600 transition-colors"}
                />
              </div>
              {(!isCollapsed || isMobileOpen) && <span>Arsip Surat</span>}
            </Link>
          </>
        )}
      </nav>

      {/* --- FOOTER SIDEBAR --- */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
        <button
          onClick={() => logout()}
          title="Keluar"
          className="w-full bg-white border border-slate-200 text-slate-600 p-3 rounded-xl flex items-center justify-center transition-all shadow-sm font-bold text-sm group hover:bg-red-600 hover:text-white hover:border-red-600"
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <LogOut
              size={18}
              className="group-hover:text-white text-slate-400 transition"
            />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="ml-2">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}