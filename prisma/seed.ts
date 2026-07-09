// prisma/seed.ts
import { PrismaClient, Role, KategoriTemuan, StatusTemuan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // ==========================================
  // 1. BUAT USER (SDM) SECARA AMAN (UPSERT/CHECK)
  // ==========================================
  
  // A. ADMIN
  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@telkom.co.id' } })
  let admin = adminExists
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@telkom.co.id',
        name: 'Super Admin Telkom',
        role: Role.ADMIN,
        password: 'admin',
      },
    })
  }

  // B. AUDITOR
  const auditorExists = await prisma.user.findUnique({ where: { email: 'auditor@telkom.co.id' } })
  let auditor = auditorExists
  if (!auditor) {
    auditor = await prisma.user.create({
      data: {
        email: 'auditor@telkom.co.id',
        name: 'Budi Auditor',
        role: Role.AUDITOR,
        password: '123456',
      },
    })
  }

  // C. PEGAWAI
  const pegawaiExists = await prisma.user.findUnique({ where: { email: 'pegawai@telkom.co.id' } })
  if (!pegawaiExists) {
    await prisma.user.create({
      data: {
        email: 'pegawai@telkom.co.id',
        name: 'Asep Teknisi',
        role: Role.PEGAWAI,
        password: '123456',
      },
    })
  }

  console.log('✅ Users handled')

  // ==========================================
  // 2. BUAT TEMUAN AUDIT
  // ==========================================
  const temuanCount = await prisma.temuanAudit.count()
  if (temuanCount === 0 && auditor) {
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
  }

  // ==========================================
  // 3. SYNC DATA WITEL (MONITORING)
  // ==========================================
  
  // 1. Dapatkan semua ID witel yang memiliki laporan
  const witelsWithLaporan = await prisma.laporan.findMany({
    select: { witelId: true }
  })
  const witelIdsWithLaporan = Array.from(new Set(witelsWithLaporan.map(l => l.witelId)))

  // 2. Hapus semua Witel lama yang tidak memiliki laporan
  await prisma.witel.deleteMany({
    where: {
      id: { notIn: witelIdsWithLaporan }
    }
  })

  // 3. Masukkan 8 Witel baru jika belum ada
  const dataWitel = [
    { nama: 'Suramadu' },
    { nama: 'Solo Jateng Timur' },
    { nama: 'Semarang Jateng Utara' },
    { nama: 'Yogya Jateng Selatan' },
    { nama: 'Jatim Timur' },
    { nama: 'Jatim Barat' },
    { nama: 'Bali' },
    { nama: 'Nusa Tenggara' },
  ]

  for (const w of dataWitel) {
    const witelExists = await prisma.witel.findFirst({ where: { nama: w.nama } })
    if (!witelExists) {
      await prisma.witel.create({ data: w })
    }
  }

  console.log('✅ Witel data synced')
  console.log('🚀 Seeding/Sync finished!')
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