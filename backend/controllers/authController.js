const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
