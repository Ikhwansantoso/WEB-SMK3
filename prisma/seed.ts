// prisma/seed.ts
import { PrismaClient, Role, KategoriTemuan, StatusTemuan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // ==========================================
  // 0. CEK DATA EKSISTING (IDEMPOTENCY)
  // ==========================================
  // Jika sudah ada user, asumsikan DB sudah diseed sebelumnya.
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('⚠️  Data found (Users exist). Skipping seed process to preserve data.');
    return;
  }

  console.log('🧹 Database empty. Starting fresh seed...');

  // Clean up just in case (optional, but good for partial failures if any)
  // Note: We only delete if we are sure we want to re-seed (which we are here)

  await prisma.laporan.deleteMany();
  await prisma.witel.deleteMany();
  await prisma.temuanAudit.deleteMany();
  await prisma.laporanKecelakaan.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleaned for fresh seed');

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