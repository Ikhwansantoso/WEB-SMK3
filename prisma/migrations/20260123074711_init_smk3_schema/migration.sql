-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AUDITOR', 'PEGAWAI');

-- CreateEnum
CREATE TYPE "Keparahan" AS ENUM ('RINGAN', 'SEDANG', 'BERAT', 'SANGAT_BERAT');

-- CreateEnum
CREATE TYPE "Frekuensi" AS ENUM ('SANGAT_JARANG', 'JARANG', 'SEDANG', 'SERING', 'SANGAT_SERING');

-- CreateEnum
CREATE TYPE "TingkatRisiko" AS ENUM ('RENDAH', 'SEDANG', 'TINGGI', 'EKSTRIM');

-- CreateEnum
CREATE TYPE "KategoriTemuan" AS ENUM ('KRITIKAL', 'MAYOR', 'MINOR');

-- CreateEnum
CREATE TYPE "StatusTemuan" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PEGAWAI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentifikasiBahaya" (
    "id" TEXT NOT NULL,
    "aktivitas" TEXT NOT NULL,
    "potensiBahaya" TEXT NOT NULL,
    "keparahan" "Keparahan" NOT NULL,
    "frekuensi" "Frekuensi" NOT NULL,
    "tingkatRisiko" "TingkatRisiko" NOT NULL,
    "pengendalian" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdentifikasiBahaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemuanAudit" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kategori" "KategoriTemuan" NOT NULL,
    "buktiFoto" TEXT,
    "status" "StatusTemuan" NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP(3) NOT NULL,
    "auditorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemuanAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanKecelakaan" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kronologi" TEXT NOT NULL,
    "korban" TEXT,
    "pelaporId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanKecelakaan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TemuanAudit" ADD CONSTRAINT "TemuanAudit_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanKecelakaan" ADD CONSTRAINT "LaporanKecelakaan_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
