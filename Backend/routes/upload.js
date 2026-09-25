// ============================================
// ROUTES: Upload
// Endpoint untuk upload gambar ke Cloudinary
// ============================================

const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/auth");

// Setup multer (simpan file di memory dulu)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    if (allowedExt.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang boleh diupload"), false);
    }
  },
});

// ============================================
// POST /api/upload — Upload gambar (butuh auth)
// ============================================
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload",
      });
    }

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "sentra-mina",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1500, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      message: "✅ Gambar berhasil diupload",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal upload gambar",
      error: error.message,
    });
  }
});

module.exports = router;