# Admin Dashboard Fullstack

Proyek ini adalah dashboard admin fullstack dengan **Next.js** (frontend), **Node.js + Express** (backend), **MongoDB Atlas** (database), dan **Cloudinary** (penyimpanan gambar).

---

## Struktur Folder

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

## Fitur Backend (11 Modul CRUD)

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

## Setup & Menjalankan

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

## API Endpoints

Catatan format:
- Semua respons umumnya berbentuk JSON dengan field `success` dan (untuk list) `data: [...]`.
- Untuk endpoint admin-only, gunakan header `Authorization: Bearer <token>`.

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `/api/auth/register` | POST | Register user (student) |
| `/api/auth/admin/register` | POST | Register admin |
| `/api/auth/login` | POST | Login user (student) |
| `/api/auth/admin/login` | POST | Login admin |
| `/api/auth/me` | GET | Ambil data user/admin yang sedang login |
| `/api/auth/me` | PUT | Update profil user/admin (support upload gambar field `gambar`) |
| `/api/auth/reset-password` | POST | Reset password (user/admin) |
| `/api/users` | GET | List users (admin-only) |
| `/api/users` | POST | Create user (admin-only) |
| `/api/users/:id` | GET | Detail user |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Hapus user (admin-only) |
| `/api/karya` | GET | List karya |
| `/api/karya` | POST | Create karya (upload `gambar` via Cloudinary) |
| `/api/karya/:id` | GET | Detail karya |
| `/api/karya/:id` | PUT | Update karya (upload `gambar` via Cloudinary) |
| `/api/karya/:id/like` | POST | Like karya (student-only/protected) |
| `/api/karya/:id/like` | DELETE | Un-like karya |
| `/api/karya/:id` | DELETE | Hapus karya |
| `/api/ruang` | GET | List ruang |
| `/api/ruang` | POST | Create ruang (admin-only) |
| `/api/ruang/:id` | GET | Detail ruang |
| `/api/ruang/:id` | PUT | Update ruang (admin-only) |
| `/api/ruang/:id` | DELETE | Hapus ruang (admin-only) |
| `/api/pinjaman` | GET | List pinjaman (admin-only via route protect) |
| `/api/pinjaman/ruang/:ruangId` | GET | Pinjaman untuk ruang tertentu |
| `/api/pinjaman/priority` | GET | Ambil pending dengan prioritas tertinggi |
| `/api/pinjaman` | POST | Buat pinjaman (student-only via protect) |
| `/api/pinjaman/:id` | GET | Detail pinjaman |
| `/api/pinjaman/:id` | PUT | Update pinjaman (admin-only via authorizeAdmin) |
| `/api/pinjaman/:id/ack` | PUT | Acknowledge pinjaman |
| `/api/pinjaman/:id/finish` | PUT | Finish pinjaman |
| `/api/pinjaman/:id` | DELETE | Hapus pinjaman (admin-only) |
| `/api/event` | GET | List event |
| `/api/event` | POST | Create event (admin-only, upload `gambar` via Cloudinary) |
| `/api/event/:id` | GET | Detail event |
| `/api/event/:id` | PUT | Update event (admin-only, upload `gambar` via Cloudinary) |
| `/api/event/:id` | DELETE | Hapus event (admin-only) |
| `/api/proker` | GET/POST/PUT/DELETE | CRUD proker |
| `/api/lomba` | GET/POST/PUT/DELETE | CRUD lomba |
| `/api/tenant` | GET/POST/PUT/DELETE | CRUD tenant |
| `/api/workshop` | GET/POST/PUT/DELETE | CRUD workshop |
| `/api/majalah` | GET/POST/PUT/DELETE | CRUD majalah |


---

## Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Cloudinary
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Axios, Lucide React
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary

---

## Catatan

- Pastikan `.env` di backend sudah benar (terutama `CLOUDINARY_*` jika ingin upload gambar).
- Untuk fitur admin-only, gunakan header `Authorization: Bearer <token>`.

---

## Project status (update: 2026-05-09)

Recent work in this repository (what changed and how to use it):

- Added a reusable admin CRUD component: `frontend/app/components/CrudPage.tsx`.
    - Features: list, create, edit, delete via the existing axios client (`frontend/lib/axios.ts`).
    - Supports field types: text, number, textarea, date, password, select, file (with preview).
    - Automatically sends FormData when file fields are present (multipart/form-data).
    - Includes small UI enhancements: search, client-side pagination, image thumbnail column, status badges, and a two-column form layout that follows the admin dashboard styling.
    - Integrates with the Cloudinary upload widget via a hidden input (`id="cloudinary-gambar-url"`) used by the widget in `frontend/app/dashboard_admin/users/page.tsx`.

- Admin pages updated to use the new component and to be client components (moved/added `"use client"` at the top):
    - `frontend/app/dashboard_admin/event/page.tsx`
    - `frontend/app/dashboard_admin/karya/page.tsx`
    - `frontend/app/dashboard_admin/lomba/page.tsx`
    - `frontend/app/dashboard_admin/majalah/page.tsx`
    - `frontend/app/dashboard_admin/pinjaman/page.tsx`
    - `frontend/app/dashboard_admin/proker/page.tsx`
    - `frontend/app/dashboard_admin/ruang/page.tsx`
    - `frontend/app/dashboard_admin/tenant/page.tsx`
    - `frontend/app/dashboard_admin/workshop/page.tsx`
    - `frontend/app/dashboard_admin/users/page.tsx`

- Why this matters: Next.js requires components that use hooks (useEffect/useState) to be client components; pages that import `CrudPage` were converted to client pages to avoid runtime build errors.

## How to use `CrudPage`

Place the `CrudPage` component in a page and pass these props:

- `endpoint` (string): API path relative to the axios base (e.g. `/event`, `/karya`).
- `title` (string, optional): page/section title.
- `fields` (array): field definitions with shape { name, label, type?, required?, options? }.

Example (see admin pages under `frontend/app/dashboard_admin/*`):

```
<CrudPage
    title="Daftar Agenda Kreatif"
    endpoint="/event"
    fields={[
        { name: 'judul', label: 'Nama Event', required: true },
        { name: 'deskripsi', label: 'Konsep & Deskripsi', type: 'textarea', required: true },
        { name: 'tanggal', label: 'Waktu Pelaksanaan', type: 'date', required: true },
        { name: 'gambar', label: 'Poster Event (upload)', type: 'file', required: true },
    ]}
/>
```

Notes on fields and behavior:
- File fields accept a File object or (when using Cloudinary widget) you can set the hidden input `cloudinary-gambar-url` — the component will include file uploads as multipart/form-data.
- The component expects the backend list endpoints to return an object with `data` array (e.g. `{ data: [...] }`) — this is how existing frontend pages consume API results.

## Pages that already use `CrudPage`
- All admin modules (Event, Karya, Lomba, Majalah, Pinjaman, Proker, Ruang, Tenant, Workshop, Users) render `CrudPage` with module-specific fields. See `frontend/app/dashboard_admin/*/page.tsx`.

## Build & test notes

- Before running the frontend, install dependencies and start both servers:

```powershell
cd backend; npm install; npm run dev
cd ../frontend; npm install; npm run dev
```

- If you see an error about `'use client' directive must be placed before other expressions`, make sure any page importing client components places `"use client"` as the first line of the file. The admin pages have been updated to include this where required.

- Recommended quick checks:
    - Run `npm run build` in `frontend` to typecheck and surface any TypeScript/Next build errors.
    - Run `npm run dev` for local development to visually verify the admin pages and CRUD flows.

## Next steps (optional enhancements)
- Add server-side pagination and filtering support in the API to avoid loading large lists on the client.
- Improve per-field validation and error display in `CrudPage`.
- Add automated tests for the CRUD flows (small integration tests against a test backend or mocked axios).
- Add role-based UI elements (hide admin-only pages/buttons when user role !== admin).

If you'd like, I can run the frontend build now and fix any issues the build reports (type errors or placement of "use client").

