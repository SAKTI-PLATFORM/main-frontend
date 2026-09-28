# Teknologi & Arsitektur (Main Frontend)

Aplikasi klien dibangun menggunakan *stack* web modern yang mementingkan kecepatan, SEO, dan pengalaman pengguna (*User Experience*) yang interaktif.

## Stack Teknologi Utama
1. **Next.js (App Router)**: Framework React untuk *Server-Side Rendering* (SSR) dan *routing*.
2. **React (TypeScript)**: Pembangunan komponen *user interface* dengan pengetikan ketat.
3. **Tailwind CSS**: *Utility-first* CSS framework untuk kemudahan *styling* yang responsif dan konsisten.
4. **Zustand**: *State management* klien yang ringan (digunakan untuk *Dashboard View* state).
5. **Lucide React**: Kumpulan *icon* SVG bersih dan fleksibel.

## Arsitektur & Pola Desain
- **Pola Komponen**: Komponen dipisah menjadi unit-unit re-usable di `/src/components`. (contoh: UI fundamental di `/ui`, spesifik halaman di `/dashboard`).
- **Data Fetching (API Layer)**: Seluruh pemanggilan HTTP dibungkus ke dalam file `/src/api` (contoh: `seeker.api.ts`) untuk memisahkan *logic* UI dengan *data layer*.
- **Routing Berbasis Fitur**: Struktur `app/` mengelompokkan halaman berdasarkan persona (`/job-seeker`) dan fitur (`/learning-paths`).
