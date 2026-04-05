# SAKTI AI — Frontend

> Antarmuka pengguna platform *job matching* SAKTI AI berbasis *Progressive Web App* (PWA).

## Progress

- [x] Inisialisasi proyek Next.js 
- [x] Konfigurasi TypeScript dan App Router
- [x] Setup Tailwind CSS 4
- [x] Konfigurasi ESLint 9
- [x] Konfigurasi struktur folder dan *routing* global
- [ ] Implementasi halaman *Job Seeker Portal*
- [ ] Implementasi halaman *Recruiter Portal*
- [ ] Implementasi dasbor Government & Companies
- [ ] Integrasi REST API backend (Axios)
- [ ] Implementasi fitur *Match Score* dan visualisasi *skill gap*
- [ ] Implementasi autentikasi (JWT)

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Linting | ESLint 9 |

## Struktur Folder

```
src/
└── app/
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
```

## Instalasi

```bash
# Clone repo
git clone https://github.com/SAKTI-PLATFORM/main-frontend.git
cd sakti-frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan *development server* |
| `npm run build` | *Build* untuk *production* |
| `npm run start` | Jalankan *production server* |
| `npm run lint` | Cek kode dengan ESLint |

## Deployment

Deploy bisa menggunakan [Vercel](https://vercel.com/new):

1. Push kode ke GitHub
2. Import repository di Vercel
3. Deploy otomatis setiap push ke `main`

## Dokumentasi Terkait

Repositori dokumentasi lengkap (PRD, market research, CJM) tersedia di:
[SAKTI-PLATFORM/sakti-product-docs](https://github.com/SAKTI-PLATFORM/sakti-product-docs)
