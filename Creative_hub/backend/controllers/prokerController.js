const Proker = require('../models/Proker');

exports.getAll = async (req, res) => {
  try {
    const data = await Proker.find().populate('pendaftar', 'nama nim');
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Proker.findById(req.params.id).populate('pendaftar', 'nama nim');
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
    const data = await Proker.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gambar = req.file.path;
    const data = await Proker.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Proker.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.daftar = async (req, res) => {
  try {
    const proker = await Proker.findById(req.params.id);
    if (!proker) return res.status(404).json({ success: false, message: 'Not found' });

    const userId = req.user.id;

    const isAlreadyRegistered = proker.pendaftar.some((id) => String(id) === String(userId));
    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah terdaftar untuk proker ini',
      });
    }

    const kapasitas = proker.kapasitas ?? 0;
    const filled = proker.pendaftar.length;
    if (filled >= kapasitas) {
      return res.status(400).json({
        success: false,
        message: 'Pendaftaran ditutup (kapasitas penuh)',
      });
    }

    proker.pendaftar.push(userId);
    await proker.save();

    res.json({ success: true, data: proker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};