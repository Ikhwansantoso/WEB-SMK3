-- CreateTable
CREATE TABLE "DocumentArchive" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentDate" TIMESTAMP(3) NOT NULL,
    "division" TEXT NOT NULL DEFAULT 'General Support',
    "digitalStatus" TEXT NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentArchive_pkey" PRIMARY KEY ("id")
);
