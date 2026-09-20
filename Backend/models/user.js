// ============================================
// MODEL: User
// Struktur data user (admin, editor, dll)
// ============================================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: [6, "Password minimal 6 karakter"],
    },
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);