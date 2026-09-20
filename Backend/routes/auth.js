// ============================================
// ROUTES: Auth
// Endpoint untuk register, login, get profile
// ============================================

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// ============================================
// POST /api/auth/register — Daftar user baru
// ============================================
router.post("/register", async (req, res) => {
  try {
    const { email, password, nama, role } = req.body;

    // Validasi input
    if (!email || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: "Email, password, dan nama wajib diisi",
      });
    }

    // Cek email udah terdaftar?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Bikin user baru
    const user = await User.create({
      email,
      password: hashedPassword,
      nama,
      role: role || "admin",
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================
// POST /api/auth/login — Login user
// ============================================
router.post("/login", async (req, res) => {
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
    const user = await User.findOne({ email });
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid 7 hari
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
    res.status(500).json({
      success: false,
      message: error.message,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;