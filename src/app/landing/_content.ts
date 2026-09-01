/**
 * Konten seluruh halaman marketing SAKTI.
 * Substansi teks diambil dari folder `software/sakti-landing-page` (9 halaman
 * HTML statis) dan diadaptasi ke design system landing yang ada.
 */
import type { Stat } from './_data'
import type { EngineStep, NumberedItem, ProfileTab, StatCard } from './_components/blocks'
import type { Tier } from './_components/pricing'
import type { FaqGroup } from './_components/faq-groups'
import type { SkillGapRow } from './_components/skill-gap-card'

const T = (text: string, label: string): Stat => ({ text, label })
const N = (
  prefix: string,
  value: number,
  suffix: string,
  label: string,
  decimals = 0,
): Stat => ({ prefix, value, suffix, decimals, label })

/* ============================================ UNTUK PENCARI KERJA ======== */

export const pencariKerja = {
  hero: {
    breadcrumb: 'Beranda / Pencari Kerja',
    eyebrow: 'Untuk fresh graduate, career switcher & upskiller',
    title: 'Berhenti kirim lamaran ke mana-mana. Biar sistem cari yang cocok buat kamu.',
    lead: 'Upload CV sekali, dapat daftar lowongan yang benar-benar sesuai skill dan pengalamanmu, lengkap dengan skor kecocokan dan skill yang masih perlu diasah.',
    ctas: [
      { label: 'Upload CV & Mulai Sekarang', href: '/register' },
      { label: 'Lihat cara kerjanya', href: '/landing/cara-kerja', variant: 'ghost' as const },
    ],
    stats: [
      T('Rp0', 'Selamanya gratis'),
      N('<', 10, ' detik', 'CV langsung terbaca'),
      N('', 92, '%', 'Contoh skor kecocokan tertinggi'),
    ],
  },
  problems: {
    eyebrow: 'Kenapa susah dapat kerja',
    title: 'Masalahnya bukan kamu kurang usaha',
    lead: 'Tiga hal ini yang paling sering bikin proses cari kerja jadi melelahkan, dan semuanya bisa diatasi.',
    items: [
      {
        number: '01',
        title: 'Apply asal banyak, bukan asal cocok',
        desc: 'Kirim ke 50 lowongan tanpa tahu mana yang benar-benar sesuai skill, akhirnya waktu habis tapi respons minim.',
      },
      {
        number: '02',
        title: 'Nggak tahu skill apa yang kurang',
        desc: 'Ditolak berkali-kali tanpa penjelasan jelas, jadi nggak tahu harus perbaiki apa untuk lamaran berikutnya.',
      },
      {
        number: '03',
        title: 'Bingung mulai belajar dari mana',
        desc: 'Sudah tahu ada skill gap, tapi bingung pilih kursus yang tepat dari ratusan pilihan yang ada di internet.',
      },
    ] satisfies NumberedItem[],
  },
  flow: {
    eyebrow: 'Alur lengkapnya',
    title: 'Dari upload CV sampai apply, dalam satu alur',
    lead: 'Nggak ada form panjang. Nggak ada isi ulang data yang sama berkali-kali.',
    steps: [
      {
        number: '01',
        name: 'LLProfiler membaca CV kamu',
        title: 'Upload PDF atau Word, selesai dalam hitungan detik',
        desc: 'Sistem otomatis mengenali nama, pendidikan, pengalaman kerja, dan skill dari CV kamu, tanpa perlu isi form manual satu per satu. Kamu tetap bisa cek dan mengedit hasilnya sebelum dipakai untuk pencarian lowongan.',
        points: [
          'Upload file CV (PDF/DOCX)',
          'Sistem ekstrak & normalisasi skill kamu',
          'Tinjau & koreksi hasil sebelum lanjut',
        ],
      },
      {
        number: '02',
        name: 'Matchmaker mencocokkan ke lowongan',
        title: 'Dapat daftar lowongan dengan skor kecocokan, bukan tebak-tebakan',
        desc: 'Setiap lowongan yang cocok ditampilkan lengkap dengan skor persentase dan alasan kenapa cocok, misalnya skill apa yang match dan pengalaman apa yang relevan. Jadi kamu tahu persis kenapa suatu lowongan direkomendasikan.',
        points: [
          'Sistem bandingkan profil kamu ke ribuan lowongan',
          'Hasil diranking dari yang paling cocok',
          'Lihat alasan kecocokan sebelum apply',
        ],
      },
      {
        number: '03',
        name: 'Talent Developer tunjukkan skill gap',
        title: 'Tahu persis skill apa yang bikin lamaran ditolak',
        desc: 'Untuk lowongan impian yang belum 100% cocok, sistem tunjukkan skill apa saja yang masih kurang, diurutkan dari yang paling berpengaruh, plus 3-5 pilihan sumber belajar sesuai budget dan waktu kamu.',
        points: [
          'Lihat daftar skill gap yang paling prioritas',
          'Pilih sumber belajar gratis atau berbayar',
          'Update profil begitu skill baru dikuasai',
        ],
      },
    ] satisfies EngineStep[],
  },
  profiles: {
    eyebrow: 'Cocok untuk kamu yang mana',
    title: 'Setiap tahap karier, pendekatannya beda',
    lead: 'Pilih salah satu untuk lihat bagaimana SAKTI membantu di posisi kamu sekarang.',
    tabs: [
      {
        label: 'Fresh Graduate',
        meta: '22-25 tahun',
        title: 'Baru lulus, belum tahu harus melamar ke mana',
        desc: 'Minim pengalaman kerja bukan berarti minim skill. SAKTI membaca hasil kuliah, magang, dan proyek kampus kamu, lalu menunjukkan lowongan entry-level yang benar-benar cocok dengan background pendidikanmu, bukan sekadar posisi generik "fresh graduate welcome".',
      },
      {
        label: 'Career Switcher',
        meta: '26-35 tahun',
        title: 'Mau pindah bidang, tapi skill lama terasa sia-sia',
        desc: 'Skill dari pekerjaan lama sering lebih transferable dari yang kamu kira. SAKTI memetakan mana kemampuanmu yang tetap relevan di bidang baru, dan mana skill gap yang perlu ditutup dulu sebelum resmi pindah jalur karier.',
      },
      {
        label: 'Upskiller',
        meta: '25-40 tahun',
        title: 'Sudah kerja, tapi mentok di level yang sama',
        desc: 'SAKTI menunjukkan lowongan di level lebih tinggi yang cocok dengan pengalamanmu sekarang, plus skill spesifik yang paling mempercepat promosi atau pindah ke perusahaan dengan gaji lebih baik.',
      },
    ] satisfies ProfileTab[],
  },
  cta: {
    title: 'Upload CV kamu sekarang',
    lead: 'Nggak ada biaya, nggak ada komitmen. Cukup satu file CV untuk mulai lihat lowongan mana yang benar-benar cocok.',
    ctas: [
      { label: 'Upload CV & Mulai Sekarang', href: '/register' },
      { label: 'Lihat Pengembangan Skill', href: '/landing/pengembangan-skill', variant: 'ghost' as const },
    ],
    stats: [
      T('Gratis', 'Selamanya untuk pencari kerja'),
      N('<', 10, ' detik', 'Waktu proses CV'),
      N('<', 2, ' detik', 'Waktu matching'),
    ],
  },
}

/* ================================================ UNTUK PERUSAHAAN ======= */

export const perusahaan = {
  hero: {
    breadcrumb: 'Beranda / Perusahaan',
    eyebrow: 'Untuk HR manager, instansi & UMKM',
    title: 'Nggak perlu buka ratusan CV lagi. Biar sistem yang ranking kandidatnya.',
    lead: 'Pasang lowongan, dapat kandidat yang sudah diranking berdasarkan kecocokan skill dan pengalaman, bukan cuma kata kunci yang kebetulan cocok.',
    ctas: [
      { label: 'Jadwalkan Demo', href: '/landing/kontak' },
      { label: 'Lihat cara kerjanya', href: '/landing/cara-kerja', variant: 'ghost' as const },
    ],
    stats: [
      N('>', 40, '%', 'Target pengurangan time-to-hire'),
      N('<', 2, ' detik', 'Per kandidat untuk hasil skor'),
      N('>', 85, '%', 'Target akurasi kecocokan'),
    ],
  },
  problems: {
    eyebrow: 'Masalah yang kami selesaikan',
    title: 'Screening manual itu mahal, bukan cuma lama',
    lead: 'Semakin lama proses rekrutmen, semakin besar biaya operasional dan risiko kandidat terbaik direbut kompetitor.',
    items: [
      {
        number: '01',
        title: 'Volume lamaran kebanyakan',
        desc: 'Ratusan CV masuk untuk satu posisi, tapi tim HR cuma punya waktu untuk benar-benar baca sebagian kecil saja.',
      },
      {
        number: '02',
        title: 'Sulit filter yang truly qualified',
        desc: 'Kata kunci di CV nggak selalu mencerminkan kemampuan riil, jadi kandidat potensial sering terlewat begitu saja.',
      },
      {
        number: '03',
        title: 'Proses lambat, kandidat terbaik hilang',
        desc: 'Selagi proses screening manual berjalan berhari-hari, kandidat terbaik sudah diterima di tempat lain.',
      },
    ] satisfies NumberedItem[],
  },
  flow: {
    eyebrow: 'Alur rekrutmen dengan SAKTI',
    title: 'Dari posting lowongan sampai wawancara, lebih cepat',
    lead: 'Tiga tahap yang menggantikan proses screening manual berhari-hari.',
    steps: [
      {
        number: '01',
        name: 'Pasang lowongan',
        title: 'Isi kualifikasi sekali, sistem yang urus sisanya',
        desc: 'Masukkan detail posisi: skill yang dibutuhkan, level pendidikan, pengalaman, lokasi, dan rentang gaji. Sistem langsung mulai mencocokkan lowongan ini ke seluruh talent pool yang relevan.',
        points: [
          'Isi form lowongan dengan kualifikasi jelas',
          'Tandai skill wajib vs skill nilai plus',
          'Publish, lowongan langsung aktif dicocokkan',
        ],
      },
      {
        number: '02',
        name: 'Kandidat otomatis diranking',
        title: 'Lihat kandidat teratas, bukan tumpukan CV mentah',
        desc: 'Matchmaker Engine meranking setiap kandidat berdasarkan skor kecocokan yang transparan. Kamu bisa lihat kenapa kandidat A lebih tinggi dari kandidat B, bukan skor hitam kotak yang tidak bisa dijelaskan.',
        points: [
          'Kandidat masuk otomatis terurut dari skor tertinggi',
          'Lihat breakdown skor per kriteria',
          'Shortlist langsung dari dashboard',
        ],
      },
      {
        number: '03',
        name: 'Fokus di wawancara',
        title: 'Waktu tim HR habis untuk yang penting saja',
        desc: 'Karena kandidat yang muncul sudah tersaring berdasarkan kecocokan riil, tim HR bisa langsung masuk ke tahap wawancara tanpa perlu screening administratif yang menghabiskan waktu berhari-hari.',
        points: [
          'Jadwalkan wawancara langsung dari shortlist',
          'Bandingkan kandidat side-by-side',
          'Rekrutmen selesai lebih cepat',
        ],
      },
    ] satisfies EngineStep[],
  },
  profiles: {
    eyebrow: 'Cocok untuk skala apa saja',
    title: 'Dari tim HR korporat sampai UMKM tanpa dedicated HR',
    lead: 'Kebutuhan rekrutmen setiap organisasi beda, pendekatan kami menyesuaikan.',
    tabs: [
      {
        label: 'Korporat',
        meta: 'Corporate HR Manager',
        title: 'Handle banyak posisi sekaligus, butuh efisiensi',
        desc: 'Dashboard tunggal untuk memantau semua lowongan aktif dan kandidat teratasnya, jadi nggak perlu buka email atau spreadsheet terpisah untuk tiap posisi yang sedang dibuka.',
      },
      {
        label: 'Instansi Pemerintah',
        meta: 'Government Recruiter',
        title: 'Butuh transparansi dan audit trail yang jelas',
        desc: 'Setiap skor kecocokan bisa dijelaskan dan ditelusuri, membantu proses rekrutmen formasi tetap fair, terdokumentasi, dan sesuai standar akuntabilitas instansi.',
      },
      {
        label: 'UMKM',
        meta: 'SME Owner',
        title: 'Nggak punya tim HR, tapi tetap butuh kandidat tepat',
        desc: 'Cukup satu orang yang pasang lowongan dan lihat hasil ranking, nggak perlu proses rekrutmen berlapis seperti perusahaan besar untuk tetap menemukan kandidat yang pas.',
      },
    ] satisfies ProfileTab[],
  },
  cta: {
    title: 'Coba screening lebih cepat',
    lead: 'Jadwalkan demo singkat untuk lihat langsung bagaimana kandidat diranking otomatis untuk posisi yang sedang kamu buka.',
    ctas: [
      { label: 'Jadwalkan Demo', href: '/landing/kontak' },
      { label: 'Lihat Harga untuk Perusahaan', href: '/landing/harga', variant: 'ghost' as const },
    ],
    stats: [
      N('', 40, '%', 'Time-to-hire turun'),
      N('>', 85, '%', 'Target match accuracy'),
      T('Tanpa instalasi', 'Setup'),
    ],
  },
}

/* ==================================================== CARA KERJA ========= */

export const caraKerja = {
  hero: {
    breadcrumb: 'Beranda / Cara Kerja',
    eyebrow: 'Di balik layar SAKTI',
    title: 'Tiga sistem yang bekerja bersamaan setiap kali kamu upload CV.',
    lead: 'Nggak perlu paham istilah teknis untuk mengerti cara kerjanya. Ini penjelasan sesederhana mungkin, dari CV masuk sampai rekomendasi keluar.',
    ctas: [
      { label: 'Coba Gratis', href: '/register' },
      { label: 'Lihat semua FAQ', href: '/landing/faq', variant: 'ghost' as const },
    ],
    stats: [
      N('<', 10, ' detik', 'CV dibaca & dirangkum'),
      N('<', 2, ' detik', 'Satu lowongan dicocokkan'),
      N('<', 5, ' detik', 'Skill gap dianalisis'),
    ],
  },
  flow: {
    eyebrow: 'Alur end-to-end',
    title: 'Dari file CV sampai rekomendasi personal',
    lead: 'Tiga tahap ini berjalan berurutan, tapi semuanya terasa seperti satu proses yang mulus dari sisi kamu.',
    steps: [
      {
        number: '01',
        name: 'LLProfiler',
        title: 'Mesin yang membaca CV kamu seperti manusia baca, tapi jauh lebih cepat',
        desc: 'Bayangkan ada seseorang yang bisa baca CV kamu dan langsung tahu persis: nama, riwayat pendidikan, pengalaman kerja, dan skill apa saja yang kamu punya, termasuk yang tidak ditulis eksplisit tapi bisa disimpulkan dari deskripsi pekerjaanmu. Itulah yang LLProfiler lakukan, dalam waktu kurang dari 10 detik.',
        points: [
          'Kamu upload file CV (PDF atau Word)',
          'Sistem mengenali setiap bagian: kontak, riwayat, skill',
          'Skill dinormalisasi ke istilah standar industri',
          'Kamu tinjau hasilnya, edit kalau ada yang kurang pas',
        ],
      },
      {
        number: '02',
        name: 'Matchmaker',
        title: 'Mesin yang mencocokkan profilmu ke ribuan lowongan sekaligus',
        desc: 'Setelah profil kamu terbaca, Matchmaker membandingkannya ke setiap lowongan aktif di platform, bukan cuma cocokkan kata kunci, tapi menghitung skor kecocokan berdasarkan kombinasi skill, pengalaman, pendidikan, dan preferensi lokasi. Hasilnya keluar kurang dari 2 detik per lowongan, dan diproses ulang otomatis setiap ada lowongan baru.',
        points: [
          'Profil kamu dibandingkan ke seluruh lowongan aktif',
          'Setiap lowongan diberi skor kecocokan',
          'Hasil diranking dari yang paling cocok',
          'Alasan kecocokan ditampilkan secara transparan',
        ],
      },
      {
        number: '03',
        name: 'Talent Developer',
        title: 'Mesin yang menunjukkan langkah selanjutnya, bukan cuma kekurangan',
        desc: 'Untuk lowongan yang belum 100% cocok, Talent Developer menganalisis selisih antara skill kamu dan skill yang dibutuhkan, lalu mengurutkan berdasarkan mana yang paling berpengaruh terhadap kecocokan. Setiap skill gap dilengkapi 3-5 rekomendasi sumber belajar yang bisa difilter berdasarkan gratis/berbayar dan estimasi durasi.',
        points: [
          'Selisih skill dihitung dari lowongan target',
          'Skill gap diurutkan dari yang paling prioritas',
          'Rekomendasi belajar ditampilkan per skill gap',
          'Laporan diperbarui otomatis seiring waktu',
        ],
      },
    ] satisfies EngineStep[],
  },
  perf: {
    eyebrow: 'Kenapa bisa secepat ini',
    title: 'Kecepatan bukan kebetulan, tapi target yang dirancang',
    lead: 'Setiap engine punya target performa spesifik supaya pengalaman kamu tidak terasa seperti menunggu sistem lambat.',
    cards: [
      { value: '<10s', name: 'LLProfiler', desc: 'Waktu maksimal membaca dan merangkum satu CV secara lengkap.' },
      { value: '<2s', name: 'Matchmaker', desc: 'Waktu maksimal menghasilkan skor kecocokan satu pasangan profil-lowongan.' },
      { value: '<5s', name: 'Talent Developer', desc: 'Waktu maksimal menghasilkan laporan skill gap lengkap dengan rekomendasi.' },
      { value: '10rb+', name: 'Concurrent User', desc: 'Jumlah pengguna yang bisa dilayani bersamaan pada saat traffic tertinggi.' },
    ] satisfies StatCard[],
  },
  privacy: {
    eyebrow: 'Data kamu',
    title: 'Siapa yang bisa lihat profil hasil ekstraksi ini?',
    paragraphs: [
      'Hasil ekstraksi CV kamu disimpan sebagai data profil terstruktur yang hanya dipakai untuk keperluan pencocokan lowongan. Kamu selalu bisa meninjau, mengedit, atau menghapus data ini kapan saja.',
      'Perusahaan yang memasang lowongan hanya melihat profil kamu jika sistem menghasilkan skor kecocokan untuk lowongan mereka, bukan seluruh database talent secara bebas.',
    ],
  },
  cta: {
    title: 'Coba langsung rasakan sendiri',
    lead: 'Cara terbaik memahami cara kerjanya adalah dengan mencobanya sendiri lewat CV kamu.',
    ctas: [
      { label: 'Untuk Pencari Kerja', href: '/landing/untuk-pencari-kerja' },
      { label: 'Untuk Perusahaan', href: '/landing/untuk-perusahaan', variant: 'ghost' as const },
    ],
    stats: [
      N('<', 20, ' detik', 'Total alur end-to-end'),
      T('3 sistem', 'Terhubung jadi satu'),
      T('Real-time', 'Diproses ulang otomatis'),
    ],
  },
}

/* ============================================ PENGEMBANGAN SKILL ========= */

export const skill = {
  hero: {
    breadcrumb: 'Beranda / Pengembangan Skill',
    eyebrow: 'Talent Developer Engine',
    title: 'Tahu persis skill apa yang bikin kamu tertinggal, dan cara menutupnya.',
    lead: 'Bukan cuma laporan skill gap yang bikin bingung. Kamu dapat urutan prioritas belajar dan rekomendasi sumber belajar yang sesuai waktu dan budgetmu.',
    ctas: [
      { label: 'Cek Skill Gap Gratis', href: '/register' },
      { label: 'Lihat paket Plus & Pro', href: '/landing/harga', variant: 'ghost' as const },
    ],
    stats: [
      T('Top 10', 'Skill gap paling berpengaruh'),
      T('3-5', 'Rekomendasi belajar per skill'),
      N('<', 5, ' detik', 'Waktu analisis skill gap'),
    ],
  },
  why: {
    eyebrow: 'Kenapa ini berbeda',
    title: 'Bukan tes sekali jadi, tapi yang terus diperbarui',
    lead: 'Kebanyakan tes minat/bakat cuma dilakukan sekali dan hasilnya jadi basi. Punya SAKTI terus update seiring kamu belajar dan melamar kerja.',
    items: [
      {
        number: '01',
        title: 'Terhubung ke lowongan riil',
        desc: 'Skill gap dihitung berdasarkan lowongan yang benar-benar kamu incar, bukan template generik yang sama untuk semua orang.',
      },
      {
        number: '02',
        title: 'Terus diperbarui, bukan snapshot',
        desc: 'Setiap kali kamu update profil atau selesai belajar sesuatu, hasil analisis skill gap ikut berubah, bukan laporan statis sekali cetak.',
      },
      {
        number: '03',
        title: 'Rekomendasi yang bisa langsung dijalankan',
        desc: 'Bukan cuma "belajar SQL", tapi pilihan kursus spesifik lengkap dengan estimasi durasi dan apakah gratis atau berbayar.',
      },
    ] satisfies NumberedItem[],
  },
  preview: {
    eyebrow: 'Contoh hasil analisis',
    title: 'Begini bentuk rekomendasinya',
    lead: 'Ilustrasi tampilan skill gap report untuk seseorang yang mengincar posisi Data Analyst.',
    target: 'Staff Data Analyst',
    score: 68,
    rows: [
      {
        skill: 'SQL Intermediate',
        note: 'Skill paling berpengaruh, dibutuhkan di 89% lowongan sejenis',
        priority: 'Prioritas 1',
      },
      {
        skill: 'Data Visualization (Tableau/Looker)',
        note: 'Nilai plus signifikan di 64% lowongan sejenis',
        priority: 'Prioritas 2',
      },
      {
        skill: 'Statistik Dasar',
        note: 'Pelengkap yang memperkuat profil analitikmu',
        priority: 'Prioritas 3',
      },
    ] satisfies SkillGapRow[],
  },
  tiers: {
    eyebrow: 'Tingkatan akses',
    title: 'Mulai gratis, upgrade kalau butuh lebih dalam',
    lead: 'Skill gap report dasar selalu gratis. Fitur lanjutan tersedia untuk yang ingin lebih fokus.',
    list: [
      {
        name: 'Gratis',
        price: 'Rp0',
        unit: '/bulan',
        desc: 'Untuk mulai memahami skill gap dasar.',
        features: [
          'Skill gap report dasar',
          'Top 3 rekomendasi belajar',
          'Update tiap kali profil diubah',
        ],
        cta: { label: 'Mulai Gratis', href: '/register' },
      },
      {
        name: 'Plus',
        badge: 'Populer',
        price: 'Rp49rb–79rb',
        unit: '/bulan',
        desc: 'Untuk yang serius menutup skill gap dalam waktu dekat.',
        features: [
          'Semua di paket Gratis',
          'Top 10 skill gap lengkap',
          'Akses materi in-house terbatas',
        ],
        cta: { label: 'Lihat Detail Plus', href: '/landing/harga' },
      },
      {
        name: 'Pro',
        price: 'Rp129rb–199rb',
        unit: '/bulan',
        desc: 'Untuk career coaching penuh dan priority matching.',
        features: [
          'Semua di paket Plus',
          'Akses penuh library kursus in-house',
          'Mentoring & priority matching',
        ],
        cta: { label: 'Lihat Detail Pro', href: '/landing/harga' },
      },
    ] satisfies Tier[],
  },
  cta: {
    title: 'Cek skill gap kamu sekarang',
    lead: 'Gratis untuk laporan dasar. Lihat sendiri skill apa yang paling menahan kamu dari lowongan impian.',
    ctas: [
      { label: 'Cek Skill Gap Gratis', href: '/register' },
      { label: 'Lihat Fitur Pencari Kerja', href: '/landing/untuk-pencari-kerja', variant: 'ghost' as const },
    ],
    stats: [
      T('Selalu gratis', 'Laporan dasar'),
      N('<', 5, ' detik', 'Waktu analisis'),
      T('Berkelanjutan', 'Update seiring waktu'),
    ],
  },
}

/* ========================================================= HARGA ======== */

export const harga = {
  hero: {
    breadcrumb: 'Beranda / Harga',
    eyebrow: 'Transparan sejak awal',
    title: 'Gratis untuk pencari kerja. Bayar hanya kalau kamu perusahaan atau butuh lebih.',
    lead: 'Kami sengaja tidak mengenakan biaya ke pencari kerja, supaya makin banyak talent yang bisa ditemukan perusahaan, dan makin besar juga kesempatanmu untuk ditemukan.',
    ctas: [
      { label: 'Mulai Gratis', href: '/register' },
      { label: 'Hubungi Tim Kami', href: '/landing/kontak', variant: 'ghost' as const },
    ],
  },
  seeker: {
    eyebrow: 'Buat pencari kerja',
    title: 'Selalu gratis untuk fungsi dasar',
    lead: 'Cari lowongan, dapat rekomendasi, dan lihat skor kecocokan tanpa biaya sama sekali.',
    list: [
      {
        name: 'Seeker',
        badge: 'Selamanya gratis',
        price: 'Rp0',
        unit: '/bulan',
        desc: 'Semua yang kamu butuh untuk mulai cari kerja dengan cerdas.',
        features: [
          'Upload CV & profil otomatis terbaca',
          'Rekomendasi lowongan dengan skor kecocokan',
          'Skill gap report dasar',
          'Apply langsung dari dashboard',
        ],
        cta: { label: 'Mulai Sekarang', href: '/register' },
      },
    ] satisfies Tier[],
  },
  company: {
    eyebrow: 'Buat perusahaan',
    title: 'Pilih paket sesuai skala rekrutmenmu',
    lead: 'Semua paket termasuk akses ke Matchmaker Engine untuk kandidat yang otomatis diranking.',
    list: [
      {
        name: 'Starter',
        price: 'Mulai 50 USD',
        unit: '/listing',
        desc: 'Untuk UMKM atau kebutuhan rekrutmen sesekali.',
        features: [
          'Pay-per-post untuk satu lowongan',
          'Kandidat otomatis diranking',
          'Dashboard dasar',
        ],
        cta: { label: 'Pilih Starter', href: '/landing/kontak' },
      },
      {
        name: 'Business',
        badge: 'Paling Populer',
        price: '99–999 USD',
        unit: '/bulan',
        desc: 'Untuk tim HR dengan rekrutmen berkelanjutan.',
        features: [
          'Unlimited job posting',
          'Fitur AI matching premium',
          'Multi-user & role management',
          'Analitik rekrutmen lengkap',
        ],
        cta: { label: 'Pilih Business', href: '/landing/kontak' },
      },
      {
        name: 'Enterprise / Institusi',
        price: 'Custom',
        unit: '/kontrak',
        desc: 'Untuk instansi pemerintah atau korporat skala besar.',
        features: [
          'Akses database talent skala penuh',
          'Insight & analytics kelembagaan',
          'Audit trail & compliance support',
        ],
        cta: { label: 'Hubungi Kami', href: '/landing/kontak' },
      },
    ] satisfies Tier[],
  },
  skill: {
    eyebrow: 'Buat pengembangan skill',
    title: 'Upgrade kalau butuh coaching yang lebih dalam',
    lead: 'Laporan dasar tetap gratis. Ini untuk yang mau akses materi belajar dan mentoring lebih lengkap.',
    list: [
      {
        name: 'Gratis',
        price: 'Rp0',
        unit: '/bulan',
        desc: 'Skill gap report dasar untuk mulai memahami kekuranganmu.',
        features: ['Top 3 rekomendasi belajar', 'Update tiap profil diubah'],
        cta: { label: 'Mulai Gratis', href: '/register' },
      },
      {
        name: 'Plus',
        badge: 'Populer',
        price: 'Rp49rb–79rb',
        unit: '/bulan',
        desc: 'Akses materi in-house terbatas untuk belajar lebih fokus.',
        features: ['Top 10 skill gap lengkap', 'Materi in-house terbatas'],
        cta: { label: 'Pilih Plus', href: '/register' },
      },
      {
        name: 'Pro',
        price: 'Rp129rb–199rb',
        unit: '/bulan',
        desc: 'Paket tahunan diskon 35–40%. Untuk yang serius upskilling.',
        features: ['Akses penuh library kursus', 'Mentoring & priority matching'],
        cta: { label: 'Pilih Pro', href: '/register' },
      },
    ] satisfies Tier[],
  },
  faq: {
    eyebrow: 'Pertanyaan soal harga',
    title: 'Yang sering ditanyakan soal biaya',
    groups: [
      {
        label: 'Biaya',
        heading: 'Model harga SAKTI',
        items: [
          {
            q: 'Kenapa pencari kerja tidak dikenakan biaya sama sekali?',
            a: 'Semakin banyak pencari kerja yang bergabung tanpa hambatan biaya, semakin besar juga nilai platform ini bagi perusahaan yang mencari kandidat. Model ini menjaga agar kedua sisi, pencari kerja dan perusahaan, sama-sama diuntungkan.',
          },
          {
            q: 'Apakah ada kontrak minimum untuk paket Business?',
            a: 'Paket Business dapat dimulai secara bulanan tanpa kontrak jangka panjang. Diskon tersedia untuk komitmen tahunan.',
          },
          {
            q: 'Bagaimana cara mendapatkan harga Enterprise/Institusi?',
            a: 'Harga untuk instansi pemerintah atau korporat skala besar disesuaikan dengan cakupan data dan kedalaman insight yang dibutuhkan. Hubungi tim kami untuk diskusi kebutuhan spesifik.',
          },
        ],
      },
    ] satisfies FaqGroup[],
  },
  cta: {
    title: 'Masih bingung pilih paket?',
    lead: 'Ceritakan kebutuhanmu, tim kami bantu tentukan paket yang paling sesuai.',
    ctas: [
      { label: 'Hubungi Tim Kami', href: '/landing/kontak' },
      { label: 'Lihat Fitur Perusahaan', href: '/landing/untuk-perusahaan', variant: 'ghost' as const },
    ],
  },
}

/* =========================================================== FAQ ======== */

export const faqPage = {
  hero: {
    breadcrumb: 'Beranda / FAQ',
    eyebrow: 'Pusat bantuan',
    title: 'Semua pertanyaan yang mungkin ada di kepalamu.',
    lead: 'Dikelompokkan per topik biar kamu langsung nemu jawabannya tanpa scroll panjang.',
  },
  groups: [
    {
      label: 'Umum',
      heading: 'Tentang SAKTI secara umum',
      items: [
        {
          q: 'Apa itu SAKTI?',
          a: 'SAKTI adalah platform pencocokan kerja berbasis AI yang membantu pencari kerja menemukan lowongan yang sesuai, perusahaan menemukan kandidat yang tepat, dan siapa pun mengetahui skill apa yang perlu dikembangkan.',
        },
        {
          q: 'Apakah SAKTI tersedia di seluruh Indonesia?',
          a: 'Ya, platform ini dapat diakses dari mana saja secara daring. Lowongan yang tersedia bervariasi tergantung lokasi dan sektor yang sedang aktif di platform.',
        },
        {
          q: 'Apakah ada aplikasi mobile?',
          a: 'Saat ini SAKTI berjalan sebagai aplikasi web yang bisa dibuka dari browser mana saja. Aplikasi mobile khusus untuk iOS dan Android termasuk dalam rencana pengembangan selanjutnya.',
        },
      ],
    },
    {
      label: 'Buat Pencari Kerja',
      heading: 'Soal upload CV dan pencarian kerja',
      items: [
        {
          q: 'Apakah SAKTI benar-benar gratis untuk pencari kerja?',
          a: 'Ya. Akses dasar untuk mencari dan mendapatkan rekomendasi lowongan selalu gratis buat pencari kerja. Biaya hanya berlaku untuk fitur premium seperti coaching karier lanjutan di paket Plus dan Pro.',
        },
        {
          q: 'Format CV apa saja yang didukung?',
          a: 'SAKTI mendukung file CV dalam format PDF dan Word (DOCX). Pastikan CV berisi teks yang bisa dibaca, bukan hasil scan gambar.',
        },
        {
          q: 'Kalau hasil ekstraksi CV saya salah, bagaimana memperbaikinya?',
          a: 'Kamu selalu bisa meninjau dan mengedit hasil ekstraksi sebelum digunakan untuk pencarian lowongan. Sistem akan memperbarui rekomendasi begitu perubahan disimpan.',
        },
        {
          q: 'Berapa lama proses pencocokan lowongan?',
          a: 'CV kamu diproses di bawah 10 detik, dan hasil pencocokan lowongan muncul dalam waktu kurang dari 2 detik setelah profil selesai dibuat.',
        },
      ],
    },
    {
      label: 'Buat Perusahaan',
      heading: 'Soal posting lowongan dan screening kandidat',
      items: [
        {
          q: 'Kalau saya perusahaan kecil, bisa pakai SAKTI juga?',
          a: 'Bisa. SAKTI dirancang untuk perusahaan dari berbagai skala, mulai dari UMKM sampai instansi besar, dengan paket yang disesuaikan kebutuhan rekrutmen masing-masing.',
        },
        {
          q: 'Bagaimana skor kecocokan kandidat dihitung?',
          a: 'Matchmaker Engine menghitung skor berdasarkan kombinasi skill, pengalaman, pendidikan, dan kriteria lain yang kamu tentukan di form lowongan. Setiap skor dilengkapi penjelasan yang bisa ditelusuri, bukan angka hitam kotak.',
        },
        {
          q: 'Bisakah beberapa anggota tim HR mengakses akun yang sama?',
          a: 'Ya, paket Business dan Enterprise mendukung multi-user dengan pembagian peran seperti Admin, Recruiter, dan Viewer.',
        },
      ],
    },
    {
      label: 'Keamanan Data',
      heading: 'Soal privasi dan keamanan data kamu',
      items: [
        {
          q: 'Data CV saya aman nggak?',
          a: 'Data kamu hanya dipakai untuk mencocokkan dengan lowongan yang relevan, dan kamu selalu bisa meninjau atau mengedit hasil ekstraksi sebelum disebarkan ke perusahaan mana pun.',
        },
        {
          q: 'Siapa saja yang bisa melihat profil saya?',
          a: 'Perusahaan hanya melihat profilmu jika sistem menghasilkan skor kecocokan untuk lowongan yang mereka pasang, bukan mengakses seluruh database talent secara bebas.',
        },
      ],
    },
  ] satisfies FaqGroup[],
  cta: {
    title: 'Nggak ketemu jawabannya?',
    lead: 'Tim kami siap bantu jawab pertanyaan spesifik yang belum tercakup di sini.',
    ctas: [{ label: 'Hubungi Kami', href: '/landing/kontak' }],
  },
}

/* ==================================================== TENTANG KAMI ====== */

export const tentang = {
  hero: {
    breadcrumb: 'Beranda / Tentang Kami',
    eyebrow: 'Skill-Adaptive Knowledge and Talent Intelligence',
    title: 'Kami percaya cari kerja nggak harus terasa seperti tebak-tebakan.',
    lead: 'SAKTI lahir dari satu pengamatan sederhana: banyak lowongan kosong, banyak orang menganggur, tapi keduanya nggak pernah bertemu di tempat yang tepat.',
    ctas: [
      { label: 'Hubungi Kami', href: '/landing/kontak' },
      { label: 'Pelajari Cara Kerjanya', href: '/landing/cara-kerja', variant: 'ghost' as const },
    ],
  },
  problem: {
    eyebrow: 'Masalah yang kami lihat',
    title: 'Data yang membuat kami mulai membangun ini',
    items: [
      {
        number: '01',
        title: '7,3 juta+ menganggur',
        desc: 'Orang Indonesia masih menganggur menurut data terbaru, meski ribuan lowongan tetap kosong.',
      },
      {
        number: '02',
        title: 'Skill nggak nyambung',
        desc: 'Jadi alasan utama lulusan sulit terserap sesuai bidang studinya.',
      },
      {
        number: '03',
        title: 'Proses masih manual',
        desc: 'Rekrutmen didominasi proses manual yang memakan waktu dan biaya besar.',
      },
    ] satisfies NumberedItem[],
  },
  bridge: {
    eyebrow: 'Titik pertemuan',
    title: 'Ketimpangan ini terjadi di tengah, bukan di ujung',
    paragraphs: [
      'Ketimpangan ini bukan soal kurangnya lowongan atau kurangnya orang yang mau kerja. Masalahnya ada di tengah: data pencari kerja, lowongan, dan program pelatihan tersebar di berbagai tempat tanpa saling terhubung.',
      'SAKTI dibangun untuk menjadi titik pertemuan itu, lewat kecerdasan artifisial yang bisa dijelaskan, bukan kotak hitam yang cuma dipercaya begitu saja.',
    ],
  },
  vision: {
    eyebrow: 'Visi kami',
    title: 'Menghubungkan talenta dengan peluang yang tepat',
    lead: 'Lewat kecerdasan artifisial yang bisa dijelaskan, bukan kotak hitam yang cuma dipercaya begitu saja.',
    items: [
      {
        number: '01',
        title: 'Untuk pencari kerja',
        desc: 'Mendapatkan rekomendasi pekerjaan yang sesuai profil, plus guidance nyata untuk mengembangkan skill yang dibutuhkan.',
      },
      {
        number: '02',
        title: 'Untuk perusahaan',
        desc: 'Mendapatkan kandidat yang qualified lebih cepat, dengan biaya rekrutmen yang lebih efisien dari proses manual.',
      },
      {
        number: '03',
        title: 'Untuk pemerintah',
        desc: 'Mendapatkan insight tentang tren pasar tenaga kerja dan skill gap untuk mendukung perumusan kebijakan yang lebih tepat sasaran.',
      },
    ] satisfies NumberedItem[],
  },
  cta: {
    title: 'Ingin tahu lebih lanjut?',
    lead: 'Baik kamu pencari kerja, perwakilan perusahaan, atau tertarik kolaborasi kelembagaan, kami senang mendengar dari kamu.',
    ctas: [
      { label: 'Hubungi Kami', href: '/landing/kontak' },
      { label: 'Pelajari Cara Kerjanya', href: '/landing/cara-kerja', variant: 'ghost' as const },
    ],
  },
}

/* ========================================================= KONTAK ====== */

export const kontak = {
  help: {
    eyebrow: 'Sebelum menghubungi kami',
    title: 'Mungkin jawabannya sudah ada di sini',
    cards: [
      {
        title: 'Baru mau cari kerja?',
        desc: 'Lihat dulu bagaimana alur upload CV dan pencocokan lowongan bekerja.',
        label: 'Lihat halaman Pencari Kerja',
        href: '/landing/untuk-pencari-kerja',
      },
      {
        title: 'Mewakili perusahaan?',
        desc: 'Pelajari cara kerja screening otomatis dan paket yang tersedia.',
        label: 'Lihat halaman Perusahaan',
        href: '/landing/untuk-perusahaan',
      },
      {
        title: 'Ada pertanyaan umum?',
        desc: 'Cek dulu kumpulan pertanyaan yang sering ditanyakan.',
        label: 'Lihat semua FAQ',
        href: '/landing/faq',
      },
    ],
  },
}
