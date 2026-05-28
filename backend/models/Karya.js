const mongoose = require('mongoose');

const karyaSchema = new mongoose.Schema({
  // owner reference (optional for existing documents)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  gambar: { type: String },
  komen: [{ text: String, user: String, tanggal: { type: Date, default: Date.now } }],
  // keep numeric 'like' for backward compatibility but prefer likedBy.length
  like: { type: Number, default: 0 },
  // track which users liked this karya to enforce one-like-per-user
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tanggal: { type: Date, default: Date.now },
  username: { type: String, required: true },
  nim: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Karya', karyaSchema);