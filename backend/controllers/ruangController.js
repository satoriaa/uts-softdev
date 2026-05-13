const Ruang = require('../models/Ruang');

exports.getAll = async (req, res) => {
  try {
    const data = await Ruang.find().sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Ruang.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Ambil data dari req.body (teks)
    const payload = { ...req.body };
    
    // Konversi lantai ke Number karena FormData mengirimkan semuanya sebagai string
    if (payload.lantai) payload.lantai = Number(payload.lantai);

    // Cek jika ada file yang diunggah (dari multer)
    if (req.file) {
      // Jika pakai Cloudinary: payload.gambar = req.file.path;
      // Jika simpan lokal: payload.gambar = `/uploads/${req.file.filename}`;
      payload.gambar = req.file.path || req.file.filename; 
    }

    const data = await Ruang.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    // Jika validasi mongoose gagal, errornya akan ditangkap di sini
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.lantai) payload.lantai = Number(payload.lantai);

    // Jika user mengupdate gambar baru
    if (req.file) {
      payload.gambar = req.file.path || req.file.filename;
    }

    const data = await Ruang.findByIdAndUpdate(req.params.id, payload, { 
      new: true, 
      runValidators: true 
    });

    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Ruang.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};