# Struktur Routing (Main Frontend)

Aplikasi klien difokuskan pada portal khusus pencari kerja (*Job Seeker Portal*). Semuanya berada di dalam *route group* `(portal)/job-seeker`.

## Rute Halaman Dashboard Utama

- `/job-seeker`: Halaman beranda (*Dashboard*) utama, berisi rangkuman aktivitas (Summary).
- `/job-seeker/personality`: Menampilkan laporan grafis hasil asesmen psikometri pengguna (OCEAN/RIASEC).
- `/job-seeker/job-matches`: Menampilkan *Career Forecast*, hasil pencocokan sistem AI dengan berbagai lowongan pekerjaan dan *role* yang tepat.
- `/job-seeker/learning-paths`: Memuat daftar *Roadmap Belajarmu*, yaitu *roadmap* personal yang dihasilkan berdasarkan *skill gap*.
- `/job-seeker/learning-paths/[matchId]/roadmap`: Halaman detail *roadmap* berisi modul, rute, dan progres (terhubung dengan *job match*).

## Rute Katalog & Eksplorasi
- `/job-seeker/learning-paths/catalog`: **Katalog Roadmap**, daftar puluhan/ratusan *role* profesi yang bisa dieksplor di luar rekomendasi AI.
- `/job-seeker/learning-paths/catalog/[roleSlug]/roadmap`: Halaman detail *roadmap* hasil *generate free-role* dari Katalog.
- `/job-seeker/settings`: Pengaturan akun pengguna.
