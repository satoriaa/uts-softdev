const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Tetap di-import jika dibutuhkan di tempat lain

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const toUserResponse = (user) => ({
  _id: user._id,
  nama: user.nama,
  nim: user.nim,
  jurusan: user.jurusan,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  try {
    const { nama, nim, jurusan, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await User.create({ nama, nim, jurusan, email, password, role });
    res.status(201).json({ success: true, data: toUserResponse(user), token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ success: true, data: toUserResponse(user), token: generateToken(user._id) });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNGSI UNTUK MERESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    // 1. Tangkap data yang dikirim dari Frontend (lupa.tsx)
    const { email, password, password_confirmation } = req.body;

    // 2. Validasi Dasar
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

    // 3. Cari user di database MongoDB berdasarkan Email
    const user = await User.findOne({ email: email });

    // Jika email tidak ditemukan di database
    if (!user) {
      return res.status(404).json({ 
        message: 'Gagal mengubah password. Pastikan email benar dan terdaftar.' 
      });
    }

    // 4. Timpa password lama dengan password baru (tanpa hashing manual)
    // File Model (User.js) Anda akan otomatis meng-enkripsinya saat "user.save()" dipanggil.
    user.password = password; 
    await user.save();

    // 5. Kirim respons sukses ke Frontend
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