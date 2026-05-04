# Admin Dashboard Fullstack

Proyek ini adalah dashboard admin fullstack dengan **Next.js** (frontend), **Node.js + Express** (backend), **MongoDB Atlas** (database), dan **Cloudinary** (penyimpanan gambar).

---

## 📁 Struktur Folder

```
uts-softdev/
├── backend/          # API Server (Node.js + Express)
│   ├── config/       # DB & Cloudinary config
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & upload
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── .env          # Environment variables
│   └── server.js     # Entry point
└── frontend/         # Web App (Next.js 14)
    ├── app/          # App Router pages
    ├── components/   # Reusable components
    ├── lib/          # API client
    └── store/        # Zustand auth store
```

---

## 🚀 Fitur Backend (11 Modul CRUD)

1. **Auth** — Login & Register (JWT)
2. **Karya** — Kelola karya (judul, deskripsi, komen, like)
3. **Ruang** — Kelola ruangan (nama, lantai, status)
4. **Pinjaman** — Validasi pinjaman ruang (pending/terima/tolak)
5. **Event** — Kelola event (judul, deskripsi, ketentuan, lokasi, pembicara)
6. **Proker** — Program kerja
7. **Lomba** — Kelola lomba
8. **Tenant** — Kelola tenant & list jualan
9. **Workshop** — Kelola workshop
10. **Majalah** — Kelola majalah (nama, deskripsi, harga)
11. **Users** — Kelola user (admin/student)

---

## ⚙️ Setup & Menjalankan

### 1. Backend

```bash
cd backend
npm install

# Edit .env (sudah ada, sesuaikan jika perlu)
# MONGODB_URI sudah diatur ke MongoDB Atlas

npm run dev    # atau: node server.js
```

Server akan berjalan di **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install    # axios, zustand, lucide-react sudah terinstall
npm run dev
```

Aplikasi akan berjalan di **http://localhost:3000**

---

## 🔌 API Endpoints

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `/api/auth/register` | POST | Register user |
| `/api/auth/login` | POST | Login user |
| `/api/users` | GET/POST/PUT/DELETE | Kelola users |
| `/api/karya` | GET/POST/PUT/DELETE | Kelola karya |
| `/api/ruang` | GET/POST/PUT/DELETE | Kelola ruang |
| `/api/pinjaman` | GET/POST/PUT/DELETE | Kelola pinjaman |
| `/api/event` | GET/POST/PUT/DELETE | Kelola event |
| `/api/proker` | GET/POST/PUT/DELETE | Kelola proker |
| `/api/lomba` | GET/POST/PUT/DELETE | Kelola lomba |
| `/api/tenant` | GET/POST/PUT/DELETE | Kelola tenant |
| `/api/workshop` | GET/POST/PUT/DELETE | Kelola workshop |
| `/api/majalah` | GET/POST/PUT/DELETE | Kelola majalah |

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Cloudinary
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Axios, Lucide React
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary

---

## 📝 Catatan

- Pastikan `.env` di backend sudah benar (terutama `CLOUDINARY_*` jika ingin upload gambar).
- Untuk fitur admin-only, gunakan header `Authorization: Bearer <token>`.

