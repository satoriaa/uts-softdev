const mongoose = require('mongoose');

const majalahSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: Date, required: true },
    gambar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Majalah', majalahSchema);

