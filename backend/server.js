const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
