/*
  Warnings:

  - You are about to drop the column `tanggal` on the `LaporanKecelakaan` table. All the data in the column will be lost.
  - You are about to drop the `IdentifikasiBahaya` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `judul` to the `LaporanKecelakaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LaporanKecelakaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktuKejadian` to the `LaporanKecelakaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Kondisi" AS ENUM ('AMAN', 'BUTUH_PERBAIKAN');

-- DropForeignKey
ALTER TABLE "LaporanKecelakaan" DROP CONSTRAINT "LaporanKecelakaan_pelaporId_fkey";

-- DropForeignKey
ALTER TABLE "TemuanAudit" DROP CONSTRAINT "TemuanAudit_auditorId_fkey";

-- AlterTable
ALTER TABLE "LaporanKecelakaan" DROP COLUMN "tanggal",
ADD COLUMN     "fotoBukti" TEXT,
ADD COLUMN     "judul" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waktuKejadian" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "pelaporId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TemuanAudit" ADD COLUMN     "kondisi" "Kondisi" NOT NULL DEFAULT 'BUTUH_PERBAIKAN',
ADD COLUMN     "waktuTemuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "kategori" SET DEFAULT 'MINOR',
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "auditorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '123456',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "IdentifikasiBahaya";

-- DropEnum
DROP TYPE "Frekuensi";

-- DropEnum
DROP TYPE "Keparahan";

-- DropEnum
DROP TYPE "TingkatRisiko";

-- CreateTable
CREATE TABLE "Witel" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Witel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "witelId" INTEGER NOT NULL,
    "bulanIndex" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Laporan_witelId_bulanIndex_tahun_key" ON "Laporan"("witelId", "bulanIndex", "tahun");

-- AddForeignKey
ALTER TABLE "TemuanAudit" ADD CONSTRAINT "TemuanAudit_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanKecelakaan" ADD CONSTRAINT "LaporanKecelakaan_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_witelId_fkey" FOREIGN KEY ("witelId") REFERENCES "Witel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
