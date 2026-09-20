// ============================================
// DATA — Sentra Mina Argo Mekarmukti
// Semua data statis (hardcode) disini
// ============================================

// 1. PROFIL
const profil = {
  nama: "Sentra Mina Argo Mekarmukti",
  deskripsi:
    "Kawasan terpadu perikanan dan pertanian ramah lingkungan yang mengintegrasikan edukasi, inovasi, dan pemberdayaan masyarakat lokal.",
  visi: "Mewujudkan desa mandiri dan berkelanjutan melalui perikanan dan pertanian terpadu.",
  alamat:
    "P577+P9H, Mekarmukti, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat 17530",
  jamOperasional: "Senin - Minggu: 07.00 - 17.00 WIB",
  kontak: {
    whatsapp: "+62 896-7892-8129",
    email: "info@mekarmukti.id",
  },
};

// 2. AGENDA KEGIATAN
const agenda = [
  {
    id: 1,
    judul: "Pelatihan Budidaya Ikan Lele",
    tanggal: "2026-10-15",
    lokasi: "Kolam Utama Sentra Mina",
    deskripsi:
      "Pelatihan untuk pemula tentang cara budidaya ikan lele yang efisien.",
    kategori: "pelatihan",
  },
  {
    id: 2,
    judul: "Kunjungan Edukasi SD Mekarmukti",
    tanggal: "2026-10-20",
    lokasi: "Area Pertanian Terpadu",
    deskripsi:
      "Kunjungan belajar untuk siswa SD tentang pertanian dan perikanan.",
    kategori: "edukasi",
  },
  {
    id: 3,
    judul: "Panen Raya Ikan Patin",
    tanggal: "2026-11-01",
    lokasi: "Kolam Blok B",
    deskripsi: "Kegiatan panen bersama kelompok tani lokal.",
    kategori: "panen",
  },
  {
    id: 4,
    judul: "Workshop Pertanian Organik",
    tanggal: "2026-11-10",
    lokasi: "Area Pertanian Terpadu",
    deskripsi: "Workshop tentang cara bercocok tanam organik untuk pemula.",
    kategori: "pelatihan",
  },
];

// 3. TESTIMONI
const testimoni = [
  {
    id: 1,
    nama: "Ahmad Suryadi",
    peran: "Guru SMAN 1 Cikarang",
    pesan:
      "Tempat yang luar biasa untuk belajar budidaya ikan langsung dari ahlinya. Anak-anak saya sangat antusias!",
    inisial: "AS",
  },
  {
    id: 2,
    nama: "Rina Wulandari",
    peran: "Pemilik Warung Seafood",
    pesan:
      "Hasil panen ikan di sini selalu segar dan kualitasnya konsisten. Sudah jadi langganan kami setiap bulan.",
    inisial: "RW",
  },
  {
    id: 3,
    nama: "Budi Hartono",
    peran: "Ketua Kelompok Tani Bekasi",
    pesan:
      "Konsep pertanian terpadunya sangat inspiratif. Banyak ilmu yang bisa kami adopsi untuk desa kami.",
    inisial: "BH",
  },
];

// 4. GALERI
const galeri = [
  {
    id: 1,
    judul: "Kegiatan Edukasi Siswa",
    file: "IMG_20260730_135710.jpg",
    kategori: "edukasi",
  },
  {
    id: 2,
    judul: "Kunjungan Lapangan",
    file: "IMG_20260730_135724.jpg",
    kategori: "edukasi",
  },
  {
    id: 3,
    judul: "Area Budidaya Ikan",
    file: "kegiatan.png",
    kategori: "ikan",
  },
  {
    id: 4,
    judul: "Panen Bersama",
    file: "IMG_20260730_135734.jpg",
    kategori: "panen",
  },
];

// 5. STATISTIK
const statistik = {
  kolamAktif: 15,
  panenPerBulan: 500, // dalam kg
  pengunjung: 200,
};

// ============================================
// EXPORT semua data
// ============================================
module.exports = {
  profil,
  agenda,
  testimoni,
  galeri,
  statistik,
};