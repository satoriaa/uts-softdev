const mongoose = require('mongoose');

const karyaSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  gambar: { type: String },
  komen: [{ text: String, user: String, tanggal: { type: Date, default: Date.now } }],
  like: { type: Number, default: 0 },
  tanggal: { type: Date, default: Date.now },
  username: { type: String, required: true },
  nim: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Karya', karyaSchema);

