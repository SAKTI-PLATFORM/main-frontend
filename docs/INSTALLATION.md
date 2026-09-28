# Instalasi Main Frontend (Next.js)

Panduan untuk menjalankan *User Interface* aplikasi secara lokal.

## Persyaratan
- Node.js (direkomendasikan v18 atau v20)
- npm atau yarn

## Langkah-langkah

1. **Clone & Install Dependencies**
   Masuk ke direktori `main-frontend` dan jalankan perintah:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**
   Salin `.env.example` ke `.env.development` atau `.env.local`, dan pastikan variabel URL menunjuk ke *backend* Anda:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. **Menjalankan Server**
   ```bash
   npm run dev
   ```
   Aplikasi Next.js akan berjalan di `http://localhost:3000`.

4. **Kompilasi ke Produksi (Opsional)**
   Untuk menguji *build* produksi:
   ```bash
   npm run build
   npm run start
   ```
