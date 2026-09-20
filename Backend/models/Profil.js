// ============================================
// MODEL: Profil
// Struktur data profil Sentra Mina
// ============================================

const mongoose = require("mongoose");

const profilSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: true,
      trim: true,
    },
    visi: {
      type: String,
      trim: true,
    },
    alamat: {
      type: String,
      trim: true,
    },
    jamOperasional: {
      type: String,
      trim: true,
    },
    kontak: {
      whatsapp: String,
      email: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profil", profilSchema);
