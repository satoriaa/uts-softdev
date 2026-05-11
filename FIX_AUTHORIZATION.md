# Perbaikan Authorization Admin

## Masalah yang Ditemukan
Middleware `authorizeAdmin` di file `backend/middleware/auth.js` tidak cukup kuat untuk menangani semua kasus. Ada kemungkinan:
1. Admin documents di database tidak memiliki field `role` yang di-set dengan benar
2. Tidak ada tracking terhadap tipe user (admin vs regular user)
3. Debug information tidak cukup untuk men-trace masalahnya

## Solusi yang Diterapkan

### 1. Update Middleware Auth (`backend/middleware/auth.js`)
- Menambahkan `req.userType` untuk tracking tipe user yang sedang login
- Middleware `authorizeAdmin` sekarang lebih explicit dalam check:
  - Memverifikasi `req.userType === 'admin'` PLUS
  - Memverifikasi `req.user.role === 'admin'`
- Menambahkan console.log debug info untuk troubleshooting

### 2. Fix Database Script (`fix-admin-role.js`)
Script untuk memperbaiki admin documents yang ada di database yang mungkin tidak memiliki field `role`.

## Cara Menjalankan Fix

### Step 1: Jalankan Fix Script
```bash
cd d:\SEMESTER3\UAS\QUIZ\uts-softdev
node fix-admin-role.js
```

### Step 2: Restart Backend Server
```bash
# Terminal di folder backend/
npm start
# atau jika menggunakan nodemon
npm run dev
```

### Step 3: Test Authorization
1. Login sebagai admin di http://localhost:3000/login/admin
2. Coba tambah event di dashboard admin
3. Jika berhasil, masalah sudah teratasi

## Jika Masih Bermasalah

1. **Cek console backend** - akan ada debug info:
```
Authorization failed: {
  userType: 'admin',
  userRole: 'admin',
  userId: '...'
}
```

2. **Verifikasi Token** - pastikan localStorage punya token:
   - Buka DevTools (F12)
   - Go to Application > Local Storage
   - Cari key `token` - pastikan ada valuenya

3. **Cek Network** - di DevTools Network tab:
   - POST request ke `/api/event` harus punya Authorization header
   - Response harus 201 (success) atau 403 (auth failed dengan debug info)

## File yang Diubah
- `backend/middleware/auth.js` - Enhanced authorization logic
- `fix-admin-role.js` - Baru, untuk fix database

## File yang Ditambah
- `fix-admin-role.js` - Script untuk fix admin role di database
