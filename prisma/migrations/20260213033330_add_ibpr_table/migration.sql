-- CreateTable
CREATE TABLE "Ibpr" (
    "id" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "aktivitas" TEXT NOT NULL,
    "bahaya" TEXT NOT NULL,
    "peluang" TEXT NOT NULL,
    "penanganan" TEXT NOT NULL,
    "fotoRuangan" TEXT,
    "dokumenIbpr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ibpr_pkey" PRIMARY KEY ("id")
);
