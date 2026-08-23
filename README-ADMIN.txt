CV MUDAMAS MANDIRI - ADMIN V11
================================
Paket ini hanya berisi bagian ADMIN. Tidak ada index/home website.

LANGKAH DEPLOY:
1. Upload SEMUA file dalam ZIP ini ke root repository GitHub Pages Anda (semua sejajar).
2. Jalankan admin-database-v11.sql di Supabase SQL Editor sekali.
3. Pastikan login admin lama tetap ada di Authentication:
   username website: admin
   email internal: admin@admin.mudamas.local
4. Buka admin-login.html.

HALAMAN:
- admin-login.html
- admin-dashboard.html
- admin-projects.html
- admin-finance.html
- admin-partners.html
- admin-reports.html
- admin-settings.html

PENTING:
- Jangan taruh Supabase Secret/Service Role Key di file frontend.
- File supabase-config.js hanya menggunakan Publishable Key.
