// ============================================
// BACKEND — Sentra Mina Argo Mekarmukti
// Fase 4: API + Auth (JWT) + Upload Cloudinary
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

// Import routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

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
// ENDPOINTS — GET (Read)
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
    res.status(500).json({ error: error.message });
  }
});

// 3. AGENDA — semua
app.get("/api/agenda", async (req, res) => {
  try {
    const agenda = await Agenda.find().sort({ tanggal: 1 });
    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(400).json({ error: "ID tidak valid", detail: error.message });
  }
});

// 5. TESTIMONI
app.get("/api/testimoni", async (req, res) => {
  try {
    const testimoni = await Testimoni.find();
    res.json(testimoni);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

// 7. STATISTIK
app.get("/api/statistik", async (req, res) => {
  try {
    const jumlahAgenda = await Agenda.countDocuments();
    const jumlahTestimoni = await Testimoni.countDocuments();
    const jumlahGaleri = await Galeri.countDocuments();

    res.json({
      kolamAktif: 15,
      panenPerBulan: 500,
      pengunjung: 200,
      totalAgenda: jumlahAgenda,
      totalTestimoni: jumlahTestimoni,
      totalGaleri: jumlahGaleri,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS — POST (Create)
// ============================================

// POST /api/agenda
app.post("/api/agenda", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// POST /api/testimoni
app.post("/api/testimoni", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// POST /api/galeri
app.post("/api/galeri", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS — PUT (Update)
// ============================================

// PUT /api/agenda/:id
app.put("/api/agenda/:id", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/testimoni/:id
app.put("/api/testimoni/:id", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/galeri/:id
app.put("/api/galeri/:id", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS — DELETE (Hapus)
// ============================================

// DELETE /api/agenda/:id
app.delete("/api/agenda/:id", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/testimoni/:id
app.delete("/api/testimoni/:id", async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/galeri/:id — + auto-hapus Cloudinary
app.delete("/api/galeri/:id", async (req, res) => {
  try {
    const galeriHapus = await Galeri.findByIdAndDelete(req.params.id);

    if (!galeriHapus) {
      return res.status(404).json({ error: "Galeri tidak ditemukan" });
    }

    // Kalau ada public_id → hapus juga di Cloudinary
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
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint tidak ditemukan",
    path: req.originalUrl,
    hint: "Cek daftar endpoint di http://localhost:3000/",
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
  console.log("📤 UPLOAD:");
  console.log(`   POST   /api/upload`);
  console.log("🌐 CONTENT:");
  console.log(`   GET    /api/profil`);
  console.log(`   GET    /api/agenda`);
  console.log(`   POST   /api/agenda`);
  console.log(`   PUT    /api/agenda/:id`);
  console.log(`   DELETE /api/agenda/:id`);
  console.log(`   GET    /api/testimoni`);
  console.log(`   POST   /api/testimoni`);
  console.log(`   PUT    /api/testimoni/:id`);
  console.log(`   DELETE /api/testimoni/:id`);
  console.log(`   GET    /api/galeri`);
  console.log(`   POST   /api/galeri`);
  console.log(`   PUT    /api/galeri/:id`);
  console.log(`   DELETE /api/galeri/:id  (auto-hapus Cloudinary)`);
  console.log(`   GET    /api/statistik`);
  console.log("========================================");
});
