// ============================================
// MODEL: Testimoni
// Struktur data testimoni pengunjung
// ============================================

const mongoose = require("mongoose");

const testimoniSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    peran: {
      type: String,
      required: [true, "Peran wajib diisi"],
      trim: true,
    },
    pesan: {
      type: String,
      required: [true, "Pesan wajib diisi"],
      trim: true,
    },
    inisial: {
      type: String,
      required: [true, "Inisial wajib diisi"],
      maxlength: 3,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimoni", testimoniSchema);