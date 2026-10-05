// ============================================
// BACKEND — Sentra Mina Argo Mekarmukti
// Fase 5: API + Auth + Upload + Security
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cloudinary = require("./config/cloudinary");

// Import models
const Profil = require("./models/Profil");
const Agenda = require("./models/Agenda");
const Testimoni = require("./models/Testimoni");
const Galeri = require("./models/Galeri");
const Statistik = require("./models/Statistik");

// Import routes & middleware
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(
  cors({
    origin: [
      "https://sentra-mina-mekarmukti.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// AUTH & UPLOAD ROUTES
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// ============================================
// ENDPOINTS — GET (Read) — PUBLIK
// ============================================

// 1. Root
app.get("/", (req, res) => {
  res.json({
    message: "API Sentra Mina Argo Mekarmukti — Connected to MongoDB",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      me: "GET /api/auth/me",
      upload: "POST /api/upload",
      profil: "GET /api/profil",
      agenda: "GET /api/agenda",
      agendaDetail: "GET /api/agenda/:id",
      testimoni: "GET /api/testimoni",
      galeri: "GET /api/galeri",
      galeriFilter: "GET /api/galeri?kategori=ikan",
      statistik: "GET /api/statistik",
    },
  });
});

// 2. PROFIL
app.get("/api/profil", async (req, res) => {
  try {
    const profil = await Profil.findOne();
    if (!profil) {
      return res.status(404).json({ error: "Profil belum diisi" });
    }
    res.json(profil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// 3. AGENDA — semua
app.get("/api/agenda", async (req, res) => {
  try {
    const agenda = await Agenda.find().sort({ tanggal: 1 });
    res.json(agenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// 4. AGENDA — detail by ID
app.get("/api/agenda/:id", async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) {
      return res.status(404).json({ error: "Agenda tidak ditemukan" });
    }
    res.json(agenda);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "ID tidak valid" });
  }
});

// 5. TESTIMONI
app.get("/api/testimoni", async (req, res) => {
  try {
    const testimoni = await Testimoni.find();
    res.json(testimoni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// 6. GALERI — dengan filter kategori opsional
app.get("/api/galeri", async (req, res) => {
  try {
    const kategori = req.query.kategori;
    let query = {};

    if (kategori) {
      query.kategori = kategori;
    }

    const galeri = await Galeri.find(query);

    if (kategori) {
      return res.json({
        kategori: kategori,
        jumlah: galeri.length,
        data: galeri,
      });
    }

    res.json(galeri);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// 7. STATISTIK — publik (read only)
app.get("/api/statistik", async (req, res) => {
  try {
    const jumlahAgenda = await Agenda.countDocuments();
    const jumlahTestimoni = await Testimoni.countDocuments();
    const jumlahGaleri = await Galeri.countDocuments();

    let statistik = await Statistik.findOne();
    if (!statistik) {
      statistik = await Statistik.create({
        kolamAktif: 15,
        panenPerBulan: 500,
        pengunjung: 200,
      });
    }

    res.json({
      kolamAktif: statistik.kolamAktif,
      panenPerBulan: statistik.panenPerBulan,
      pengunjung: statistik.pengunjung,
      totalAgenda: jumlahAgenda,
      totalTestimoni: jumlahTestimoni,
      totalGaleri: jumlahGaleri,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// ENDPOINTS — POST (Create) — BUTUH AUTH
// ============================================

// POST /api/agenda
app.post("/api/agenda", authMiddleware, async (req, res) => {
  try {
    const { judul, tanggal, lokasi, deskripsi, kategori } = req.body;

    if (!judul || !tanggal || !lokasi || !deskripsi) {
      return res.status(400).json({
        error: "Data tidak lengkap",
        butuh: ["judul", "tanggal", "lokasi", "deskripsi"],
      });
    }

    const agendaBaru = await Agenda.create({
      judul,
      tanggal,
      lokasi,
      deskripsi,
      kategori,
    });

    res.status(201).json({
      message: "✅ Agenda berhasil ditambahkan",
      data: agendaBaru,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan agenda" });
  }
});

// POST /api/testimoni
app.post("/api/testimoni", authMiddleware, async (req, res) => {
  try {
    const { nama, peran, pesan, inisial } = req.body;

    if (!nama || !peran || !pesan || !inisial) {
      return res.status(400).json({
        error: "Data tidak lengkap",
        butuh: ["nama", "peran", "pesan", "inisial"],
      });
    }

    const testimoniBaru = await Testimoni.create({
      nama,
      peran,
      pesan,
      inisial,
    });

    res.status(201).json({
      message: "✅ Testimoni berhasil ditambahkan",
      data: testimoniBaru,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan testimoni" });
  }
});

// POST /api/galeri
app.post("/api/galeri", authMiddleware, async (req, res) => {
  try {
    const { judul, file, public_id, kategori } = req.body;

    if (!judul || !file) {
      return res.status(400).json({
        error: "Data tidak lengkap",
        butuh: ["judul", "file"],
      });
    }

    const galeriBaru = await Galeri.create({
      judul,
      file,
      public_id: public_id || null,
      kategori,
    });

    res.status(201).json({
      message: "✅ Galeri berhasil ditambahkan",
      data: galeriBaru,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan galeri" });
  }
});

// ============================================
// ENDPOINTS — PUT (Update) — BUTUH AUTH
// ============================================

// PUT /api/agenda/:id
app.put("/api/agenda/:id", authMiddleware, async (req, res) => {
  try {
    const { judul, tanggal, lokasi, deskripsi, kategori } = req.body;

    const agendaUpdate = await Agenda.findByIdAndUpdate(
      req.params.id,
      { judul, tanggal, lokasi, deskripsi, kategori },
      { new: true, runValidators: true },
    );

    if (!agendaUpdate) {
      return res.status(404).json({ error: "Agenda tidak ditemukan" });
    }

    res.json({
      message: "✅ Agenda berhasil diupdate",
      data: agendaUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal update agenda" });
  }
});

// PUT /api/testimoni/:id
app.put("/api/testimoni/:id", authMiddleware, async (req, res) => {
  try {
    const { nama, peran, pesan, inisial } = req.body;

    const testimoniUpdate = await Testimoni.findByIdAndUpdate(
      req.params.id,
      { nama, peran, pesan, inisial },
      { new: true, runValidators: true },
    );

    if (!testimoniUpdate) {
      return res.status(404).json({ error: "Testimoni tidak ditemukan" });
    }

    res.json({
      message: "✅ Testimoni berhasil diupdate",
      data: testimoniUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal update testimoni" });
  }
});

// PUT /api/galeri/:id
app.put("/api/galeri/:id", authMiddleware, async (req, res) => {
  try {
    const { judul, file, kategori, public_id } = req.body;

    const updateData = { judul, file, kategori };
    if (public_id) updateData.public_id = public_id;

    const galeriUpdate = await Galeri.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!galeriUpdate) {
      return res.status(404).json({ error: "Galeri tidak ditemukan" });
    }

    res.json({
      message: "✅ Galeri berhasil diupdate",
      data: galeriUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal update galeri" });
  }
});

// PUT /api/statistik
app.put("/api/statistik", authMiddleware, async (req, res) => {
  try {
    const { kolamAktif, panenPerBulan, pengunjung } = req.body;

    if (
      (kolamAktif !== undefined && (isNaN(kolamAktif) || kolamAktif < 0)) ||
      (panenPerBulan !== undefined &&
        (isNaN(panenPerBulan) || panenPerBulan < 0)) ||
      (pengunjung !== undefined && (isNaN(pengunjung) || pengunjung < 0))
    ) {
      return res.status(400).json({
        error: "Data harus berupa angka positif",
      });
    }

    let statistik = await Statistik.findOne();
    if (!statistik) {
      statistik = new Statistik();
    }

    if (kolamAktif !== undefined) statistik.kolamAktif = kolamAktif;
    if (panenPerBulan !== undefined) statistik.panenPerBulan = panenPerBulan;
    if (pengunjung !== undefined) statistik.pengunjung = pengunjung;

    await statistik.save();

    res.json({
      success: true,
      message: "✅ Statistik berhasil diupdate",
      data: statistik,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update statistik" });
  }
});

// ============================================
// ENDPOINTS — DELETE (Hapus) — BUTUH AUTH
// ============================================

// DELETE /api/agenda/:id
app.delete("/api/agenda/:id", authMiddleware, async (req, res) => {
  try {
    const agendaHapus = await Agenda.findByIdAndDelete(req.params.id);

    if (!agendaHapus) {
      return res.status(404).json({ error: "Agenda tidak ditemukan" });
    }

    res.json({
      message: "✅ Agenda berhasil dihapus",
      data: agendaHapus,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal hapus agenda" });
  }
});

// DELETE /api/testimoni/:id
app.delete("/api/testimoni/:id", authMiddleware, async (req, res) => {
  try {
    const testimoniHapus = await Testimoni.findByIdAndDelete(req.params.id);

    if (!testimoniHapus) {
      return res.status(404).json({ error: "Testimoni tidak ditemukan" });
    }

    res.json({
      message: "✅ Testimoni berhasil dihapus",
      data: testimoniHapus,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal hapus testimoni" });
  }
});

// DELETE /api/galeri/:id — + auto-hapus Cloudinary
app.delete("/api/galeri/:id", authMiddleware, async (req, res) => {
  try {
    const galeriHapus = await Galeri.findByIdAndDelete(req.params.id);

    if (!galeriHapus) {
      return res.status(404).json({ error: "Galeri tidak ditemukan" });
    }

    if (galeriHapus.public_id) {
      try {
        await cloudinary.uploader.destroy(galeriHapus.public_id);
        console.log(`🗑️ Cloudinary: ${galeriHapus.public_id} dihapus`);
      } catch (cloudErr) {
        console.error("⚠️ Gagal hapus di Cloudinary:", cloudErr.message);
      }
    }

    res.json({
      message: "✅ Galeri berhasil dihapus",
      data: galeriHapus,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal hapus galeri" });
  }
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint tidak ditemukan",
  });
});

// ============================================
// JALANKAN SERVER
// ============================================
connectDB();
app.listen(PORT, () => {
  console.log("========================================");
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
  console.log("========================================");
  console.log("🔐 AUTH:");
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log("📤 UPLOAD [🔒]:");
  console.log(`   POST   /api/upload`);
  console.log("🌐 CONTENT (GET publik, POST/PUT/DELETE 🔒):");
  console.log(`   GET    /api/profil`);
  console.log(`   GET    /api/agenda`);
  console.log(`   POST   /api/agenda       [🔒]`);
  console.log(`   PUT    /api/agenda/:id   [🔒]`);
  console.log(`   DELETE /api/agenda/:id   [🔒]`);
  console.log(`   GET    /api/testimoni`);
  console.log(`   POST   /api/testimoni    [🔒]`);
  console.log(`   PUT    /api/testimoni/:id [🔒]`);
  console.log(`   DELETE /api/testimoni/:id [🔒]`);
  console.log(`   GET    /api/galeri`);
  console.log(`   POST   /api/galeri       [🔒]`);
  console.log(`   PUT    /api/galeri/:id   [🔒]`);
  console.log(`   DELETE /api/galeri/:id   [🔒 + Cloudinary]`);
  console.log(`   GET    /api/statistik`);
  console.log(`   PUT    /api/statistik    [🔒]`);
  console.log("========================================");
});
