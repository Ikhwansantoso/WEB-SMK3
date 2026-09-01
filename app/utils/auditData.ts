export interface AuditLevel {
  id: string;
  name: string;
  criteriaCount: number;
  description: string;
  targetCompany: string;
  badge: string;
  color: string;
}

export const AUDIT_LEVELS: AuditLevel[] = [
  {
    id: 'awal',
    name: 'Tingkat Awal',
    criteriaCount: 64,
    description: 'Penilaian pemenuhan 64 kriteria audit SMK3 dasar bagi perusahaan dengan tingkat risiko rendah/menengah.',
    targetCompany: 'Perusahaan skala kecil/menengah dengan potensi bahaya rendah',
    badge: '64 Kriteria',
    color: 'blue'
  },
  {
    id: 'transisi',
    name: 'Tingkat Transisi',
    criteriaCount: 122,
    description: 'Penilaian 122 kriteria audit (seluruh tingkat awal + tingkat transisi) untuk penguatan sistem manajemen K3.',
    targetCompany: 'Perusahaan berkembang dengan potensi risiko menengah hingga tinggi',
    badge: '122 Kriteria',
    color: 'purple'
  },
  {
    id: 'lanjutan',
    name: 'Tingkat Lanjutan',
    criteriaCount: 166,
    description: 'Penilaian komprehensif 166 kriteria audit mencakup seluruh elemen manajemen risiko, audit internal, & perbaikan berkelanjutan.',
    targetCompany: 'Perusahaan besar, mempekerjakan >100 orang, atau potensi bahaya tinggi (Wajib sesuai PP 50/2012)',
    badge: '166 Kriteria (Lengkap)',
    color: 'red'
  }
];

export interface AuditElement {
  number: number;
  title: string;
  awal: string;
  transisi: string;
  lanjutan: string;
}

export const AUDIT_12_ELEMENTS: AuditElement[] = [
  { number: 1, title: 'Pembangunan dan pemeliharaan komitmen', awal: '1.1.1, 1.1.3, 1.2.2, 1.2.4, 1.2.5, 1.2.6, 1.3.3, 1.4.1, 1.4.3-1.4.9', transisi: '1.1.2, 1.2.1, 1.2.3, 1.3.1, 1.4.2', lanjutan: '1.1.4, 1.1.5, 1.2.7, 1.3.2, 1.4.10, 1.4.11' },
  { number: 2, title: 'Strategi pendokumentasian', awal: '2.1.1, 2.4.1', transisi: '2.1.2, 2.1.3, 2.1.4, 2.2.1, 2.3.1, 2.3.2, 2.3.4', lanjutan: '2.1.5, 2.1.6, 2.2.2, 2.2.3, 2.3.3' },
  { number: 3, title: 'Peninjauan ulang desain dan kontrak', awal: '3.1.1, 3.2.2', transisi: '3.1.2, 3.1.3, 3.1.4, 3.2.1', lanjutan: '3.2.3, 3.2.4' },
  { number: 4, title: 'Pengendalian dokumen', awal: '4.1.1', transisi: '4.1.2, 4.2.1', lanjutan: '4.1.3, 4.1.4, 4.2.2, 4.2.3' },
  { number: 5, title: 'Pembelian & Pengendalian Produk', awal: '5.1.1, 5.1.2, 5.2.1', transisi: '5.1.3', lanjutan: '5.1.4, 5.1.5, 5.3.1, 5.4.1, 5.4.2' },
  { number: 6, title: 'Keamanan bekerja berdasarkan SMK3', awal: '6.1.1, 6.1.5-6.1.7, 6.2.1, 6.3.1, 6.4.1-6.4.4, 6.5.2-6.5.4, 6.5.7-6.5.9, 6.7.4, 6.7.6, 6.8.1-6.8.2', transisi: '6.1.2-6.1.4, 6.2.2-6.2.5, 6.5.1, 6.5.5, 6.5.6, 6.5.10, 6.7.1-6.7.3, 6.7.5, 6.7.7', lanjutan: '6.1.8, 6.6.1, 6.6.2, 6.9.1' },
  { number: 7, title: 'Standar pemantauan', awal: '7.1.1, 7.2.1-7.2.3, 7.4.1, 7.4.3-7.4.5', transisi: '7.1.2-7.1.7, 7.4.2', lanjutan: '7.3.1, 7.3.2' },
  { number: 8, title: 'Pelaporan dan perbaikan kekurangan', awal: '8.3.1', transisi: '8.1.1, 8.2.1, 8.3.2', lanjutan: '8.3.3-8.3.6, 8.4.1' },
  { number: 9, title: 'Pengelolaan material & perpindahannya', awal: '9.1.1, 9.1.2, 9.2.1, 9.2.3, 9.3.1, 9.3.3, 9.3.4', transisi: '9.1.3, 9.1.4, 9.3.5', lanjutan: '9.2.2, 9.3.2' },
  { number: 10, title: 'Pengumpulan dan penggunaan data', awal: '-', transisi: '10.1.1, 10.1.2, 10.2.1, 10.2.2', lanjutan: '10.1.3, 10.1.4' },
  { number: 11, title: 'Pemeriksaan SMK3 (Audit Internal)', awal: '-', transisi: '-', lanjutan: '11.1.1, 11.1.2, 11.1.3' },
  { number: 12, title: 'Pengembangan keterampilan & kemampuan', awal: '12.2.1, 12.2.2, 12.3.1, 12.5.1', transisi: '12.1.2, 12.1.4-12.1.6, 12.3.2, 12.4.1', lanjutan: '12.1.1, 12.1.3, 12.1.7, 12.3.3' },
];

export interface RegulationComparisonItem {
  aspek: string;
  category: 'Dasar' | 'Struktur' | 'Prosedur' | 'Sanksi';
  permenaker1987: string;
  permenaker2025: string;
  highlight: string;
}

export const REGULATION_COMPARISON: RegulationComparisonItem[] = [
  {
    aspek: 'Ruang Lingkup',
    category: 'Dasar',
    permenaker1987: 'Mengatur P2K3 dan tata cara penunjukan Ahli K3 dalam satu kesatuan aturan.',
    permenaker2025: 'Hanya mengatur P2K3. Semua urusan Ahli K3 dipindahkan ke aturan terpisah yang lebih spesifik.',
    highlight: 'Pemisahan regulasi P2K3 & Ahli K3 agar lebih fokus'
  },
  {
    aspek: 'Alasan Diterbitkan',
    category: 'Dasar',
    permenaker1987: 'Fokus pada peningkatan efisiensi dan produktivitas melalui penerapan K3 dasar.',
    permenaker2025: 'Mengikuti perkembangan hukum, teknologi, serta kebutuhan harmonisasi dengan ekosistem modern.',
    highlight: 'Harmonisasi teknologi dan era digitalisasi K3'
  },
  {
    aspek: 'Kriteria Risiko Tinggi',
    category: 'Struktur',
    permenaker1987: 'Berdasarkan bahan/proses/instalasi berbahaya secara deskriptif konvensional.',
    permenaker2025: 'Mengacu secara eksplisit pada kategori risiko OSS RBA dalam perizinan berusaha nasional.',
    highlight: 'Integrasi perizinan OSS RBA berbasis risiko'
  },
  {
    aspek: 'Ketua P2K3',
    category: 'Struktur',
    permenaker1987: 'Berasal dari unsur pengusaha secara umum.',
    permenaker2025: 'Wajib dipimpin langsung oleh Pimpinan Puncak / Pengurus tertinggi tempat kerja.',
    highlight: 'Komitmen mutlak pimpinan puncak tertinggi'
  },
  {
    aspek: 'Komposisi Anggota',
    category: 'Struktur',
    permenaker1987: 'Tidak ada jumlah minimum dan asal unit bebas.',
    permenaker2025: 'Komposisi seimbang (Min 3 Pengusaha + 3 Pekerja untuk <100 org; Min 6 Pengusaha + 6 Pekerja untuk ≥100 org) dari unit K3, SDM, Produksi.',
    highlight: 'Keseimbangan keterwakilan serikat/pekerja & pengusaha'
  },
  {
    aspek: 'Gedung Multi-Tenant',
    category: 'Struktur',
    permenaker1987: 'Tidak diatur.',
    permenaker2025: 'Jika satu gedung/kawasan berisi banyak perusahaan, wajib ada perwakilan masing-masing entitas.',
    highlight: 'Pengawasan terpadu gedung bersama / kawasan industri'
  },
  {
    aspek: 'Prosedur Penetapan SK',
    category: 'Prosedur',
    permenaker1987: 'Melalui Menteri / pejabat ditunjuk tanpa jangka waktu pasti.',
    permenaker2025: 'Oleh Kepala Disnaker Provinsi: 3 hari verifikasi berkas + 5 hari penerbitan SK resmi.',
    highlight: 'Kepastian SLA verifikasi digital (3+5 hari kerja)'
  },
  {
    aspek: 'Perubahan Pengurus',
    category: 'Prosedur',
    permenaker1987: 'Tidak ada mekanisme khusus pembaharuan.',
    permenaker2025: 'Perubahan ketua/sekretaris wajib pembaruan SK Disnaker dalam kurun waktu 2 hari kerja.',
    highlight: 'Respons cepat perubahan data kepengurusan'
  },
  {
    aspek: 'Frekuensi & Metode Pelaporan',
    category: 'Prosedur',
    permenaker1987: 'Frekuensi 3 bulan sekali secara manual (kertas fisik). Format tidak baku.',
    permenaker2025: 'Frekuensi 6 bulan sekali secara elektronik via Sistem Informasi Kemenaker (Format resmi baku).',
    highlight: 'Pelaporan elektronik terintegrasi 6 bulanan'
  },
  {
    aspek: 'Sanksi Pelanggaran',
    category: 'Sanksi',
    permenaker1987: 'Kurungan 3 bulan / denda Rp 100.000 (aturan lama).',
    permenaker2025: 'Mengikuti UU Keselamatan Kerja & sanksi administratif ketenagakerjaan terkini.',
    highlight: 'Penegakan hukum sesuai UU Ketenagakerjaan modern'
  },
  {
    aspek: 'Status Pencabutan',
    category: 'Dasar',
    permenaker1987: 'Berlaku sejak 1987 tanpa mencabut aturan sebelumnya.',
    permenaker2025: 'Mulai berlaku 2025 dan secara resmi MENCABUT PER.04/MEN/1987.',
    highlight: 'Menggantikan secara total aturan 1987'
  }
];
