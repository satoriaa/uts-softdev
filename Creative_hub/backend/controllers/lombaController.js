const Lomba = require('../models/Lomba');

exports.getAll = async (req, res) => {
  try {
    const data = await Lomba.find().populate('pendaftar', 'nama nim');
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Lomba.findById(req.params.id).populate('pendaftar', 'nama nim');
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
    const data = await Lomba.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gambar = req.file.path;
    const data = await Lomba.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Lomba.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.daftar = async (req, res) => {
  try {
    const lomba = await Lomba.findById(req.params.id);
    if (!lomba) return res.status(404).json({ success: false, message: 'Not found' });
    if (!lomba.pendaftar.includes(req.user.id)) {
      lomba.pendaftar.push(req.user.id);
      await lomba.save();
    }
    res.json({ success: true, data: lomba });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

