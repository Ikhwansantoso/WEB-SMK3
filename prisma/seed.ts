// prisma/seed.ts
import { PrismaClient, Role, KategoriTemuan, StatusTemuan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // ==========================================
  // 0. BERSIHKAN DATA LAMA (RESET TOTAL)
  // ==========================================
  // Hapus data dokumen & divisi (Schema Baru)
  await prisma.dokumen.deleteMany()
  await prisma.divisi.deleteMany()

  // Hapus data monitoring & audit
  await prisma.laporan.deleteMany()
  await prisma.witel.deleteMany()
  await prisma.temuanAudit.deleteMany()
  await prisma.laporanKecelakaan.deleteMany()
  
  // Hapus user
  await prisma.user.deleteMany()

  console.log('🧹 Database cleaned')

  // ==========================================
  // 1. BUAT USER (SDM)
  // ==========================================
  
  // A. ADMIN
  const admin = await prisma.user.create({
    data: {
      email: 'admin@telkom.co.id',
      name: 'Super Admin Telkom',
      role: Role.ADMIN,
      password: 'admin', 
    },
  })

  // B. AUDITOR
  const auditor = await prisma.user.create({
    data: {
      email: 'auditor@telkom.co.id',
      name: 'Budi Auditor',
      role: Role.AUDITOR,
      password: '123456',
    },
  })

  // C. PEGAWAI
  const pegawai = await prisma.user.create({
    data: {
      email: 'pegawai@telkom.co.id',
      name: 'Asep Teknisi',
      role: Role.PEGAWAI,
      password: '123456',
    },
  })

  console.log('✅ Users created')

  // ==========================================
  // 2. BUAT DATA IPBR (VERSI REPOSITORY DOKUMEN)
  // ==========================================
  
  // DIVISI 1: ME (Mechanical Electrical)
  await prisma.divisi.create({
    data: {
        nama: 'MECHANICAL ELECTRICAL (ME)',
        dokumen: {
            create: [
                {
                    judul: 'IBPR - Pengisian BBM Solar Tangki Harian',
                    nomorDokumen: 'ME-01-BBM',
                    fileUrl: '#', // Nanti diganti link PDF asli
                },
                {
                    judul: 'IBPR - Perawatan Genset Rutin',
                    nomorDokumen: 'ME-02-GENSET',
                    fileUrl: '#',
                },
                {
                    judul: 'IBPR - Pengecekan Panel Listrik (PUTR)',
                    nomorDokumen: 'ME-03-PANEL',
                    fileUrl: '#',
                }
            ]
        }
    }
  })

  // DIVISI 2: ASSET MANAGEMENT
  await prisma.divisi.create({
    data: {
        nama: 'ASSET MANAGEMENT',
        dokumen: {
            create: [
                {
                    judul: 'IBPR - Perbaikan Atap Bocor',
                    nomorDokumen: 'AST-01-ROOF',
                    fileUrl: '#',
                },
                {
                    judul: 'IBPR - Cleaning Service Lobby',
                    nomorDokumen: 'AST-02-CS',
                    fileUrl: '#',
                }
            ]
        }
    }
  })

  // DIVISI 3: SECURITY
  await prisma.divisi.create({
    data: {
        nama: 'SECURITY & SAFETY',
        dokumen: {
            create: [
                {
                    judul: 'IBPR - Penjagaan Pos Utama',
                    nomorDokumen: 'SEC-01-GATE',
                    fileUrl: '#',
                }
            ]
        }
    }
  })

  console.log('✅ IPBR Repository data created')

  // ==========================================
  // 3. BUAT TEMUAN AUDIT
  // ==========================================
  await prisma.temuanAudit.create({
    data: {
      judul: 'APAR Kadaluarsa',
      deskripsi: 'Ditemukan 2 tabung APAR di lorong utama sudah melewati masa expired.',
      lokasi: 'Lobby Utama',
      kategori: KategoriTemuan.MAYOR,
      status: StatusTemuan.OPEN, 
      deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
      auditorId: auditor.id,
    }
  })
  console.log('✅ Audit data created')

  // ==========================================
  // 4. BUAT DATA WITEL (MONITORING)
  // ==========================================
  const dataWitel = [
    { nama: 'Kantor Regional 3' },
    { nama: 'Witel Surabaya Selatan' },
    { nama: 'Witel Surabaya Utara' },
    { nama: 'Witel Sidoarjo' },
    { nama: 'Witel Malang' },
    { nama: 'Witel Pasuruan' },
    { nama: 'Witel Madiun' },
    { nama: 'Witel Kediri' },
    { nama: 'Witel Jember' },
    { nama: 'Witel Denpasar' },
    { nama: 'Witel Singaraja' },
    { nama: 'Witel Mataram' },
    { nama: 'Witel Kupang' },
  ]

  for (const w of dataWitel) {
    await prisma.witel.create({ data: w })
  }

  console.log('✅ Witel data created')
  console.log('🚀 Seeding finished. Database ready!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })