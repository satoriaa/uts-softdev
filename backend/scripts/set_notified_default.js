require('dotenv').config();
const mongoose = require('mongoose');
const PinjamanRuang = require('../models/PinjamanRuang');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('MONGO_URI not set. Please create backend/.env with MONGO_URI or set env var.');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const res = await PinjamanRuang.updateMany(
      { notified: { $exists: false } },
      { $set: { notified: false } }
    );

    console.log('Update result:', res);
    console.log('Done. Existing documents without `notified` now have `notified:false`.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();