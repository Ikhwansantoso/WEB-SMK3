export interface ProtapItem {
  id: string;
  title: string;
  category: 'keamanan' | 'bencana' | 'p3k';
  categoryLabel: string;
  summary: string;
  steps: string[];
  timerMinutes?: number; // Hitung mundur bilas / observasi jika ada
  timerDescription?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  badgeColor: string;
  keywords: string[];
}

export const PROTAP_DATA: ProtapItem[] = [
  // ==================== KEAMANAN & ANCAMAN ====================
  {
    id: 'orang-mengamuk',
    title: 'Protap Menghadapi Orang Mengamuk / Mengancam',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Sikap simpatik namun siaga, penawaran bantuan penyelesaian, musyawarah, dan koordinasi dengan kepolisian.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['mengamuk', 'ancam', 'orang mengancam', 'emosi', 'musyawarah', 'tangkap', 'polisi'],
    steps: [
      'Hadapi secara simpatik, ramah, familier, tetapi tetap siaga dan waspada.',
      'Tanyakan permasalahannya dan tawarkan bantuan upaya penyelesaiannya.',
      'Lapor kepada Manajer/Pimpinan terkait.',
      'Upayakan penyelesaian damai dan musyawarah.',
      'Bila tidak berhasil, tangkap oknum pelaku.',
      'Bila tidak sanggup mengatasi, lapor kepada instansi keamanan terkait/polisi terdekat.',
      'Berikan perawatan kesehatan terhadap korban luka/cedera.'
    ]
  },
  {
    id: 'kegaduhan-lokasi',
    title: 'Protap Menghadapi Kegaduhan di Lokasi / Instalasi',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Pengecekan sumber kegaduhan, koordinasi unit penanggung jawab ruangan, dan penertiban bersama pegawai senior.',
    priority: 'MEDIUM',
    badgeColor: 'blue',
    keywords: ['gaduh', 'kegaduhan', 'ribut', 'instalasi', 'ruangan', 'senior', 'tertib'],
    steps: [
      'Dapatkan kepastian mengenai ruangan/tempat dan kegiatan yang menjadi sumber kegaduhan.',
      'Dapatkan kejelasan mengenai Unit Kerja dan Manajer/Pegawai paling senior yang terkait atau bertanggung jawab atas ruangan/tempat dimaksud.',
      'Informasikan kepada Manajer/Pegawai paling senior tersebut tentang kegaduhan yang terjadi dan mohon tindak lanjutnya.'
    ]
  },
  {
    id: 'pencurian-lokasi',
    title: 'Protap Menghadapi Pencurian di Lokasi / Instalasi',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Pengamanan TKP, inventarisasi data kehilangan, pelaporan polisi, dan pengamanan barang bukti.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['maling', 'pencurian', 'hilang', 'barang bukti', 'tkp', 'polisi', 'kasus'],
    steps: [
      'Lakukan pengamanan Tempat Kejadian Perkara dan laksanakan penyelidikan pengusutan pendahuluan.',
      'Lapor kepada Manajer Lini terkait.',
      'Bila Pimpinan/Manajer menyetujui, segera lapor dan minta bantuan petugas instansi keamanan (Polisi).',
      'Inventarisir data/keterangan yang berkaitan dengan kasus.',
      'Analisis kelemahan/kerawanan untuk peningkatan upaya keamanan lebih lanjut.',
      'Bila terdapat tersangka/pelaku, lakukan penyelidikan.',
      'Amankan barang bukti.'
    ]
  },
  {
    id: 'perampokan-lokasi',
    title: 'Protap Menghadapi Perampokan di Lokasi / Instalasi',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Peningkatan kewaspadaan malam hari, aktivasi alarm darurat, pelacakan ciri pelaku, dan keselamatan nyawa.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['rampok', 'perampokan', 'begal', 'senjata', 'alarm', 'siskamling', 'pam', 'kritis'],
    steps: [
      'Tingkatkan kewaspadaan pengamanan, mulai pukul 23.00 pintu gerbang dan lobby ditutup.',
      'Bila ada sejumlah orang mencurigakan, segera lapor dan minta bantuan Polisi, Unsur Siskamling Masyarakat, dan Unit PAM atasan.',
      'Usahakan mengaktifkan alarm, baik yang dihubungkan ke kantor Instansi Keamanan terdekat maupun alarm lokal.',
      'Bila kekuatan seimbang lakukan perlawanan. Jika tidak yang penting keselamatan petugas.',
      'Usahakan mengingat ciri pelaku, jumlah, senjata, dan kendaraan yang digunakan.',
      'Lapor pada keamanan terkait/Polisi terdekat, Unit PAM Atasan, dan Manajer Pimpinan Lokasi.'
    ]
  },
  {
    id: 'intimidasi-pemerasan',
    title: 'Protap Menghadapi Intimidasi Pemerasan',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Panduan bersikap tenang, menampung masalah, serta pelaporan resmi saat terjadi intimidasi atau pemerasan.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['pemerasan', 'intimidasi', 'ancaman', 'preman', 'uang', 'oknum', 'keamanan'],
    steps: [
      'Pegawai diharapkan bersikap sabar, arif, dan setenang mungkin.',
      'Jangan takut tapi juga jangan terpancing emosi.',
      'Hadapi oknum pelaku sebaik mungkin dan dengan hati dingin.',
      'Pancing dan tampung permasalahannya.',
      'Catat atau ingat identitas/ciri pelaku, latar belakangnya, ancaman/tuntutan dan, ucapan/perkataan lainnya.',
      'Jangan memberi komitmen di luar kewenangan.',
      'Jelaskan saja tugas & pekerjaan sendiri serta aturan perusahaan yang berlaku.',
      'Segera lapor kepada Kepala/Petugas Unit Pengamanan dan beri informasi sebanyak-banyaknya.',
      'Dalam keadaan yang memungkinkan, ganti nomor telepon rumah dan kantor.',
      'Apabila dipandang perlu, korban serta Kepala/Petugas Pengamanan segera lapor Polisi.',
      'Apabila keadaan sangat kritis, prioritaskan keselamatan jiwa diri dan rekan kerja.'
    ]
  },
  {
    id: 'ancaman-bom',
    title: 'Protap Menghadapi Ancaman Bom Melalui Telepon Gelap',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Prosedur penanganan ancaman bom telepon, pencatatan suara latar, pelacakan asal panggilan, dan koordinasi evakuasi.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['bom', 'telepon gelap', 'ancaman bom', 'evakuasi', 'gegana', 'polisi', 'teror'],
    steps: [
      'Penerima telepon bersikap tenang, jangan panik, dan jangan memutuskan hubungan telepon.',
      'Bila mungkin hubungi rekan kerja untuk merekam pembicaraan dan menelusuri nomor penelpon.',
      'Dengarkan secara seksama suara penelpon dan suara latar belakang (background noise).',
      'Pancing dan tanyakan: Di mana bom diletakkan? Kapan akan meledak? Mengapa bom diletakkan? Siapa nama/identitas penelpon?',
      'Catat waktu panggilan, jenis kelamin, perkiraan umur, logat bahasa, dan emosi suara penelpon.',
      'Setelah telepon selesai, segera laporkan kejadian kepada Manajer Pengamanan / Pimpinan Lokasi.',
      'Unit Pengamanan segera berkoordinasi dengan Kepolisian (Tim Gegana/Jibom).',
      'Lakukan evakuasi terencana bagi seluruh penghuni gedung menuju area aman terbuka (titik kumpul).'
    ]
  },
  {
    id: 'unjuk-rasa',
    title: 'Protap Menghadapi Aksi Unjuk Rasa Massa',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Protokol penutupan gerbang, pengamanan aset/kendaraan, operasi simpatik, serta kesiapan barikade dan pemadam.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['demo', 'unjuk rasa', 'massa', 'orasi', 'barikade', 'aparat', 'pemadam'],
    steps: [
      'Segera lapor minta bantuan Instansi Keamanan.',
      'Tutup pintu gerbang dan ruangan.',
      'Pindahkan kendaraan ke tempat parkir yang lebih aman.',
      'Kerahkan sebagian pegawai untuk melakukan operasi simpatik, membujuk massa mengurungkan niatnya.',
      'Perkuat pertahanan lokal dengan barikade.',
      'Siapkan alat pemadam kebakaran.',
      'Siapkan peralatan keselamatan dan pelayanan kesehatan.'
    ]
  },
  {
    id: 'kerusuhan-massa',
    title: 'Protap Menghadapi Kerusuhan Massa',
    category: 'keamanan',
    categoryLabel: 'Keamanan & Ancaman',
    summary: 'Penghindaran area konflik, permohonan pengawalan aparat, evakuasi darurat pegawai dan keluarga, serta sikap netral.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['kerusuhan', 'rusuh', 'anarki', 'konflik', 'evakuasi', 'pengawalan'],
    steps: [
      'Segera menghindar dari lokasi kerusuhan.',
      'Lapor kepada Manajer Unit Kerja dan bila perlu minta bantuan penjemputan.',
      'Apabila situasi menghendaki, ungsikan/evakuasikan pegawai dan keluarganya ke kantor atau kota lain.',
      'Minta bantuan Instansi Keamanan untuk perkuat penjagaan instalasi/kantor.',
      'Minta bantuan pengawalan Instansi Keamanan untuk petugas lapangan yang melaksanakan perbaikan jaringan tugas lain.',
      'Pertahankan kesan bahwa Telkom tidak memihak.'
    ]
  },

  // ==================== BENCANA & FASILITAS ====================
  {
    id: 'bencana-lift-macet',
    title: 'Protap Menghadapi Bencana Kemacetan Lift',
    category: 'bencana',
    categoryLabel: 'Bencana & Fasilitas',
    summary: 'Pengecekan jumlah korban terjebak, komunikasi intercom, pasokan oksigen, dan evakuasi manual lantai terdekat.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['lift', 'elevator', 'terjebak', 'macet', 'oksigen', 'tandu', 'lantai'],
    steps: [
      'Segera cari keterangan jumlah orang dan posisi.',
      'Upayakan berkomunikasi dengan pengguna yang terjebak. Pengguna diminta tenang dan jelaskan pertolongan sedang diupayakan.',
      'Siapkan obat-obatan P3K, tandu, dan tabung oksigen.',
      'Upayakan menggerakkan lift secara manual sampai ke lantai terdekat dan buka paksa pintunya.',
      'Berikan pertolongan pertama kepada pengguna lift.'
    ]
  },
  {
    id: 'bencana-kebakaran',
    title: 'Protap Menghadapi Bencana Kebakaran Gedung',
    category: 'bencana',
    categoryLabel: 'Bencana & Fasilitas',
    summary: 'Konfirmasi titik api, kontak Damkar 113, early warning sound master, aktivasi APAR/hidran, dan evakuasi tangga darurat.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['kebakaran', 'api', 'asap', 'apar', 'hidran', 'damkar', '113', 'alarm'],
    steps: [
      'Pastikan lokasi/tempat/ruangan sumber kebakaran.',
      'Minta bantuan segera ke Dinas Pemadam Kebakaran.',
      'Segera berikan peringatan dini kepada seluruh pegawai melalui sound atau alarm.',
      'Padamkan api dengan mengaktifkan hidran atau gas pemadam kebakaran di lokasi kebakaran.',
      'Pandu evakuasi pegawai ke tempat aman.',
      'Berikan pertolongan pertama bagi yang cedera.',
      'Lakukan inventarisasi kerugian.'
    ]
  },
  {
    id: 'bencana-banjir',
    title: 'Protap Menghadapi Bencana Banjir di Lokasi / Instalasi',
    category: 'bencana',
    categoryLabel: 'Bencana & Fasilitas',
    summary: 'Pemutusan listrik genset/korsleting, evakuasi perangkat telekomunikasi dan dokumen penting, serta pompa alkon.',
    priority: 'HIGH',
    badgeColor: 'blue',
    keywords: ['banjir', 'air', 'genset', 'korsleting', 'pompa', 'dokumen', 'perahu'],
    steps: [
      'Matikan genset dan jaringan listrik yang berpotensi menimbulkan konslet.',
      'Pindahkan alat peralatan dan dokumen dari ruangan yang berpotensi tergenang air ke ruangan yang lebih aman.',
      'Siapkan pompa penghisap air, perahu karet darurat (bila ada), dan peralatan P3K.'
    ]
  },
  {
    id: 'bencana-gempa-bumi',
    title: 'Protap Menghadapi Bencana Gempa Bumi',
    category: 'bencana',
    categoryLabel: 'Bencana & Fasilitas',
    summary: 'Himbauan Drop-Cover-Hold On, evakuasi cepat tangga darurat pasca-guncangan, titik kumpul, dan penyisiran korban.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['gempa', 'gempa bumi', 'lindung', 'kolom', 'meja', 'titik kumpul', 'assembly point'],
    steps: [
      'Saat itu juga umumkan terjadinya gempa bumi dan pegawai dihimbau berlindung di bawah meja atau mendekati tiang utama bangunan.',
      'Disusul dengan instruksi evakuasi untuk meninggalkan gedung secepat mungkin.',
      'Pandu pegawai agar berhimpun di lapangan yang relatif aman.',
      'Lakukan penyisiran ruangan untuk melihat kemungkinan adanya korban atau kerusakan.',
      'Setelah keadaan demikian aman, maka karyawan dapat bekerja kembali.'
    ]
  },

  // ==================== PERTOLONGAN PERTAMA (P3K) ====================
  {
    id: 'p3k-orang-pingsan',
    title: 'Protap P3K Terhadap Orang Pingsan',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Evakuasi ke tempat teduh/sejuk, pelonggaran pakaian, pengecekan napas, rangsangan bau, dan minuman hangat manis.',
    priority: 'HIGH',
    badgeColor: 'emerald',
    keywords: ['pingsan', 'tidak sadar', 'lemas', 'napas', 'resusitasi', 'cpr', 'minum manis'],
    steps: [
      'Bawa korban ke tempat yang teduh, aman, dan tersedia cukup udara bersih.',
      'Letakkan korban pada tempat datar, usahakan posisi kepala sejajar dengan badan.',
      'Longgarkan semua pakaian bagian perut dan dada.',
      'Cek pernapasan korban dengan punggung tangan atau kaca di depan hidung korban.',
      'Bila ada tanda-tanda pernapasan, berikan bau-bauan rangsangan (misal alkohol).',
      'Bila tidak ada tanda pernapasan, segera berikan pernapasan buatan dan bawa ke RS terdekat.',
      'Bila korban sudah sadar, berikan minuman hangat dan manis.'
    ]
  },
  {
    id: 'p3k-pendarahan',
    title: 'Protap P3K Kecelakaan dengan Pendarahan',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Penekanan kasa steril, penanganan khusus luka leher/kepala/dada, larangan memasukkan usus kembali pada luka perut.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['darah', 'pendarahan', 'luka', 'perban', 'kasa', 'usus', 'balut'],
    steps: [
      'Tekan dengan perban steril di tempat pendarahan dan balut kuat-kuat.',
      'Pendarahan pada leher, tekan dengan perban steril dan jangan terlalu kuat.',
      'Pendarahan di kepala, luka ditutup dengan kasa/perban steril.',
      'Pendarahan di bagian dada, punggung, tekan dengan perban steril dan dibalut.',
      'Pendarahan di bagian perut dengan usus keluar, tutup dengan perban steril dan dilarang memasukkan usus kembali ke perut.',
      'Bawa ke Rumah Sakit terdekat.'
    ]
  },
  {
    id: 'p3k-luka-bakar',
    title: 'Protap P3K Kecelakaan dengan Luka Bakar',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Pendinginan air mengalir suhu normal selama 10-20 menit, pengeringan steril, dan salep luka bakar (Bioplacenton).',
    priority: 'HIGH',
    badgeColor: 'amber',
    timerMinutes: 15,
    timerDescription: 'Timer Bilas Air Mengalir (10 - 20 Menit)',
    keywords: ['luka bakar', 'bakar', 'panas', 'melepuh', 'air mengalir', 'salep', 'bioplacenton'],
    steps: [
      'Dinginkan luka dengan air mengalir (suhu normal,bukan es) selama 10–20 menit. Jangan oles apa pun dulu sebelum pendinginan selesai.',
      'Keringkan perlahan dengan kain bersih dan oleskan salep yang sesuai (misalnya Bioplacenton atau Vaseline).',
      'Bila perlu bawa ke Rumah Sakit terdekat.'
    ]
  },
  {
    id: 'p3k-patah-tulang',
    title: 'Protap P3K Kecelakaan dengan Patah Tulang',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Pemasangan bidai/spalk imobilisasi melewati 2 sendi, perban darurat, dan evakuasi tandu tanpa manipulasi tulang.',
    priority: 'HIGH',
    badgeColor: 'amber',
    keywords: ['patah tulang', 'fraktur', 'tulang', 'bidai', 'spalk', 'imobilisasi', 'tandu'],
    steps: [
      'Pasang bidai/spalk kemudian di perban darurat.',
      'Segera bawa ke Rumah Sakit terdekat.'
    ]
  },
  {
    id: 'p3k-terbakar-asam',
    title: 'Protap P3K Kecelakaan Terbakar Karena Asam (Acid)',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Pengguyuran air minimal 15 menit, pembilasan mata masif, salep Levertran/Vaseline/Bioplacenton, dan dekontaminasi pakaian.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    timerMinutes: 15,
    timerDescription: 'Timer Guyur / Bilas Air Masif (Minimal 15 Menit)',
    keywords: ['asam', 'kimia', 'acid', 'aki', 'mata', 'guyur air', 'bilas 15 menit', 'bioplacenton'],
    steps: [
      'Segera siram dengan air dalam jumlah banyak selama 15 menit, kecuali mata direndam berkali-kali dengan air bersih pada kurun waktu yang sama.',
      'Olesi dengan Bioplacenton zalf kulit, Vaseline, atau Levertran zalf pada bagian yang terbakar kecuali muka.',
      'Bila perlu bawa ke RS terdekat.',
      'Bersihkan alat-alat keselamatan kerja yang terkena cairan asam dengan air hingga bersih dan keringkan di udara terbuka.'
    ]
  },
  {
    id: 'p3k-gas-cairan-kimia',
    title: 'Protap P3K Kecelakaan Terkena Gas / Cairan Kimia Beracun',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Penyiraman air masif 15 menit, pemindahan ke udara segar saat inhalasi gas, dan pernapasan buatan.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    timerMinutes: 15,
    timerDescription: 'Timer Bilas Cairan Kimia (Minimal 15 Menit)',
    keywords: ['kimia', 'gas beracun', 'cairan kimia', 'toxic', 'hirup', 'ventilasi', 'pernapasan buatan'],
    steps: [
      'Bagian yang terkena bahan kimia disiram dengan air dalam jumlah banyak minimal 15 menit.',
      'Bila diperlukan bawa ke RS terdekat.',
      'Bila pernapasan terhenti lakukan pernapasan buatan.'
    ]
  },
  {
    id: 'p3k-sengatan-listrik',
    title: 'Protap P3K Kecelakaan Sengatan Listrik',
    category: 'p3k',
    categoryLabel: 'Pertolongan Pertama (P3K)',
    summary: 'Pemutusan sumber setrum, isolasi kayu/plastik, evakuasi aman, dan resusitasi jantung paru.',
    priority: 'CRITICAL',
    badgeColor: 'red',
    keywords: ['listrik', 'setrum', 'sengatan listrik', 'tegangan', 'mati listrik', 'cpr', 'isolator'],
    steps: [
      'Bebaskan korban dari aliran listrik.',
      'Angkat korban ke tempat yang aman.',
      'Bila perlu berikan pernapasan buatan dan segera bawa ke RS terdekat.'
    ]
  }
];
