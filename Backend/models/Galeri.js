// ============================================
// MODEL: Galeri
// Struktur data foto galeri
// ============================================

const mongoose = require("mongoose");

const galeriSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul wajib diisi"],
      trim: true,
    },
    file: {
      type: String,
      required: [true, "Nama file wajib diisi"],
      trim: true,
    },
    kategori: {
      type: String,
      enum: ["edukasi", "ikan", "panen", "lainnya"],
      default: "lainnya",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Galeri", galeriSchema);
