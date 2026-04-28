const Tenant = require('../models/Tenant');

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
    // Convert comma-separated string to array for listJualan
    if (typeof payload.listJualan === 'string') {
      payload.listJualan = payload.listJualan.split(',').map((s) => s.trim()).filter(Boolean);
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
    // Convert comma-separated string to array for listJualan
    if (typeof payload.listJualan === 'string') {
      payload.listJualan = payload.listJualan.split(',').map((s) => s.trim()).filter(Boolean);
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
