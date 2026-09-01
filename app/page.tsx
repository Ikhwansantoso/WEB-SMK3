import { cookies } from 'next/headers'
import LandingNavbar from './components/landing/LandingNavbar'
import HeroSection from './components/landing/HeroSection'
import LegalAndCycleSection from './components/landing/LegalAndCycleSection'
import AuditSimulatorSection from './components/landing/AuditSimulatorSection'
import RegulationComparison from './components/landing/RegulationComparison'
import EmergencyProtapHub from './components/landing/EmergencyProtapHub'
import QuickSosBar from './components/landing/QuickSosBar'
import LandingFooter from './components/landing/LandingFooter'

export default async function HomePage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value || null
  const userName = cookieStore.get('user_name')?.value || null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-red-500 selection:text-white transition-colors duration-300">
      {/* 1. TOP NAVBAR */}
      <LandingNavbar userRole={userRole} userName={userName} />

      {/* 2. HERO SECTION */}
      <HeroSection userRole={userRole} />

      {/* 3. DASAR HUKUM & 5 SIKLUS SMK3 */}
      <LegalAndCycleSection />

      {/* 4. KRITERIA AUDIT & SIMULATOR MANDIRI */}
      <AuditSimulatorSection />

      {/* 5. KOMPARASI REGULASI 1987 VS 2025 */}
      <RegulationComparison />

      {/* 6. EMERGENCY PROTAP & P3K HUB (WITH AUDIO VOICE & TIMERS) */}
      <EmergencyProtapHub />

      {/* 7. QUICK SOS FLOATING BAR & DIRECTORY */}
      <QuickSosBar />

      {/* 8. FOOTER */}
      <LandingFooter />
    </div>
  )
} 