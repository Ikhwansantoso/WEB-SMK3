import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard - SMK3 Telkom",
  description: "Panel Admin Sistem Manajemen K3",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const userRole = cookieStore.get("user_role")?.value || "GUEST";

  // ROUTE GUARD: Harus login terlebih dahulu
  if (!userId) {
    redirect("/login");
  }

  // ROUTE GUARD: Role PEGAWAI tidak boleh masuk ke panel admin
  if (userRole === "PEGAWAI") {
    redirect("/pegawai/dashboard");
  }

  let userName = "Admin";

  try {
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        userName = user.name || "Admin";
      }
    }
  } catch (error) {
    console.error("Layout load user error:", error);
  }

  // AMBIL DATA NOTIFIKASI SECARA DINAMIS
  const openAuditsCount = await prisma.temuanAudit.count({
    where: { status: "OPEN" },
  });

  const incidentsCount = await prisma.laporanKecelakaan.count();

  return (
    <AdminLayoutClient
      userName={userName}
      userRole={userRole}
      openAuditsCount={openAuditsCount}
      incidentsCount={incidentsCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
