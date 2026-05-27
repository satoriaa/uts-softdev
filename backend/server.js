const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path'); 

dotenv.config();
connectDB();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tambahan: Mengizinkan frontend mengakses folder uploads secara publik
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/karya', require('./routes/karyaRoutes'));
app.use('/api/ruang', require('./routes/ruangRoutes'));
app.use('/api/pinjaman', require('./routes/pinjamanRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/proker', require('./routes/prokerRoutes'));
app.use('/api/lomba', require('./routes/lombaRoutes'));
app.use('/api/tenant', require('./routes/tenantRoutes'));
app.use('/api/workshop', require('./routes/workshopRoutes'));
app.use('/api/majalah', require('./routes/majalahRoutes'));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// expose io to routes/controllers via app.locals
app.locals.io = io;

const jwt = require('jsonwebtoken');

io.on('connection', (socket) => {
  console.log('Socket connection attempt:', socket.id);

  // Expect token in auth payload: socket.handshake.auth.token
  try {
    const token = socket.handshake && socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      console.log('Socket missing token, disconnecting', socket.id);
      socket.disconnect(true);
      return;
    }
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.log('Socket invalid token, disconnecting', socket.id);
      socket.disconnect(true);
      return;
    }

    // join rooms based on role or id
    if (decoded && decoded.type === 'admin') {
      socket.join('admins');
      console.log('Socket joined admins room', socket.id);
    }
    if (decoded && decoded.id) {
      const uidRoom = `user:${decoded.id}`;
      socket.join(uidRoom);
      console.log('Socket joined user room', uidRoom, socket.id);
    }
  } catch (err) {
    console.error('Error during socket auth:', err.message || err);
  }

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});