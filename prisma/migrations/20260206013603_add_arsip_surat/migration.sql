-- CreateTable
CREATE TABLE "ArsipSurat" (
    "id" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "perihal" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArsipSurat_pkey" PRIMARY KEY ("id")
);
