const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, type = 'student') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const toUserResponse = (user) => ({
  _id: user._id,
  nama: user.nama,
  nim: user.nim,
  jurusan: user.jurusan,
  email: user.email,
  role: user.role,
});

const toAdminResponse = (admin) => ({
  _id: admin._id,
  nama: admin.nama,
  email: admin.email,
  role: admin.role,
});

exports.register = async (req, res) => {
  try {
    const { nama, nim, jurusan, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    const adminExists = await Admin.findOne({ email });
    if (userExists || adminExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({ nama, nim, jurusan, email, password, role });
    res.status(201).json({ success: true, data: toUserResponse(user), token: generateToken(user._id, 'student') });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const userExists = await User.findOne({ email });
    const adminExists = await Admin.findOne({ email });

    if (userExists || adminExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const admin = await Admin.create({ nama, email, password });
    res.status(201).json({ success: true, data: toAdminResponse(admin), token: generateToken(admin._id, 'admin') });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (user.role === 'admin') {
      return res.status(401).json({ success: false, message: 'Silakan gunakan halaman login admin' });
    }
    if (await user.matchPassword(password)) {
      res.json({ success: true, data: toUserResponse(user), token: generateToken(user._id, 'student') });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (await admin.matchPassword(password)) {
      res.json({ success: true, data: toAdminResponse(admin), token: generateToken(admin._id, 'admin') });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, password_confirmation } = req.body;

    if (!email || !password || !password_confirmation) {
      return res.status(400).json({ 
        message: 'Email, password baru, dan konfirmasi password harus diisi.' 
      });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({ 
        message: 'Password baru dan konfirmasi password tidak cocok.' 
      });
    }

    let user = await User.findOne({ email: email });
    let admin = null;

    if (!user) {
      admin = await Admin.findOne({ email: email });
    }

    if (!user && !admin) {
      return res.status(404).json({ 
        message: 'Gagal mengubah password. Pastikan email benar dan terdaftar.' 
      });
    }

    if (admin) {
      admin.password = password; 
      await admin.save();
    } else {
      user.password = password; 
      await user.save();
    }

    return res.status(200).json({ 
      message: 'Password berhasil diubah! Silakan login.' 
    });

  } catch (error) {
    console.error('Error di resetPassword:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan pada server backend.' 
    });
  }
};