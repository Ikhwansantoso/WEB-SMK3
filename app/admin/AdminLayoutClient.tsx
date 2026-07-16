'use client'

import { useState } from "react"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

interface AdminLayoutClientProps {
  children: React.ReactNode
  userName: string
  userRole: string
  openAuditsCount: number
  incidentsCount: number
}

export default function AdminLayoutClient({
  children,
  userName,
  userRole,
  openAuditsCount,
  incidentsCount
}: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR */}
      <AdminSidebar
        userRole={userRole}
        openAuditsCount={openAuditsCount}
        incidentsCount={incidentsCount}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsCollapsed={setIsCollapsed}
      />

      {/* MAIN CONTAINER */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        } pl-0`}
      >
        {/* HEADER */}
        <AdminHeader
          userName={userName}
          userRole={userRole}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
