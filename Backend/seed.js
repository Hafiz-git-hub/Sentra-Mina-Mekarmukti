// ============================================
// SEED SCRIPT — Migrasi data dari data.js ke MongoDB
// Jalankan sekali pakai: node seed.js
// ============================================

require("dotenv").config();
const mongoose = require("mongoose");

// Import data dari data.js
const { profil, agenda, testimoni, galeri } = require("./data/data");

// Import models
const Profil = require("./models/Profil");
const Agenda = require("./models/Agenda");
const Testimoni = require("./models/Testimoni");
const Galeri = require("./models/Galeri");

// ============================================
// FUNGSI SEED
// ============================================
async function seedDatabase() {
  try {
    // 1. Konek ke MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB terhubung!");

    // 2. Hapus data lama (biar gak dobel)
    await Profil.deleteMany({});
    await Agenda.deleteMany({});
    await Testimoni.deleteMany({});
    await Galeri.deleteMany({});
    console.log("🗑️  Data lama dihapus");

    // 3. Masukkan data baru
    await Profil.create(profil);
    console.log(`📝 Profil: 1 dokumen dimasukkan`);

    await Agenda.insertMany(agenda);
    console.log(`📝 Agenda: ${agenda.length} dokumen dimasukkan`);

    await Testimoni.insertMany(testimoni);
    console.log(`📝 Testimoni: ${testimoni.length} dokumen dimasukkan`);

    await Galeri.insertMany(galeri);
    console.log(`📝 Galeri: ${galeri.length} dokumen dimasukkan`);

    console.log("========================================");
    console.log("🎉 Migrasi data SELESAI!");
    console.log("========================================");

    // 4. Tutup koneksi
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal migrasi:", error.message);
    process.exit(1);
  }
}

// Jalankan
seedDatabase();
