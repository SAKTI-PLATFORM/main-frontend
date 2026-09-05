/**
 * Konten landing page SAKTI.
 *
 * Sumber teks berasal dari brief JSON produk. Nilai statistik dipecah menjadi
 * { prefix, value, decimals, suffix } supaya bisa dianimasikan sebagai angka
 * berjalan (lihat CountUp di _components/primitives.tsx). Nilai non-numerik
 * memakai { text } dan hanya di-reveal biasa.
 *
 * Catatan: brief hanya memuat daftar pertanyaan FAQ tanpa jawaban. Jawaban di
 * bawah ditulis mengacu pada informasi lain di brief yang sama.
 */

export type Stat = {
  /** Angka yang dihitung dari 0. Kosongkan untuk nilai teks murni. */
  value?: number
  prefix?: string
  suffix?: string
  decimals?: number
  /** Dipakai bila nilai bukan angka (mis. "Gratis"). */
  text?: string
  label: string
}

export type NavIcon = 'briefcase' | 'gem' | 'roadmap'

export const nav = {
  // "kegunaan" is the only trigger with a hover dropdown (the mega menu
  // below); Harga and Cara Kerja are now plain links straight to the page.
  triggers: [
    { id: 'beranda', label: 'Beranda', href: '/landing' },
    { id: 'kegunaan', label: 'Kegunaan' },
    { id: 'harga', label: 'Harga', href: '/landing/harga' },
    { id: 'cara-kerja', label: 'Cara Kerja', href: '/landing/cara-kerja' },
  ],
  masuk: { label: 'Masuk', href: '/login' },
  cta: { label: 'Coba Gratis', href: '/register' },
}

/** Mega menu under "Kegunaan": left tabs, right feature list per tab. */
export const navMega = {
  tabs: [
    {
      id: 'pencari-kerja',
      label: 'Untuk Pencari Kerja',
      href: '/landing/untuk-pencari-kerja',
      description:
        'Temukan pekerjaan yang benar-benar cocok dengan skill dan kepribadianmu, lalu tutup skill gap dengan roadmap belajar yang dipersonalisasi.',
      items: [
        {
          icon: 'briefcase' as NavIcon,
          title: 'Cari Lowongan',
          desc: 'Jelajahi ribuan lowongan yang di-ranking sesuai profil kamu',
          href: '/landing/untuk-pencari-kerja#alur',
        },
        {
          icon: 'gem' as NavIcon,
          title: 'Cek Skill Gap',
          desc: 'Lihat skill apa yang perlu diasah untuk role impian',
          href: '/landing/pengembangan-skill',
        },
        {
          icon: 'roadmap' as NavIcon,
          title: 'Roadmap Belajar',
          desc: 'Ikuti jalur belajar terarah dari hasil analisis AI',
          href: '/landing/cara-kerja#alur',
        },
      ],
    },
    {
      id: 'perusahaan',
      label: 'Untuk Perusahaan',
      href: '/landing/untuk-perusahaan',
      description:
        'Pasang lowongan sekali, biar sistem yang meranking kandidat berdasarkan skill dan pengalaman, bukan sekadar kata kunci di CV.',
      items: [
        {
          icon: 'briefcase' as NavIcon,
          title: 'Ranking Kandidat',
          desc: 'Kandidat diurutkan otomatis berdasarkan skor kecocokan',
          href: '/landing/untuk-perusahaan#alur',
        },
        {
          icon: 'gem' as NavIcon,
          title: 'Screening Otomatis',
          desc: 'Pangkas waktu screening berhari-hari jadi hitungan menit',
          href: '/landing/untuk-perusahaan#alur',
        },
        {
          icon: 'roadmap' as NavIcon,
          title: 'Pasang Lowongan',
          desc: 'Susun detail lowongan dan kualifikasi dalam sekali isi',
          href: '/landing/untuk-perusahaan#alur',
        },
      ],
    },
  ],
}

export const hero = {
  headline: 'Capek kirim lamaran ke mana-mana tapi nggak nyambung? SAKTI yang carikan.',
  subheadline:
    'Upload CV kamu sekali, biar sistem yang cari lowongan yang beneran cocok, sekaligus kasih tau skill apa yang masih perlu diasah biar makin gampang keterima.',
  ctaPrimary: { label: 'Cari kerja yang cocok', href: '/register' },
  ctaSecondary: { label: 'Saya HR / Perekrut', href: '/register?role=recruiter' },
  stats: [
    { prefix: '<', value: 10, suffix: ' detik', label: 'Proses CV otomatis' },
    { prefix: '<', value: 2, suffix: ' detik', label: 'Hasil pencocokan lowongan' },
    { text: 'Gratis', label: 'Untuk pencari kerja' },
  ] satisfies Stat[],
}

export const builtFor = {
  eyebrow: 'KEMAMPUAN INTI YANG BEKERJA SAMA DI SATU PLATFORM',
  themes: ['Job Matching AI', 'Skill Gap Advisor', 'Labor Analytics', 'LMProfiler', 'Matchmaker'],
}

export const problemStats: Stat[] = [
  {
    value: 7.3,
    decimals: 1,
    suffix: ' juta+',
    label: 'Orang Indonesia masih menganggur, sementara ribuan lowongan kosong',
  },
  {
    text: 'Berminggu-minggu',
    label: 'Waktu rata-rata cari kerja lewat lamaran satu-satu',
  },
  {
    text: 'Skill nggak nyambung',
    label: 'Jadi alasan #1 lamaran ditolak, padahal bisa dibenerin',
  },
]

export const whoItsFor = {
  eyebrow: 'BUAT SIAPA SAKTI BERGUNA',
  headline: 'Tiga masalah nyata, satu platform yang menyelesaikannya',
  subtext:
    'Nggak peduli kamu lagi cari kerja, lagi cari kandidat, atau lagi mau naik level skill. Semuanya jalan dari satu tempat.',
  segments: [
    {
      id: 'pencari-kerja',
      number: '01',
      eyebrow: 'BUAT PENCARI KERJA',
      title: 'Upload CV sekali, dapat rekomendasi yang beneran nyambung',
      description:
        'Nggak perlu apply satu-satu ke ratusan lowongan yang belum tentu cocok. Sistem otomatis baca pengalaman dan skill kamu, lalu tunjukkan lowongan yang paling sesuai, lengkap dengan alasan kenapa cocok.',
      steps: [
        'Upload CV kamu (PDF atau Word)',
        'Sistem rangkum skill & pengalaman otomatis',
        'Dapat daftar lowongan yang di-ranking',
      ],
      cta: { label: 'Pelajari lebih lanjut', href: '/register' },
    },
    {
      id: 'perusahaan',
      number: '02',
      eyebrow: 'BUAT HR & PEREKRUT',
      title: 'Nggak perlu buka ratusan CV satu-satu lagi',
      description:
        'Pasang lowongan, sistem otomatis mencocokkan dan meranking kandidat berdasarkan skill dan pengalaman, bukan cuma kata kunci di CV. Waktu screening berhari-hari bisa dipangkas jadi hitungan menit.',
      steps: [
        'Pasang detail lowongan & kualifikasi',
        'Sistem meranking kandidat by skor',
        'Fokus wawancara ke yang paling potensial',
      ],
      cta: { label: 'Pelajari lebih lanjut', href: '/register?role=recruiter' },
    },
    {
      id: 'skill',
      number: '03',
      eyebrow: 'BUAT YANG MAU NAIK LEVEL',
      title: 'Tau persis skill apa yang bikin lamaran ditolak',
      description:
        'Setelah dicocokkan dengan lowongan impian, SAKTI kasih tau skill apa saja yang masih kurang, lalu rekomendasi tempat belajar sesuai budget dan waktu kamu.',
      steps: [
        'Sistem bandingkan skill kamu vs kebutuhan lowongan',
        'Dapat daftar skill gap yang diurutkan prioritas',
        'Pilih rekomendasi belajar gratis atau berbayar',
      ],
      cta: { label: 'Pelajari lebih lanjut', href: '/register' },
    },
  ],
}

export const howItWorks = {
  eyebrow: 'SESEDERHANA INI',
  headline: 'Tiga langkah, nggak pakai ribet',
  subtext: 'Nggak perlu bikin profil panjang atau isi form berlembar-lembar.',
  steps: [
    {
      number: '01',
      title: 'Upload CV kamu',
      description:
        'Format PDF atau Word biasa. Sistem otomatis membaca dan mengambil pengalaman, pendidikan, serta skill kamu dalam hitungan detik.',
    },
    {
      number: '02',
      title: 'Cek & sunting hasilnya',
      description:
        'Lihat rangkuman profil kamu, koreksi kalau ada yang kurang pas. Kamu tetap pegang kendali penuh atas datamu sendiri.',
    },
    {
      number: '03',
      title: 'Dapat rekomendasi personal',
      description:
        'Terima daftar lowongan yang cocok, lengkap dengan skor kecocokan dan saran belajar untuk menutup kekurangan skill.',
    },
  ],
  cta: { label: 'Lihat detail cara kerja lengkap', href: '#cara-kerja' },
}

export const testimonials = {
  eyebrow: 'CONTOH HASIL NYATA',
  headline: 'Begini rasanya pakai SAKTI',
  subtext: 'Skenario ilustratif berdasarkan alur pengguna yang dirancang di dalam produk.',
  items: [
    {
      quote:
        'Biasanya saya kirim lamaran ke 50 tempat baru dapat panggilan. Sekarang begitu upload CV langsung ketemu 8 lowongan yang memang klop sama skill saya.',
      name: 'RA',
      role: 'Fresh graduate',
      context: 'Lulusan Akuntansi',
    },
    {
      quote:
        'Dulu screening 200 CV bisa makan waktu 3 hari sendiri. Sekarang tinggal lihat 15 kandidat teratas yang sudah di-ranking sistem, langsung fokus wawancara.',
      name: 'HR',
      role: 'Staf Rekrutmen',
      context: 'Perusahaan swasta',
    },
    {
      quote:
        'Ternyata cuma kurang skill SQL yang bikin lamaran saya selalu ditolak. Sekarang saya tahu apa yang harus dipelajari dan dari mana.',
      name: 'DP',
      role: 'Career switcher',
      context: 'Dari admin ke data analyst',
    },
  ],
}

export const faq = {
  eyebrow: 'SERING DITANYAKAN',
  headline: 'Pertanyaan yang mungkin ada di kepalamu',
  items: [
    {
      q: 'Apakah SAKTI benar-benar gratis untuk pencari kerja?',
      a: 'Ya. Semua fitur inti untuk pencari kerja (unggah CV, pencocokan lowongan, dan analisis skill gap) gratis selamanya dan tanpa kartu kredit. Biaya hanya berlaku untuk paket perusahaan.',
    },
    {
      q: 'Data CV saya aman nggak?',
      a: 'Aman. CV kamu hanya dipakai untuk mencocokkan lowongan dan menganalisis skill. Kamu bisa meninjau, menyunting, atau menghapus data profilmu kapan saja, dan datamu tidak dijual ke pihak ketiga.',
    },
    {
      q: 'Berapa lama proses pencocokan lowongan?',
      a: 'CV diproses otomatis dalam waktu kurang dari 10 detik, lalu hasil pencocokan lowongan muncul dalam waktu kurang dari 2 detik setelahnya.',
    },
    {
      q: 'Kalau saya perusahaan kecil, bisa pakai SAKTI juga?',
      a: 'Bisa. SAKTI cocok untuk tim rekrutmen berapa pun ukurannya. Pasang satu lowongan atau puluhan, sistem tetap meranking kandidat berdasarkan skill dan pengalaman, bukan sekadar kata kunci.',
    },
    {
      q: 'Rekomendasi belajar yang diberikan seperti apa?',
      a: 'Setelah skill gap-mu teridentifikasi, SAKTI menyarankan materi belajar yang diurutkan berdasarkan prioritas, mulai dari kursus gratis sampai berbayar, disesuaikan dengan waktu dan anggaran yang kamu punya.',
    },
  ],
  cta: { label: 'Lihat semua FAQ', href: '#faq' },
}

export const finalCta = {
  headline: 'Siap coba cara baru cari kerja?',
  subtext:
    'Nggak perlu tunggu sampai lelah kirim lamaran ke mana-mana. Upload CV sekarang, lihat sendiri lowongan mana yang benar-benar cocok buat kamu.',
  ctaPrimary: { label: 'Upload CV & Mulai Sekarang', href: '/register' },
  ctaSecondary: { label: 'Lihat Demo untuk Perusahaan', href: '/register?role=recruiter' },
  stats: [
    { prefix: '>', value: 85, suffix: '%', label: 'Target akurasi' },
    { prefix: 'Turun >', value: 40, suffix: '%', label: 'Target penurunan waktu screening' },
    { text: 'Rp0 selamanya', label: 'Biaya untuk pencari kerja' },
  ] satisfies Stat[],
}

export const footer = {
  tagline:
    'Platform pencocokan kerja berbasis AI yang bantu pencari kerja, perusahaan, dan siapa pun yang mau naik level skill di Indonesia.',
  columns: {
    Produk: [
      { label: 'Buat Pencari Kerja', href: '/landing/untuk-pencari-kerja' },
      { label: 'Buat Perusahaan', href: '/landing/untuk-perusahaan' },
      { label: 'Pengembangan Skill', href: '/landing/pengembangan-skill' },
      { label: 'Cara Kerja', href: '/landing/cara-kerja' },
    ],
    Perusahaan: [
      { label: 'Tentang Kami', href: '/landing/tentang-kami' },
      { label: 'Harga', href: '/landing/harga' },
      { label: 'Hubungi Kami', href: '/landing/kontak' },
    ],
    Bantuan: [
      { label: 'FAQ', href: '/landing/faq' },
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
    ],
  } as Record<string, { label: string; href: string }[]>,
  copyright: '© 2026 SAKTI. Semua hak dilindungi.',
}
