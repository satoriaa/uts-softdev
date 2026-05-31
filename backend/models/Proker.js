const mongoose = require('mongoose');

const prokerSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  tanggal: { type: Date, required: true },
  jam: { type: String },
  tempat: { type: String, required: true },
  namaPembicara: { type: String },

  gambar: { type: String },

  kapasitas: { type: Number, required: true, min: 0 },
  googleFormUrl: { type: String, required: true },

  pendaftar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


module.exports = mongoose.model('Proker', prokerSchema);