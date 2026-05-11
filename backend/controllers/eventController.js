const Event = require('../models/Event');
const User = require('../models/User');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

// Helper function to convert NIM or ID to ObjectId
const getPembicaraObjectId = async (identifier) => {
  // Check if it's already a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return identifier;
  }
  
  // Try to find user by NIM
  const user = await User.findOne({ nim: identifier });
  if (user) {
    return user._id.toString();
  }
  
  // Try to find admin by email or name
  const admin = await Admin.findOne({ 
    $or: [{ email: identifier }, { nama: identifier }] 
  });
  if (admin) {
    return admin._id.toString();
  }
  
  // If not found, return the original (might fail validation but will give clear error)
  throw new Error(`User/Admin dengan NIM/Email/Nama "${identifier}" tidak ditemukan`);
};

exports.getAll = async (req, res) => {
  try {
    const data = await Event.find().populate('pembicara', 'nama nim email role');
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Event.findById(req.params.id).populate('pembicara', 'nama nim email role');
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Convert pembicara NIM/Email to ObjectId
    if (payload.pembicara) {
      try {
        payload.pembicara = await getPembicaraObjectId(payload.pembicara);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }
    
    if (req.file) payload.gambar = req.file.secure_url || req.file.path;
    const data = await Event.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    
    // Convert pembicara NIM/Email to ObjectId
    if (payload.pembicara) {
      try {
        payload.pembicara = await getPembicaraObjectId(payload.pembicara);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }
    
    if (req.file) payload.gambar = req.file.secure_url || req.file.path;
    const data = await Event.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Event.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all speakers (users and admins) for dropdown selector
exports.getSpeakers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}, '_id nama nim email role').lean();
    
    // Get all admins
    const admins = await Admin.find({}, '_id nama email role').lean();
    
    // Transform for frontend
    const speakers = [
      ...users.map(u => ({
        _id: u._id.toString(),
        label: `${u.nama} (${u.nim})`,
        value: u.nim,
        type: 'user'
      })),
      ...admins.map(a => ({
        _id: a._id.toString(),
        label: `${a.nama} (${a.email}) - Admin`,
        value: a.email,
        type: 'admin'
      }))
    ];
    
    res.json({ success: true, data: speakers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

