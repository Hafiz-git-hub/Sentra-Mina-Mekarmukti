// ============================================
// MODEL: Statistik
// Data statistik yang tampil di profil
// ============================================

const mongoose = require("mongoose");

const statistikSchema = new mongoose.Schema(
  {
    kolamAktif: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    panenPerBulan: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pengunjung: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Statistik", statistikSchema);