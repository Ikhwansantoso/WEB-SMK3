import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import PegawaiLayoutClient from "./components/PegawaiLayoutClient";

export interface PegawaiReportNotification {
  id: string;
  type: "TEMUAN" | "INSIDEN";
  title: string;
  location: string;
  status: string;
  kondisi?: string;
  date: string;
  href: string;
}

export default async function PegawaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const userName = cookieStore.get("user_name")?.value || "Pegawai";

  let userReports: PegawaiReportNotification[] = [];

  try {
    const whereConditionTemuan = userId ? { auditorId: userId } : {};
    const whereConditionInsiden = userId ? { pelaporId: userId } : {};

    const [temuan, insiden] = await Promise.all([
      prisma.temuanAudit.findMany({
        where: whereConditionTemuan,
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.laporanKecelakaan.findMany({
        where: whereConditionInsiden,
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    userReports = [
      ...temuan.map((t) => ({
        id: t.id,
        type: "TEMUAN" as const,
        title: t.judul,
        location: t.lokasi,
        status: t.status,
        kondisi: t.kondisi,
        date: t.createdAt.toISOString(),
        href: "/pegawai/audit",
      })),
      ...insiden.map((i) => ({
        id: i.id,
        type: "INSIDEN" as const,
        title: i.judul,
        location: i.lokasi,
        status: i.status,
        date: i.createdAt.toISOString(),
        href: "/pegawai/kecelakaan",
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  } catch (error) {
    console.error("Layout load pegawai reports error:", error);
  }

  return (
    <PegawaiLayoutClient userName={userName} userReports={userReports}>
      {children}
    </PegawaiLayoutClient>
  );
}
