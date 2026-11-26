# Tennis Gear 🎾
### Tennis Equipment & Specifications

**Proyek akhir Praktikum Pemrograman Perangkat Bergerak (PPB)** dengan platform **Progressive Web Apps (PWA)** dan bahasa **JavaScript**. Website katalog perlengkapan tenis: raket, sepatu, tas, dan aksesori. Kode program ini menggunakan **satu platform saja: PWA** (bukan Android Studio/Flutter/React Native).

## 1. Checklist syarat tugas akhir

| Ketentuan | Implementasi |
|---|---|
| Salah satu platform | PWA + JavaScript + React/Vite (Modul 4–5) |
| API buatan sendiri | REST API Node.js + Express (Modul 1) |
| Database API | Supabase PostgreSQL wajib, tanpa database JSON lokal |
| Bottom Navigation Bar | Navigasi tetap di bagian bawah, responsive |
| Minimal 5 halaman | Home, Rackets, Shoes, Bags, Accessories, About, Saved (7 halaman utama) |
| Minimal 2 halaman list | Rackets, Shoes, Bags, Accessories (4 kategori) |
| Detail tiap produk | Rute `/product/:slug` — foto ilustrasi, deskripsi, highlights, specifications |
| Profile/About | `/about` dengan profil praktikan (isi nama/NIM) |
| PWA | Web App Manifest, installable, icon, service worker, cache app shell & GET API |

## 2. Teknologi

- **Frontend:** JavaScript (JSX), React, React Router, Vite, CSS responsif, `vite-plugin-pwa`.
- **Backend/API:** JavaScript, Node.js, Express, CORS, Supabase SDK.
- **Database:** Supabase PostgreSQL wajib pada development dan production; JSON hanya untuk seed awal.
- **API testing:** Postman collection tersedia di folder `postman/`.
- **Tambahan:** `localStorage` hanya untuk daftar produk favorit (materi Modul 5).

> React adalah library JavaScript di dalam proyek PWA, **bukan platform aplikasi kedua**.

## 3. Cara menjalankan di Windows (Supabase wajib)

Prasyarat: **Node.js 20.19+** dan npm. Pastikan memiliki koneksi internet pada instalasi paket pertama.

1. Extract folder ZIP dan buka folder `TennisGear-PWA` di VS Code.
2. Buka terminal PowerShell di root proyek.
3. Jalankan:

```powershell
npm install
npm run dev
```

4. Buka **http://localhost:5173** di browser.
5. Backend API aktif di **http://localhost:4000/api/health**.

**Penting:** Jangan hanya membuka `client/index.html` lewat File Explorer; proyek harus dijalankan melalui Vite dan Express.

Jika ingin menjalankan dua terminal terpisah:

```powershell
# Terminal 1: backend
npm run dev:api
# Terminal 2: frontend
npm run dev:client
```

Supabase wajib untuk menjalankan backend. REST API tidak membaca JSON sebagai database. File seed digunakan hanya untuk impor data awal.

## 4. Menghubungkan Supabase (Modul 1)

1. Buat proyek Supabase dan buka **SQL Editor**.
2. Jalankan isi file `server/sql/schema.sql` untuk membuat tabel `public.products`.
3. Salin `server/.env.example` menjadi `server/.env`.
4. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di file `server/.env` berdasarkan project Supabase milikmu.
5. Isi `ADMIN_KEY` dengan string rahasia panjang buatanmu agar operasi tulis ke API aman.
6. Jalankan seed produk (hanya setelah tabel ada):

```powershell
npm run seed:supabase
```

7. Restart backend: `npm run dev` atau `npm run dev:api`.
8. Cek `http://localhost:4000/api/health` — nilai `storage` akan menjadi `supabase`.

**Keamanan:** `SUPABASE_SERVICE_ROLE_KEY` dan `ADMIN_KEY` **tidak boleh ditaruh di file frontend, variabel `VITE_`, atau commit GitHub**. Service role key hanya disimpan di server. RLS dinyalakan dan tidak ada policy public; pengunjung membaca produk melalui API Express saja.

## 5. REST API buatan sendiri

Response API berbentuk JSON. Contoh endpoint:

| Metode | Endpoint | Kegunaan |
|---|---|---|
| GET | `/api/health` | Status backend dan mode database |
| GET | `/api/categories` | Kategori beserta jumlah item |
| GET | `/api/products` | Semua produk katalog |
| GET | `/api/products?category=rackets` | List raket |
| GET | `/api/products?category=shoes` | List sepatu |
| GET | `/api/products?search=blade` | Pencarian judul, brand, dan deskripsi |
| GET | `/api/products?brand=Wilson&sort=name` | Filter merek + urut |
| GET | `/api/products?featured=true&limit=4` | Produk unggulan untuk Home |
| GET | `/api/products/wilson-blade-98-v9` | Detail 1 produk |
| POST | `/api/products` | Tambah produk (header `x-admin-key`) |
| PUT | `/api/products/:slug` | Ubah produk (header `x-admin-key`) |
| DELETE | `/api/products/:slug` | Hapus produk (header `x-admin-key`) |

Parameter listing tambahan: `page`, `limit`, `sort=featured|name|brand|newest`. Halaman list dan detail React melakukan `fetch` ke endpoint ini — data produk **tidak** di-hardcode di komponen frontend. Ada juga penanganan error dan 404.

Contoh uji di Postman / browser:

```
GET http://localhost:4000/api/products?category=rackets
GET http://localhost:4000/api/products/wilson-blade-98-v9
```

Untuk uji otomatis sederhana, setelah server hidup:

```powershell
npm run test:api
```

Untuk POST/PUT/DELETE impor koleksi `postman/TennisGear.postman_collection.json` ke Postman; isi variabel `admin_key` sesuai isi `ADMIN_KEY`. Bila `ADMIN_KEY` kosong, seluruh operasi tulis sengaja dinonaktifkan, sementara GET tetap berfungsi.

## 6. Fitur dan alur penggunaan

1. Pengunjung membuka Home dan memilih kategori.
2. Halaman kategori menjalankan `GET /api/products?category=...`, menampilkan list dan filter.
3. Item diklik → URL `/product/<slug>` → `GET /api/products/<slug>` → spesifikasi detail.
4. Klik ikon hati untuk menyimpan favorit di `localStorage` → halaman Saved.
5. Bottom Navigation Bar memudahkan berpindah antara Home, Rackets, Shoes, Bags dan About.
6. Aksesori dapat dibuka lewat kartu kategori di Home atau menu desktop.
7. PWA dapat dipasang lewat pilihan **Install app** pada Chrome/Edge setelah build dan akses melalui HTTPS (atau localhost).

**PWA offline:** UI/HTML/CSS/JS yang sudah dikunjungi dicache oleh service worker. GET API yang pernah berhasil diakses dicache dengan strategi `NetworkFirst` dan dapat digunakan saat offline. Data API yang **belum pernah dimuat** tidak otomatis tersedia offline. Saat development, perilaku service worker bisa berbeda; uji mode produksi lewat `npm run build` dan `npm run preview`.

## 7. Build dan deployment

Build frontend:

```powershell
npm run build
npm run preview
```

- **Frontend:** Deploy folder `client` ke Vercel sebagai Vite project (Build Command: `npm run build`, Output Directory: `dist`). `client/vercel.json` menangani refresh pada rute detail.
- **Backend:** Deploy folder `server` sebagai Node Web Service di Render/Railway/hosting Node yang mendukung Express (Install: `npm install`, Start: `npm start`).
- Isi variabel env backend `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_KEY`, `CLIENT_ORIGIN=https://nama-webmu.vercel.app`.
- Isi env frontend **di Vercel**: `VITE_API_BASE_URL=https://nama-api-kamu` (tanpa `/api` di akhir).
- Deploy ulang frontend setelah mengubah env. Jangan pernah menaruh service role key di env frontend.
- Hosting frontend dan API harus HTTPS supaya fitur install PWA berjalan normal.

Jika hanya meng-host frontend di Vercel tetapi tidak men-deploy backend atau tidak mengatur `VITE_API_BASE_URL`, fetch API tidak akan bekerja di produksi. Pastikan dua komponen deploy dan terhubung.

## 8. Struktur folder

```
TennisGear-PWA/
├── client/
│   ├── public/              # favicon, PWA icons
│   ├── src/
│   │   ├── components/      # layout, product cards, vector product art
│   │   ├── pages/           # Home, Category, Detail, About, Saved, NotFound
│   │   ├── lib/             # REST API fetch, React hooks, favorites
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── vite.config.js       # PWA manifest + service worker + API proxy
│   └── vercel.json
├── server/
│   ├── data/products.json  # data 22 produk untuk demo dan seed Supabase
│   ├── sql/schema.sql      # tabel Supabase
│   ├── scripts/            # seed database dan test API
│   ├── .env.example
│   └── index.js            # self-built REST API + CRUD
├── postman/
└── README.md
```

## 9. Sebelum dikumpulkan

- [ ] Ubah **nama praktikan dan NIM** di `client/src/pages/About.jsx`.
- [ ] Jalankan `npm install` + `npm run dev`, pastikan tidak ada error.
- [ ] Pastikan halaman Home, Rackets, Shoes, Bags, Accessories, About dan detail bisa dibuka.
- [ ] Buktikan GET `/api/products` dan GET detail pada Postman.
- [ ] Sebaiknya gunakan Supabase sesuai Modul 1, bukan mengandalkan file JSON demo pada versi final.
- [ ] Sesuaikan spesifikasi produk dengan sumber resmi jika akan dinilai berdasarkan akurasi data. **Dataset bawaan bersifat demonstrasi** dan gambar produk adalah ilustrasi SVG orisinal, bukan foto resmi pabrikan.
- [ ] Ambil screenshot Home, daftar produk, detail spesifikasi, About, Postman, bukti koneksi Supabase, dan fitur PWA.
- [ ] Jangan unggah `.env` atau credential ke GitHub.

## 10. Catatan materi dan data

Modul 1: API REST, Node.js/Express, Supabase, pengujian API. Modul 4: React + Vite, routing, manifest dan service worker. Modul 5: fetch/REST API, state management, localStorage, Vercel. Proyek ini **tidak menggunakan Android Studio, Flutter atau React Native**.

Spesifikasi produk dan deskripsi bersifat **contoh edukasional**. Variasi tahun/model/market dapat memiliki spesifikasi berbeda; untuk penggunaan di luar tugas akhir, verifikasi data setiap item pada laman resmi produsen.


## Revisi backend Modul 1 (Supabase only)

REST API Express dipisah menjadi Router (server/src/routes), Controller (server/src/controllers), Model (server/src/models), konfigurasi Supabase (server/src/config) dan middleware. Database runtime tunggal adalah Supabase PostgreSQL. File server/seeds/products.json hanya sumber impor awal saat menjalankan seed script, bukan database. Kredensial service role key tetap di backend dan tidak boleh di-push.

