const mongoose = require('mongoose');

const prokerSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  tanggal: { type: Date, required: true },
  tempat: { type: String, required: true },
  // TAMBAHKAN FIELD GAMBAR DI BAWAH INI:
  gambar: { type: String }, 
  pendaftar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Proker', prokerSchema);