# DAS STOK AKRAB

Aplikasi berbasis web untuk manajemen stok paket kuota dengan sistem CRUD.

## Fitur Aplikasi

- Menampilkan daftar paket kuota (dashboard publik, hanya lihat)
- CRUD paket pada halaman management (login diperlukan)
- Field harga dan area/catatan
- Edit stok inline di tabel management
- Broadcast data ke webhook (dua URL, disimpan di DB)
- Halaman Area (tabel area XL) dengan data dinamis dari sumber referensi

## Teknologi

- Frontend: HTML, CSS (Bootstrap 5), JavaScript
- Backend: Node.js + Express
- Database: MySQL (mysql2/promise)

## Konfigurasi Lingkungan

Buat file `.env` (opsional, fallback tersedia):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=stok_kuota
PORT=3000
JWT_SECRET=ubah-ini
```

## Setup Database

1. Buat database dan import schema + contoh data:
   - Import `server/db.sql` ke MySQL

## Menjalankan Aplikasi (Lokal)

```
npm install
npm start
```

Akses:
- Dashboard: http://localhost:3000/
- Login: http://localhost:3000/login (username: admin, password: admin123)
- Management: http://localhost:3000/management
- Area: http://localhost:3000/area

## Deployment

### Opsi A: Docker

1. Build image:
   ```
   docker build -t das-stok-akrab:latest .
   ```
2. Jalankan container (sesuaikan env & network/db):
   ```
   docker run -d \
     -p 3000:3000 \
     -e DB_HOST=your-db-host \
     -e DB_USER=your-db-user \
     -e DB_PASSWORD=your-db-pass \
     -e DB_NAME=stok_kuota \
     -e PORT=3000 \
     -e JWT_SECRET=ubah-ini \
     --name das-stok-akrab \
     das-stok-akrab:latest
   ```

### Opsi B: PM2 (VPS/Bare Metal)

1. Install deps & PM2:
   ```
   npm install --production
   npm i -g pm2
   ```
2. Jalankan dengan PM2:
   ```
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Catatan Produksi

- Ganti `JWT_SECRET` dengan nilai kuat
- Batasi akses `POST /api/broadcast` dan `/api/settings/webhooks` pada pengguna yang dipercaya
- Pastikan MySQL dihardening dan backup berkala
- Aktifkan HTTPS di reverse proxy (Nginx/Caddy) di depan aplikasi
