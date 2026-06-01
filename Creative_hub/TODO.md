# TODO - Refresh tetap login (tanpa logout)

- [x] Audit auth flow saat refresh pada `frontend/app/dashboard_user/layout.tsx` dan cek kondisi yang memicu logout/redirect.
- [x] Ubah logic hydration agar hanya redirect saat token tidak ada/invalid, dan pastikan token dibaca dari localStorage sebelum pengecekan.
- [x] Rapikan dependency `useEffect` supaya tidak memicu logout berulang saat `isHydrating`.
- [x] Pastikan guard role hanya dijalankan setelah user berhasil di-hydrate dari `/api/auth/me`.
- [ ] Jalankan build/dev (opsional) dan cek skenario: login -> refresh -> tetap di dashboard.


