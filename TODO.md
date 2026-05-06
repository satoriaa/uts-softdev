# TODO
- [ ] Cek format upload Cloudinary: gunakan url/secure_url dari req.file (atau implementasi agar payload gambar pakai result secure_url)
- [ ] Perbaiki backend controller yang saat ini memakai `req.file.path`; ganti dengan `req.file.secure_url` (atau `req.file.path` jika CloudinaryStorage memang mengembalikan URL)
- [ ] Tambahkan logging di middleware upload/controller untuk memastikan struktur `req.file`
- [ ] Pastikan frontend CrudPage mengirim field name `gambar` sesuai `upload.single('gambar')`
- [ ] Test alur upload via endpoint POST/PUT (misal /api/karya)

