const Tenant = require('../models/Tenant');

exports.getByProker = async (req, res) => {
  try {
    const { prokerNama } = req.query;
    if (!prokerNama || typeof prokerNama !== 'string') {
      return res.status(400).json({ success: false, message: 'prokerNama wajib berupa string' });
    }

    const data = await Tenant.find({ proker: prokerNama });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Tenant.find();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Tenant.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) payload.gambar = req.file.path;

    if (typeof payload.listJualan === 'string') {
      payload.listJualan = payload.listJualan
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Validation: proker must exist by name
    if (!payload.proker) {
      return res.status(400).json({ success: false, message: 'Proker wajib diisi' });
    }

    const Proker = require('../models/Proker');
    const prokerFound = await Proker.findOne({ nama: payload.proker });
    if (!prokerFound) {
      return res.status(400).json({ success: false, message: 'Proker tidak terdaftar' });
    }

    const data = await Tenant.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) payload.gambar = req.file.path;

    if (typeof payload.listJualan === 'string') {
      payload.listJualan = payload.listJualan
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Validation: proker must exist by name
    if (!payload.proker) {
      return res.status(400).json({ success: false, message: 'Proker wajib diisi' });
    }

    const Proker = require('../models/Proker');
    const prokerFound = await Proker.findOne({ nama: payload.proker });
    if (!prokerFound) {
      return res.status(400).json({ success: false, message: 'Proker tidak terdaftar' });
    }

    const data = await Tenant.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const data = await Tenant.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};