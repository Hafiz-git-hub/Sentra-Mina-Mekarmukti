// ============================================
// MODEL: Agenda
// Struktur data agenda kegiatan
// ============================================

const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul agenda wajib diisi"],
      trim: true,
    },
    tanggal: {
      type: String,
      required: [true, "Tanggal wajib diisi"],
    },
    lokasi: {
      type: String,
      required: [true, "Lokasi wajib diisi"],
      trim: true,
    },
    deskripsi: {
      type: String,
      required: [true, "Deskripsi wajib diisi"],
      trim: true,
    },
    kategori: {
      type: String,
      enum: ["pelatihan", "edukasi", "panen", "lainnya"],
      default: "lainnya",
    },
  },
  {
    timestamps: true, // otomatis nambah createdAt & updatedAt
  },
);

module.exports = mongoose.model("Agenda", agendaSchema);
