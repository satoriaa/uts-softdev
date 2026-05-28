const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
    ketentuan: { type: String, required: true },
    lokasi: { type: String, required: true },
  tanggal: { type: Date, required: true },
  gambar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);