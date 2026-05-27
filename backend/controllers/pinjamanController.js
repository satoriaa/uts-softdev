const PinjamanRuang = require('../models/PinjamanRuang');
const Ruang = require('../models/Ruang');

exports.getAll = async (req, res) => {
  try {
    // If requester is a normal user, return only their bookings
    let query = {};
    if (req.userType === 'user' && req.user) {
      query.user = req.user._id;
    }
    const data = await PinjamanRuang.find(query).populate('ruang user', 'namaRuang nama nim');
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await PinjamanRuang.findById(req.params.id).populate('ruang user', 'namaRuang nama nim');
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    // Emit socket notification about update
    try {
      const io = req.app && req.app.locals && req.app.locals.io;
      if (io) {
        io.emit('pinjaman:updated', {
          id: data._id,
          ruang: data.ruang,
          user: data.user,
          userNama: data.userNama,
          tanggalPinjam: data.tanggalPinjam,
          status: data.status,
          notified: data.notified,
          updatedAt: data.updatedAt,
        });
      }
    } catch (e) {
      console.error('Failed to emit socket event for pinjaman.update', e.message || e);
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      user: req.user?._id,
      userNama: req.user?.nama,
      userNim: req.user?.nim,
      notified: false,
    };
    // Basic conflict check: same room and same date (date-only)
    const tanggal = payload.tanggalPinjam ? new Date(payload.tanggalPinjam) : null;
    if (payload.ruang && tanggal) {
      const start = new Date(tanggal.setHours(0,0,0,0));
      const end = new Date(tanggal.setHours(23,59,59,999));
      const conflict = await PinjamanRuang.findOne({
        ruang: payload.ruang,
        tanggalPinjam: { $gte: start, $lte: end },
        status: 'terima'
      });
      if (conflict) {
        return res.status(400).json({ success: false, message: 'Ruangan sudah dibooking pada tanggal tersebut.' });
      }
    }

    const data = await PinjamanRuang.create(payload);
    // Emit socket notification to admins about new booking
    try {
      const io = req.app && req.app.locals && req.app.locals.io;
      if (io) {
        io.to('admins').emit('pinjaman:created', {
          id: data._id,
          ruang: data.ruang,
          user: data.user,
          userNama: data.userNama,
          tanggalPinjam: data.tanggalPinjam,
          status: data.status,
          createdAt: data.createdAt,
        });
      }
    } catch (e) {
      console.error('Failed to emit socket event for pinjaman.create', e.message || e);
    }
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // If admin updates status, ensure notified reset so user can be informed
    const incoming = { ...req.body };
    if (typeof incoming.status !== 'undefined' && incoming.status !== 'pending') {
      incoming.notified = false;
    }
    const data = await PinjamanRuang.findByIdAndUpdate(req.params.id, incoming, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    // Sync Ruang.status based on admin decision
    try {
      const ruangId = data.ruang && data.ruang._id ? data.ruang._id : data.ruang;
      if (ruangId) {
        if (incoming.status === 'terima') {
          // mark not available
          await Ruang.findByIdAndUpdate(ruangId, { status: 'tidak_tersedia' });
          // notify clients that ruang status changed
          try {
            const io = req.app && req.app.locals && req.app.locals.io;
            if (io) {
              io.emit('ruang:updated', { id: ruangId, status: 'tidak_tersedia' });
            }
          } catch (e) {}
        } else if (incoming.status === 'tolak') {
          // if rejected, check if there are other accepted bookings for the same room & date
          const tanggal = data.tanggalPinjam ? new Date(data.tanggalPinjam) : null;
          if (tanggal) {
            const start = new Date(tanggal.setHours(0,0,0,0));
            const end = new Date(tanggal.setHours(23,59,59,999));
            const otherAccepted = await PinjamanRuang.findOne({
              _id: { $ne: data._id },
              ruang: ruangId,
              status: 'terima',
              tanggalPinjam: { $gte: start, $lte: end }
            });
            if (!otherAccepted) {
              await Ruang.findByIdAndUpdate(ruangId, { status: 'tersedia' });
              try {
                const io = req.app && req.app.locals && req.app.locals.io;
                if (io) {
                  io.emit('ruang:updated', { id: ruangId, status: 'tersedia' });
                }
              } catch (e) {}
            }
          } else {
            // no date info, conservatively set to tersedia
            await Ruang.findByIdAndUpdate(ruangId, { status: 'tersedia' });
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync Ruang status after pinjaman update:', e.message || e);
    }
    // Emit socket notification to booking owner and admins about update
    try {
      const io = req.app && req.app.locals && req.app.locals.io;
      if (io) {
        if (data.user) {
          io.to(`user:${data.user.toString()}`).emit('pinjaman:updated', {
            id: data._id,
            ruang: data.ruang,
            user: data.user,
            userNama: data.userNama,
            tanggalPinjam: data.tanggalPinjam,
            status: data.status,
            notified: data.notified,
            updatedAt: data.updatedAt,
          });
        }
        io.to('admins').emit('pinjaman:updated', {
          id: data._id,
          ruang: data.ruang,
          user: data.user,
          userNama: data.userNama,
          tanggalPinjam: data.tanggalPinjam,
          status: data.status,
          notified: data.notified,
          updatedAt: data.updatedAt,
        });
      }
    } catch (e) {
      console.error('Failed to emit socket event for pinjaman.update', e.message || e);
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await PinjamanRuang.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acknowledge = async (req, res) => {
  try {
    const id = req.params.id;
    const pin = await PinjamanRuang.findById(id);
    if (!pin) return res.status(404).json({ success: false, message: 'Not found' });
    // only owner can ack
    if (req.userType !== 'admin' && (!req.user || pin.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    pin.notified = true;
    await pin.save();
    res.json({ success: true, data: pin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Owner marks booking as finished. This will set status='selesai' and free the room
exports.finish = async (req, res) => {
  try {
    const id = req.params.id;
    const pin = await PinjamanRuang.findById(id);
    if (!pin) return res.status(404).json({ success: false, message: 'Not found' });
    // only owner can finish
    if (!req.user || pin.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    pin.status = 'selesai';
    pin.notified = false;
    await pin.save();

    // After marking selesai, check if the room can be freed for the date
    try {
      const ruangId = pin.ruang && pin.ruang._id ? pin.ruang._id : pin.ruang;
      if (ruangId) {
        const tanggal = pin.tanggalPinjam ? new Date(pin.tanggalPinjam) : null;
        if (tanggal) {
          const start = new Date(tanggal.setHours(0,0,0,0));
          const end = new Date(tanggal.setHours(23,59,59,999));
          // If there is no other accepted booking for that room and date, set room to tersedia
          const otherAccepted = await PinjamanRuang.findOne({
            _id: { $ne: pin._id },
            ruang: ruangId,
            status: 'terima',
            tanggalPinjam: { $gte: start, $lte: end }
          });
          if (!otherAccepted) {
            await Ruang.findByIdAndUpdate(ruangId, { status: 'tersedia' });
            try {
              const io = req.app && req.app.locals && req.app.locals.io;
              if (io) {
                io.emit('ruang:updated', { id: ruangId, status: 'tersedia' });
              }
            } catch (e) {}
          }
        } else {
          // no date information - set to tersedia conservatively
          await Ruang.findByIdAndUpdate(ruangId, { status: 'tersedia' });
        }
      }
    } catch (e) {
      console.error('Failed to sync Ruang status after pinjaman finish:', e.message || e);
    }

    // Emit socket update to owner and admins
    try {
      const io = req.app && req.app.locals && req.app.locals.io;
      if (io) {
        io.to(`user:${pin.user.toString()}`).emit('pinjaman:updated', {
          id: pin._id,
          ruang: pin.ruang,
          user: pin.user,
          userNama: pin.userNama,
          tanggalPinjam: pin.tanggalPinjam,
          status: pin.status,
          notified: pin.notified,
          updatedAt: pin.updatedAt,
        });
        io.to('admins').emit('pinjaman:updated', {
          id: pin._id,
          ruang: pin.ruang,
          user: pin.user,
          userNama: pin.userNama,
          tanggalPinjam: pin.tanggalPinjam,
          status: pin.status,
          notified: pin.notified,
          updatedAt: pin.updatedAt,
        });
      }
    } catch (e) {
      console.error('Failed to emit socket event for pinjaman.finish', e.message || e);
    }

    res.json({ success: true, data: pin });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};