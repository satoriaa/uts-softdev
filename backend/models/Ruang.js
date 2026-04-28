const mongoose = require('mongoose');

const ruangSchema = new mongoose.Schema(
  {
    namaRuang: { type: String, required: true },
    lantai: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'tersedia', 'tidak_tersedia'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ruang', ruangSchema);
