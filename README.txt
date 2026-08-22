CV MUDAMAS MANDIRI — WEBSITE V8 ADMIN ENTRY

Semua file berada sejajar dalam satu folder (tanpa subfolder).

File utama:
- index.html            Website perusahaan
- style.css             Seluruh styling website + admin login
- app.js                Interaksi website utama
- admin-login.html      Halaman login administrator
- admin-login.js        Interaksi halaman login
- logo-mudamas.png      Logo perusahaan
- file gambar lainnya   Aset visual website

Catatan keamanan:
Halaman login belum terhubung ke backend/authentication. Tidak ada username/password hardcoded di file. Integrasi autentikasi aman dilakukan saat dashboard admin dibangun.

V9 SUPABASE ADMIN AUTH
- Login admin menggunakan Username + Password.
- Supabase Auth tetap memakai email internal yang dibentuk otomatis dari username.
- Jalankan supabase-setup.sql sebelum login pertama.
- Buat akun admin di Supabase Authentication sesuai SETUP-ADMIN.txt.
- Dashboard admin: admin-dashboard.html
- Semua file tetap sejajar, tanpa subfolder.
