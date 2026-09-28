# Alur Proses: Render Katalog & Navigasi Roadmap

Bagaimana interaksi Frontend saat pengguna mengakses fitur **Katalog Roadmap**.

1. **Akses Halaman (`/learning-paths/catalog`)**
   - Komponen Next.js melakukan *mount* halaman.
   - `useEffect` atau inisiasi komponen akan memanggil *wrapper API* `seekerApi.getRoleCatalog()`.

2. **Pengolahan State & Render Kategori**
   - Hasil kembalian (berisi *array* objek role profesi: IT, Bisnis, Marketing) disimpan dalam *state* lokal.
   - Data dikelompokkan (*grouping*) berdasarkan kategori. UI memetakan *card* dengan ikon *lucide-react* (contoh: `Monitor`, `Briefcase`, `Megaphone`).

3. **Pilihan (Preview Panel)**
   - Saat pengguna mengklik salah satu *Role Card*, `selectedRole` di-*set*.
   - Sebelah kanan menampilkan `RolePreviewPanel` yang memunculkan detail role tersebut dan tombol **"Buat Roadmap dari Nol"**.

4. **Meminta AI Membuat Roadmap (Custom Hook `useFreeLearningPath`)**
   - Saat tombol diklik, Hook `useFreeLearningPath` dipicu.
   - Melakukan `POST` ke *endpoint backend* (`generateFreeLearningPath`) dan menunjukkan status *Loading* di UI (`TalentForger sedang meracik kurikulum...`).
   - Apabila selesai, pengguna secara otomatis dinavigasikan (menggunakan `router.push()`) ke halaman rute `/job-seeker/learning-paths/catalog/[roleSlug]/roadmap`.

5. **Resolusi Active State Navbar**
   - Komponen `<DashboardTopBar />` membaca *path url* saat ini. Karena *path* berawalan `catalog`, sistem mematikan menu "Roadmap Belajarmu" dan menyalakan (status aktif warna biru) menu "Katalog Roadmap". *Breadcrumb* merender `Overview / Katalog Roadmap / Detail Roadmap`.
