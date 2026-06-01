const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    listJualan: [{ type: String }],
    proker: { type: String, required: true },
    gambar: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);