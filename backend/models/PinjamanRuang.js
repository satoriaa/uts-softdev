const mongoose = require('mongoose');

const pinjamanSchema = new mongoose.Schema({
  ruang: { type: mongoose.Schema.Types.ObjectId, ref: 'Ruang', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tanggalPinjam: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'terima', 'tolak'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('PinjamanRuang', pinjamanSchema);
