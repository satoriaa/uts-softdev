const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    listJualan: [{ type: String }],
    gambar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);

