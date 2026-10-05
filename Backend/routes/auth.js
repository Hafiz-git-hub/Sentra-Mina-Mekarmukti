// ============================================
// ROUTES: Auth
// Endpoint untuk register, login, get profile
// ============================================

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// ============================================
// RATE LIMIT — cegah brute force login
// ============================================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 percobaan per IP
  message: {
    success: false,
    message: "Terlalu banyak percobaan login. Coba lagi 15 menit lagi.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// POST /api/auth/register — Daftar user baru
// 🔒 BUTUH TOKEN ADMIN — cuma admin yang bisa nambah admin
// ============================================
router.post("/register", authMiddleware, async (req, res) => {
  try {
    const { email, password, nama } = req.body;
    // ⚠️ role TIDAK diambil dari req.body — dipaksa "admin"

    // Validasi input
    if (!email || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: "Email, password, dan nama wajib diisi",
      });
    }

    // Validasi panjang password SEBELUM hash
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Cek email udah terdaftar?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Bikin user baru — role DIPAKSA "admin"
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      nama,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      user: {
        id: user._id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// POST /api/auth/login — Login user
// 🛡️ Rate limit: max 5 percobaan per 15 menit
// ============================================
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Bandingin password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate JWT token — expiry 1 hari
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// GET /api/auth/me — Get profil user (butuh token)
// ============================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
