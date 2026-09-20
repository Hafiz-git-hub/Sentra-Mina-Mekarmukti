// ============================================
// MIDDLEWARE: Auth
// Proteksi endpoint — cek JWT token valid gak
// ============================================

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak — token tidak ditemukan",
      });
    }

    // Extract token (buang "Bearer ")
    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user di req.user
    req.user = decoded;

    // Lanjut ke endpoint
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau expired",
      detail: error.message,
    });
  }
}

module.exports = authMiddleware;