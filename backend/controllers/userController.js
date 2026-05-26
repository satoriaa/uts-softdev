const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (req.userType === 'user' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this user' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gambar = req.file.secure_url || req.file.path;

    const user = await User.create(payload);
    const safe = (({ _id, nama, nim, jurusan, email, role, gambar }) => ({ _id, nama, nim, jurusan, email, role, gambar }))(user);
    res.status(201).json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    if (req.userType === 'user' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { nama, nim, jurusan, email, password, role } = req.body;
    if (nama) user.nama = nama;
    if (nim) user.nim = nim;
    if (jurusan) user.jurusan = jurusan;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role && req.userType === 'admin') user.role = role;

    if (req.file) user.gambar = req.file.secure_url || req.file.path;

    await user.save();
    const updated = await User.findById(user._id).select('-password');
    const safe = (({ _id, nama, nim, jurusan, email, role, gambar }) => ({ _id, nama, nim, jurusan, email, role, gambar }))(updated);
    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

