const Admin = require('../models/Admin');

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin email already exists' });
    }
    const admin = await Admin.create({ nama, email, password });
    res.status(201).json({ success: true, data: { _id: admin._id, nama: admin.nama, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const { nama, email, password, gambar } = req.body;
    if (nama) admin.nama = nama;
    if (email) admin.email = email;
    if (password) admin.password = password;

    // dukung update foto profil dari Cloudinary widget (secure_url string)
    // atau dari upload file biasa (jika ada)
    if (gambar) admin.gambar = gambar;
    if (req.file) admin.gambar = req.file.secure_url || req.file.path;


    await admin.save();
    res.json({ success: true, data: { _id: admin._id, nama: admin.nama, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    await admin.remove();
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
