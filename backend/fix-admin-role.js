// Fix script untuk menambahkan field 'role' ke semua Admin yang belum memilikinya
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://drewss:drew123@cluster0.3q6f3hr.mongodb.net/admin-dashboard?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('MongoDB Connected for fix');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const fixAdminRole = async () => {
  try {
    // Find all admins that don't have a role or have incorrect role
    const result = await Admin.updateMany(
      { $or: [{ role: { $exists: false } }, { role: { $ne: 'admin' } }] },
      { $set: { role: 'admin' } }
    );

    console.log(`Fixed ${result.modifiedCount} admin(s)`);
    console.log(`Matched ${result.matchedCount} admin(s)`);

    // Verify
    const admins = await Admin.find({}).select('-password');
    console.log('\nCurrent admins:');
    admins.forEach(admin => {
      console.log(`- ${admin.nama} (${admin.email}): role=${admin.role}`);
    });

    console.log('\nFix completed successfully!');
  } catch (error) {
    console.error('Fix error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

const main = async () => {
  await connectDB();
  await fixAdminRole();
};

main();
