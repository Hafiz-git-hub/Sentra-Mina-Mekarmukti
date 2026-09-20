// ============================================
// KONEKSI MONGODB
// ============================================

const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB terhubung!");
  } catch (error) {
    console.error("❌ MongoDB gagal konek:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;