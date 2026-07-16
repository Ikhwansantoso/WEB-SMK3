'use client'

import { useState } from "react"
import SidebarContent from "./SidebarContent"
import PegawaiHeader from "./PegawaiHeader"

interface PegawaiLayoutClientProps {
  children: React.ReactNode
  userName: string
}

export default function PegawaiLayoutClient({
  children,
  userName
}: PegawaiLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR */}
      <SidebarContent
        userName={userName}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* MAIN CONTAINER */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "md:pl-20" : "md:pl-64"
        } pl-0`}
      >
        {/* HEADER */}
        <PegawaiHeader
          userName={userName}
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
