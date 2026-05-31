const mongoose = require('mongoose');

const lombaSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: Date, required: true },
    tempat: { type: String, required: true },
    pendaftar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    gambar: { type: String },
    googleFormUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lomba', lombaSchema);