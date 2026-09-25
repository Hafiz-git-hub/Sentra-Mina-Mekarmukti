// ============================================
// ADMIN PANEL — Sentra Mina Argo
// ============================================

const API_URL = "https://sentra-mina-backend-production.up.railway.app";
// ⚠️ Untuk lokal, ganti ke: "http://localhost:3000"

// ============================================
// CEK AUTENTIKASI
// ============================================
const token = localStorage.getItem("adminToken");
const user = JSON.parse(localStorage.getItem("adminUser") || "{}");

if (!token) {
  window.location.href = "index.html";
}

// Tampilkan nama user
document.addEventListener("DOMContentLoaded", () => {
  const userNameEl = document.getElementById("userName");
  if (userNameEl && user.nama) {
    userNameEl.textContent = user.nama;
  }

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none";
    document.getElementById("adminApp").classList.remove("hidden");
    loadDashboard();
  }, 500);
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const colors = {
    success: "bg-brand-500 text-slate-950 border-brand-400",
    info: "bg-slate-800 text-slate-100 border-slate-700",
    error: "bg-rose-500 text-white border-rose-400",
  };
  const icons = {
    success: "fa-solid fa-circle-check",
    info: "fa-solid fa-circle-info",
    error: "fa-solid fa-circle-exclamation",
  };

  const toast = document.createElement("div");
  toast.className = `${colors[type]} border px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold translate-x-[120%] transition-transform duration-300 ease-out max-w-xs`;
  toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-[120%]");
    toast.classList.add("translate-x-0");
  });

  setTimeout(() => {
    toast.classList.remove("translate-x-0");
    toast.classList.add("translate-x-[120%]");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// HELPER: Escape HTML
// ============================================
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================
// NAVIGASI SIDEBAR
// ============================================
document.querySelectorAll(".sidebar-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(link.dataset.menu);
  });
});

function switchPage(menu) {
  document.querySelectorAll(".sidebar-link").forEach((l) => {
    l.classList.toggle("active", l.dataset.menu === menu);
  });

  document.querySelectorAll(".section-page").forEach((s) => {
    s.classList.add("hidden");
  });
  document.getElementById(`section-${menu}`).classList.remove("hidden");

  closeSidebar();

  if (menu === "testimoni") loadTestimoni();
  if (menu === "agenda") loadAgenda();
  if (menu === "galeri") loadGaleri();
  if (menu === "dashboard") loadDashboard();
}

// ============================================
// SIDEBAR MOBILE
// ============================================
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

document.getElementById("toggleSidebar")?.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
  sidebarOverlay.classList.remove("hidden");
});

sidebarOverlay?.addEventListener("click", closeSidebar);

function closeSidebar() {
  if (window.innerWidth < 1024) {
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
  }
}

// ============================================
// LOGOUT
// ============================================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (confirm("Yakin mau logout?")) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "index.html";
  }
});

// ============================================
// LOAD DASHBOARD
// ============================================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL}/api/statistik`);
    const data = await res.json();

    document.getElementById("statTestimoni").textContent =
      data.totalTestimoni ?? "—";
    document.getElementById("statAgenda").textContent = data.totalAgenda ?? "—";
    document.getElementById("statGaleri").textContent = data.totalGaleri ?? "—";
  } catch (err) {
    console.error("Gagal load statistik:", err);
  }
}

// ============================================
// TESTIMONI
// ============================================
async function loadTestimoni() {
  const container = document.getElementById("listTestimoni");
  container.innerHTML =
    '<p class="text-slate-500 text-center py-12">Memuat data...</p>';

  try {
    const res = await fetch(`${API_URL}/api/testimoni`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML =
        '<p class="text-slate-500 text-center py-12">Belum ada testimoni.</p>';
      return;
    }

    container.innerHTML = data
      .map(
        (item) => `
      <div class="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                ${escapeHtml(item.inisial || "?")}
              </div>
              <div>
                <p class="font-bold text-white">${escapeHtml(item.nama)}</p>
                <p class="text-xs text-slate-400">${escapeHtml(item.peran)}</p>
              </div>
            </div>
            <p class="text-sm text-slate-300 italic leading-relaxed">"${escapeHtml(item.pesan)}"</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button onclick='editTestimoni("${item._id}")' class="w-9 h-9 bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-400 rounded-lg flex items-center justify-center transition-all">
              <i class="fa-solid fa-pen text-xs"></i>
            </button>
            <button onclick='deleteItem("testimoni", "${item._id}")' class="w-9 h-9 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg flex items-center justify-center transition-all">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="text-rose-400 text-center py-12">Gagal memuat data.</p>';
  }
}

// ============================================
// AGENDA
// ============================================
async function loadAgenda() {
  const container = document.getElementById("listAgenda");
  container.innerHTML =
    '<p class="text-slate-500 text-center py-12">Memuat data...</p>';

  try {
    const res = await fetch(`${API_URL}/api/agenda`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML =
        '<p class="text-slate-500 text-center py-12">Belum ada agenda.</p>';
      return;
    }

    container.innerHTML = data
      .map(
        (item) => `
      <div class="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                ${escapeHtml(item.kategori || "lainnya")}
              </span>
              <span class="text-xs text-slate-500">
                <i class="fa-regular fa-calendar"></i> ${escapeHtml(item.tanggal)}
              </span>
            </div>
            <p class="font-bold text-white text-lg">${escapeHtml(item.judul)}</p>
            <p class="text-xs text-slate-400 mt-1">
              <i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.lokasi)}
            </p>
            <p class="text-sm text-slate-300 mt-2 leading-relaxed">${escapeHtml(item.deskripsi)}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button onclick='editAgenda("${item._id}")' class="w-9 h-9 bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-400 rounded-lg flex items-center justify-center transition-all">
              <i class="fa-solid fa-pen text-xs"></i>
            </button>
            <button onclick='deleteItem("agenda", "${item._id}")' class="w-9 h-9 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg flex items-center justify-center transition-all">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="text-rose-400 text-center py-12">Gagal memuat data.</p>';
  }
}

// ============================================
// GALERI
// ============================================
async function loadGaleri() {
  const container = document.getElementById("listGaleri");
  container.innerHTML =
    '<p class="text-slate-500 text-center py-12 col-span-full">Memuat data...</p>';

  try {
    const res = await fetch(`${API_URL}/api/galeri`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML =
        '<p class="text-slate-500 text-center py-12 col-span-full">Belum ada foto.</p>';
      return;
    }

    container.innerHTML = data
      .map((item) => {
        const isUrl = item.file.startsWith("http");
        const imgSrc = isUrl ? item.file : `Assets/${escapeHtml(item.file)}`;

        return `
      <div class="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
        <div class="aspect-[4/5] overflow-hidden relative">
          <img src="${imgSrc}" alt="${escapeHtml(item.judul)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='Assets/Logo.png'" />
          <span class="absolute top-2 left-2 text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
            ${escapeHtml(item.kategori || "lainnya")}
          </span>
        </div>
        <div class="p-4">
          <p class="font-bold text-white text-sm mb-3 truncate">${escapeHtml(item.judul)}</p>
          <div class="flex gap-2">
            <button onclick='editGaleri("${item._id}")' class="flex-1 bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button onclick='deleteItem("galeri", "${item._id}")' class="flex-1 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1">
              <i class="fa-solid fa-trash"></i> Hapus
            </button>
          </div>
        </div>
      </div>
    `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="text-rose-400 text-center py-12 col-span-full">Gagal memuat data.</p>';
  }
}

// ============================================
// MODAL — Form Tambah/Edit
// ============================================
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modalForm");
const modalTitle = document.getElementById("modalTitle");
const formFields = document.getElementById("formFields");

let currentType = null;
let currentId = null;

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal(btn.dataset.add, null);
  });
});

document.getElementById("modalClose")?.addEventListener("click", closeModal);
document.getElementById("modalCancel")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function openModal(type, data = null) {
  currentType = type;
  currentId = data?._id || null;

  const titles = {
    testimoni: "Testimoni",
    agenda: "Agenda",
    galeri: "Galeri",
  };
  modalTitle.textContent = (data ? "Edit " : "Tambah ") + titles[type];

  let fields = "";

  // ============ FORM TESTIMONI ============
  if (type === "testimoni") {
    fields = `
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Nama</label>
        <input type="text" name="nama" required value="${escapeHtml(data?.nama || "")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Peran</label>
        <input type="text" name="peran" required value="${escapeHtml(data?.peran || "")}" placeholder="Guru SMAN 1 Cikarang" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Inisial (max 3)</label>
        <input type="text" name="inisial" required maxlength="3" value="${escapeHtml(data?.inisial || "")}" placeholder="AS" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all uppercase" />
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Pesan</label>
        <textarea name="pesan" required rows="4" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all resize-none">${escapeHtml(data?.pesan || "")}</textarea>
      </div>
    `;
  }

  // ============ FORM AGENDA ============
  if (type === "agenda") {
    fields = `
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Judul</label>
        <input type="text" name="judul" required value="${escapeHtml(data?.judul || "")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Tanggal</label>
          <input type="date" name="tanggal" required value="${escapeHtml(data?.tanggal || "")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Kategori</label>
          <select name="kategori" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all">
            <option value="pelatihan" ${data?.kategori === "pelatihan" ? "selected" : ""}>Pelatihan</option>
            <option value="edukasi" ${data?.kategori === "edukasi" ? "selected" : ""}>Edukasi</option>
            <option value="panen" ${data?.kategori === "panen" ? "selected" : ""}>Panen</option>
            <option value="lainnya" ${data?.kategori === "lainnya" || !data?.kategori ? "selected" : ""}>Lainnya</option>
          </select>
        </div>
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Lokasi</label>
        <input type="text" name="lokasi" required value="${escapeHtml(data?.lokasi || "")}" placeholder="Kolam Utama" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Deskripsi</label>
        <textarea name="deskripsi" required rows="3" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all resize-none">${escapeHtml(data?.deskripsi || "")}</textarea>
      </div>
    `;
  }

  // ============ FORM GALERI (DENGAN UPLOAD) ============
  if (type === "galeri") {
    const currentFile = data?.file || "";
    const currentPublicId = data?.public_id || "";
    const isUrl = currentFile.startsWith("http");
    const previewSrc = isUrl
      ? currentFile
      : currentFile
        ? `Assets/${currentFile}`
        : "";

    fields = `
      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Judul</label>
        <input type="text" name="judul" required value="${escapeHtml(data?.judul || "")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all" />
      </div>

      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Upload Gambar</label>
        <div id="uploadArea" class="border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-xl p-4 text-center cursor-pointer transition-all">
          <input type="file" id="fileInput" accept="image/*" class="hidden" />
          <div id="uploadPrompt" class="${previewSrc ? "hidden" : ""}">
            <i class="fa-solid fa-cloud-arrow-up text-3xl text-slate-500 mb-2"></i>
            <p class="text-sm text-slate-400">Klik untuk pilih gambar</p>
            <p class="text-xs text-slate-500 mt-1">JPG, PNG, WebP — max 5MB</p>
          </div>
          <div id="uploadPreview" class="${previewSrc ? "" : "hidden"}">
            <img id="previewImg" src="${previewSrc}" alt="Preview" class="max-h-48 mx-auto rounded-lg mb-2" onerror="this.src='Assets/Logo.png'" />
            <p class="text-xs text-slate-400">Klik untuk ganti gambar</p>
          </div>
        </div>
        <div id="uploadStatus" class="text-xs mt-2 hidden"></div>
        <input type="hidden" name="file" id="fileUrlInput" value="${escapeHtml(currentFile)}" />
        <input type="hidden" name="public_id" id="publicIdInput" value="${escapeHtml(currentPublicId)}" />
        <p class="text-xs text-slate-500 mt-1">Upload gambar baru, atau biarkan kosong kalau gak mau ganti.</p>
      </div>

      <div>
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Kategori</label>
        <select name="kategori" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-all">
          <option value="edukasi" ${data?.kategori === "edukasi" ? "selected" : ""}>Edukasi</option>
          <option value="ikan" ${data?.kategori === "ikan" ? "selected" : ""}>Ikan</option>
          <option value="panen" ${data?.kategori === "panen" ? "selected" : ""}>Panen</option>
          <option value="lainnya" ${data?.kategori === "lainnya" || !data?.kategori ? "selected" : ""}>Lainnya</option>
        </select>
      </div>
    `;
  }

  formFields.innerHTML = fields;

  // ============ SETUP UPLOAD GAMBAR (khusus galeri) ============
  if (type === "galeri") {
    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("fileInput");
    const uploadPrompt = document.getElementById("uploadPrompt");
    const uploadPreview = document.getElementById("uploadPreview");
    const previewImg = document.getElementById("previewImg");
    const uploadStatus = document.getElementById("uploadStatus");
    const fileUrlInput = document.getElementById("fileUrlInput");
    const publicIdInput = document.getElementById("publicIdInput");

    uploadArea.addEventListener("click", () => fileInput.click());

    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("border-brand-500", "bg-brand-500/5");
    });
    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("border-brand-500", "bg-brand-500/5");
    });
    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("border-brand-500", "bg-brand-500/5");
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
      }
    });

    async function handleFileUpload(file) {
      if (file.size > 5 * 1024 * 1024) {
        uploadStatus.className = "text-xs mt-2 text-rose-400";
        uploadStatus.textContent = "❌ File terlalu besar. Max 5MB.";
        uploadStatus.classList.remove("hidden");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadPrompt.classList.add("hidden");
        uploadPreview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);

      uploadStatus.className = "text-xs mt-2 text-brand-500";
      uploadStatus.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
      uploadStatus.classList.remove("hidden");

      const formDataObj = new FormData();
      formDataObj.append("image", file);

      try {
        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Upload gagal");
        }

        fileUrlInput.value = result.url;
        publicIdInput.value = result.public_id;

        uploadStatus.className = "text-xs mt-2 text-brand-500";
        uploadStatus.innerHTML =
          '<i class="fa-solid fa-circle-check"></i> Gambar berhasil diupload!';
      } catch (err) {
        console.error(err);
        uploadStatus.className = "text-xs mt-2 text-rose-400";
        uploadStatus.innerHTML = `❌ ${err.message}`;
      }
    }
  }

  // Show modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  requestAnimationFrame(() => {
    modal.classList.remove("opacity-0");
    modal.querySelector(".bg-slate-900").classList.remove("scale-95");
    modal.querySelector(".bg-slate-900").classList.add("scale-100");
  });
}

function closeModal() {
  modal.classList.add("opacity-0");
  modal.querySelector(".bg-slate-900").classList.add("scale-95");
  modal.querySelector(".bg-slate-900").classList.remove("scale-100");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    currentType = null;
    currentId = null;
  }, 300);
}

// ============================================
// SUBMIT FORM
// ============================================
modalForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formDataObj = new FormData(modalForm);
  const data = Object.fromEntries(formDataObj.entries());

  const url = currentId
    ? `${API_URL}/api/${currentType}/${currentId}`
    : `${API_URL}/api/${currentType}`;

  const method = currentId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      showToast(result.error || "Gagal menyimpan data", "error");
      return;
    }

    showToast(
      currentId ? "✅ Berhasil diupdate" : "✅ Berhasil ditambahkan",
      "success",
    );
    closeModal();

    if (currentType === "testimoni") loadTestimoni();
    if (currentType === "agenda") loadAgenda();
    if (currentType === "galeri") loadGaleri();
  } catch (err) {
    console.error(err);
    showToast("Gagal terhubung ke server", "error");
  }
});

// ============================================
// EDIT FUNCTIONS
// ============================================
window.editTestimoni = async (id) => {
  const res = await fetch(`${API_URL}/api/testimoni`);
  const data = await res.json();
  const item = data.find((i) => i._id === id);
  if (item) openModal("testimoni", item);
};

window.editAgenda = async (id) => {
  const res = await fetch(`${API_URL}/api/agenda`);
  const data = await res.json();
  const item = data.find((i) => i._id === id);
  if (item) openModal("agenda", item);
};

window.editGaleri = async (id) => {
  const res = await fetch(`${API_URL}/api/galeri`);
  const data = await res.json();
  const item = data.find((i) => i._id === id);
  if (item) openModal("galeri", item);
};

// ============================================
// DELETE FUNCTION
// ============================================
window.deleteItem = async (type, id) => {
  if (!confirm(`Yakin mau hapus ${type} ini?`)) return;

  try {
    const res = await fetch(`${API_URL}/api/${type}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("Gagal menghapus", "error");
      return;
    }

    showToast("✅ Berhasil dihapus", "success");

    if (type === "testimoni") loadTestimoni();
    if (type === "agenda") loadAgenda();
    if (type === "galeri") loadGaleri();
  } catch (err) {
    console.error(err);
    showToast("Gagal terhubung ke server", "error");
  }
};
