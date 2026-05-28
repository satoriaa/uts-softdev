const Karya = require('../models/Karya');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const data = await Karya.find().populate('user', 'nama nim').lean();
    // compute like count from likedBy if available
    const mapped = data.map(d => ({
      ...d,
      like: Array.isArray(d.likedBy) ? d.likedBy.length : (typeof d.like === 'number' ? d.like : 0)
    }));
    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Karya.findById(req.params.id).populate('user', 'nama nim').lean();
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    const mapped = { ...data, like: Array.isArray(data.likedBy) ? data.likedBy.length : (typeof data.like === 'number' ? data.like : 0) };
    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gambar = req.file.secure_url || req.file.path;
    // attach owner if available
    if (req.user && req.user._id) payload.user = req.user._id;
    const data = await Karya.create(payload);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.gambar = req.file.path;
    const data = await Karya.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Karya.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// allow an authenticated user to like a karya once
exports.like = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
    const karya = await Karya.findById(req.params.id);
    if (!karya) return res.status(404).json({ success: false, message: 'Karya not found' });

    const userId = String(req.user._id || req.user.id);
    // prevent user liking their own karya if owner present
    if (karya.user && String(karya.user) === userId) {
      return res.status(400).json({ success: false, message: 'Cannot like your own karya' });
    }

    // initialize likedBy if absent
    karya.likedBy = Array.isArray(karya.likedBy) ? karya.likedBy.map(String) : [];
    if (karya.likedBy.includes(userId)) {
      // idempotent: already liked
      const likes = karya.likedBy.length;
      return res.json({ success: true, liked: true, likes });
    }

    karya.likedBy.push(req.user._id);
    // keep numeric like for compatibility
    karya.like = Array.isArray(karya.likedBy) ? karya.likedBy.length : (karya.like + 1);
    await karya.save();

    // send realtime notification to owner if available
    try {
      const io = req.app.locals.io;
      if (io && karya.user) {
        // fetch liker basic info
        const liker = await User.findById(req.user._id).select('nama nim');
        const payload = {
          id: karya._id,
          type: 'karya:liked',
          karyaId: karya._id,
          liker: liker ? { _id: liker._id, nama: liker.nama, nim: liker.nim } : { _id: req.user._id },
          likes: karya.likedBy.length,
          createdAt: new Date(),
        };
        io.to(`user:${String(karya.user)}`).emit('karya:liked', payload);
        // also broadcast updated karya so listings can refresh counts
        io.emit('karya:updated', { karyaId: karya._id, likes: karya.likedBy.length });
      }
    } catch (e) {
      console.error('Failed to emit socket for karya like', e.message || e);
    }

    res.json({ success: true, liked: true, likes: karya.likedBy.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// remove appreciation (unlike)
exports.unlike = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
    const karya = await Karya.findById(req.params.id);
    if (!karya) return res.status(404).json({ success: false, message: 'Karya not found' });

    const userId = String(req.user._id || req.user.id);
    karya.likedBy = Array.isArray(karya.likedBy) ? karya.likedBy.map(String) : [];
    if (!karya.likedBy.includes(userId)) {
      return res.json({ success: true, liked: false, likes: karya.likedBy.length });
    }

    // remove
    karya.likedBy = karya.likedBy.filter(id => String(id) !== userId);
    karya.like = Array.isArray(karya.likedBy) ? karya.likedBy.length : Math.max(0, (karya.like || 1) - 1);
    await karya.save();

    // emit socket events
    try {
      const io = req.app.locals.io;
      if (io && karya.user) {
        io.to(`user:${String(karya.user)}`).emit('karya:unliked', {
          id: karya._id,
          karyaId: karya._id,
          user: req.user._id,
          likes: karya.likedBy.length,
          createdAt: new Date(),
        });
        io.emit('karya:updated', { karyaId: karya._id, likes: karya.likedBy.length });
      }
    } catch (e) {
      console.error('Failed to emit socket for karya unlike', e.message || e);
    }

    res.json({ success: true, liked: false, likes: karya.likedBy.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};