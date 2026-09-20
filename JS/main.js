document.addEventListener("DOMContentLoaded", () => {
  /* ============================================
     VARIABEL GLOBAL
     ============================================ */
  const API_URL = "https://sentra-mina-backend-production.up.railway.app";
  const nav = document.getElementById("mainNav");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const line1 = hamburgerBtn ? hamburgerBtn.querySelector(".line-1") : null;
  const line2 = hamburgerBtn ? hamburgerBtn.querySelector(".line-2") : null;
  const line3 = hamburgerBtn ? hamburgerBtn.querySelector(".line-3") : null;
  let isOpen = false;

  /* ============================================
     1. JAM & TANGGAL REAL-TIME
     ============================================ */
  function updateClock() {
    const desktopClock = document.getElementById("realtimeClock");
    const mobileClock = document.getElementById("realtimeClockMobile");
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const fullString = `${dateStr} | ${timeStr}`;
    if (desktopClock) desktopClock.textContent = fullString;
    if (mobileClock) mobileClock.textContent = fullString;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ============================================
     2. EFEK SHADOW NAVBAR SAAT SCROLL
     ============================================ */
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        nav.classList.add("shadow-2xl", "bg-slate-900/95");
        nav.classList.remove("bg-slate-900/80");
      } else {
        nav.classList.remove("shadow-2xl", "bg-slate-900/95");
        nav.classList.add("bg-slate-900/80");
      }
    });
  }

  /* ============================================
     3. FUNGSI BUKA / TUTUP MENU MOBILE
     ============================================ */
  function openMenu() {
    isOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    if (line1 && line2 && line3) {
      line1.classList.add("translate-y-[7px]", "rotate-45");
      line2.classList.add("opacity-0");
      line3.classList.add("-translate-y-[7px]", "-rotate-45");
    }
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.style.maxHeight = "0px";
    if (line1 && line2 && line3) {
      line1.classList.remove("translate-y-[7px]", "rotate-45");
      line2.classList.remove("opacity-0");
      line3.classList.remove("-translate-y-[7px]", "-rotate-45");
    }
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (nav && !nav.contains(e.target) && isOpen) closeMenu();
    });
  }

  /* ============================================
     4. SCROLL PROGRESS BAR
     ============================================ */
  const progressBar = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
  });

  /* ============================================
     5. REVEAL ON SCROLL
     ============================================ */
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal:not(.reveal-active)");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 100}ms`;
      revealObserver.observe(el);
    });
  }
  initReveal();

  /* ============================================
     6. ACTIVE NAV LINK
     ============================================ */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("bg-brand-500/20", "text-brand-500");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("bg-brand-500/20", "text-brand-500");
            }
          });
        }
      });
    },
    { threshold: 0.4 },
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ============================================
     7. BACK TO TOP
     ============================================ */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.remove(
        "opacity-0",
        "pointer-events-none",
        "translate-y-4",
      );
      backToTop.classList.add("opacity-100", "translate-y-0");
    } else {
      backToTop.classList.add(
        "opacity-0",
        "pointer-events-none",
        "translate-y-4",
      );
      backToTop.classList.remove("opacity-100", "translate-y-0");
    }
  });
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================
     8. LIGHTBOX GALLERY
     ============================================ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  function attachLightboxEvents() {
    document.querySelectorAll(".gallery-item").forEach((item) => {
      if (item.dataset.lightboxAttached) return;
      item.dataset.lightboxAttached = "true";
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        if (!img || !lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        requestAnimationFrame(() => {
          lightbox.classList.remove("opacity-0");
          lightboxImg.classList.remove("scale-90");
          lightboxImg.classList.add("scale-100");
        });
      });
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("opacity-0");
    lightboxImg.classList.add("scale-90");
    lightboxImg.classList.remove("scale-100");
    setTimeout(() => {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
    }, 300);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  attachLightboxEvents();

  /* ============================================
     9. COUNTER ANIMATION
     ============================================ */
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix || "";
          let current = 0;
          const step = target / 50;
          const tick = () => {
            current += step;
            if (current < target) {
              el.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(tick);
            } else {
              el.textContent = target + suffix;
            }
          };
          tick();
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ============================================
     10. TYPING EFFECT
     ============================================ */
  const typingEl = document.getElementById("typingText");
  if (typingEl) {
    const words = [
      "Kemandirian",
      "Keberlanjutan",
      "Kesejahteraan",
      "Masa Depan",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }
      let speed = isDeleting ? 60 : 100;
      if (!isDeleting && charIndex === current.length) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }
      setTimeout(type, speed);
    }
    type();
  }

  /* ============================================
     11. CARD 3D TILT
     ============================================ */
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  /* ============================================
     12. PARALLAX HERO BG
     ============================================ */
  const heroBlob = document.getElementById("heroBlob");
  const heroSection = document.getElementById("heroSection");
  if (heroBlob && heroSection) {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.3;
      heroBlob.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
    });
  }

  /* ============================================
     13. TESTIMONI SLIDER
     ============================================ */
  function initTestimoniSlider() {
    const newSlides = document.querySelectorAll(".testi-slide");
    const newDots = document.querySelectorAll(".testi-dot");
    if (newSlides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      newSlides.forEach((s, i) => {
        s.classList.toggle("opacity-0", i !== index);
        s.classList.toggle("pointer-events-none", i !== index);
        s.classList.toggle("translate-x-4", i !== index);
      });
      newDots.forEach((d, i) => {
        d.classList.toggle("bg-brand-500", i === index);
        d.classList.toggle("w-8", i === index);
        d.classList.toggle("bg-slate-600", i !== index);
        d.classList.toggle("w-2", i !== index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % newSlides.length);
    }

    function startAuto() {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    showSlide(0);
    startAuto();

    newDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        clearInterval(slideInterval);
        showSlide(i);
        startAuto();
      });
    });
  }

  /* ============================================
     14. MOBILE BOTTOM NAV
     ============================================ */
  const bottomNav = document.getElementById("bottomNav");
  if (bottomNav) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        bottomNav.style.transform = "translateY(100%)";
      } else {
        bottomNav.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    });
  }

  /* ============================================
     15. MODAL LOGIN
     ============================================ */
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const loginModalClose = document.getElementById("loginModalClose");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const tabAdmin = document.getElementById("tabAdmin");
  const tabVisitor = document.getElementById("tabVisitor");
  const panelAdmin = document.getElementById("panelAdmin");
  const panelVisitor = document.getElementById("panelVisitor");
  const adminFormModal = document.getElementById("adminFormModal");
  const visitorFormModal = document.getElementById("visitorFormModal");

  function openLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove("hidden");
    loginModal.classList.add("flex");
    requestAnimationFrame(() => {
      loginModal.classList.remove("opacity-0");
      const box = loginModal.querySelector(".login-box");
      if (box) {
        box.classList.remove("scale-95");
        box.classList.add("scale-100");
      }
    });
  }

  function closeLoginModal() {
    if (!loginModal) return;
    loginModal.classList.add("opacity-0");
    const box = loginModal.querySelector(".login-box");
    if (box) {
      box.classList.add("scale-95");
      box.classList.remove("scale-100");
    }
    setTimeout(() => {
      loginModal.classList.add("hidden");
      loginModal.classList.remove("flex");
    }, 300);
  }

  if (loginBtn) loginBtn.addEventListener("click", openLoginModal);
  if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", openLoginModal);
  if (loginModalClose)
    loginModalClose.addEventListener("click", closeLoginModal);

  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeLoginModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLoginModal();
  });

  function showAdminTab() {
    if (!tabAdmin || !tabVisitor || !panelAdmin || !panelVisitor) return;
    tabAdmin.classList.add("bg-brand-500", "text-slate-950");
    tabAdmin.classList.remove("text-slate-400");
    tabVisitor.classList.remove("bg-brand-500", "text-slate-950");
    tabVisitor.classList.add("text-slate-400");
    panelAdmin.classList.remove("hidden");
    panelVisitor.classList.add("hidden");
  }

  function showVisitorTab() {
    if (!tabAdmin || !tabVisitor || !panelAdmin || !panelVisitor) return;
    tabVisitor.classList.add("bg-brand-500", "text-slate-950");
    tabVisitor.classList.remove("text-slate-400");
    tabAdmin.classList.remove("bg-brand-500", "text-slate-950");
    tabAdmin.classList.add("text-slate-400");
    panelVisitor.classList.remove("hidden");
    panelAdmin.classList.add("hidden");
  }

  if (tabAdmin) tabAdmin.addEventListener("click", showAdminTab);
  if (tabVisitor) tabVisitor.addEventListener("click", showVisitorTab);

  if (adminFormModal) {
    adminFormModal.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("modalAdminEmail").value.trim();
      const password = document
        .getElementById("modalAdminPassword")
        .value.trim();

      // Validasi basic
      if (!email || !password) {
        showToast("Email dan password wajib diisi", "error");
        return;
      }

      // Disable tombol submit biar gak double-click
      const submitBtn = adminFormModal.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> <span>Memproses...</span>';

      try {
        // Kirim ke backend
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          // Login gagal
          showToast(data.message || "Email atau password salah", "error");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          return;
        }

        // Login sukses — simpan token & data user
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        showToast(
          `Login berhasil! Selamat datang, ${data.user.nama}`,
          "success",
        );

        closeLoginModal();

        // Redirect ke admin panel setelah 800ms
        setTimeout(() => {
          window.location.href = "admin.html";
        }, 800);
      } catch (error) {
        console.error("Login error:", error);
        showToast("Gagal terhubung ke server. Coba lagi.", "error");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  if (visitorFormModal) {
    visitorFormModal.addEventListener("submit", (e) => {
      e.preventDefault();
      closeLoginModal();
      setTimeout(() => {
        showToast("Selamat datang di portal pengunjung!", "success");
      }, 350);
    });
  }

  /* ============================================
     16. TOAST NOTIFICATION
     ============================================ */
  function showToast(message, type = "info") {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "fixed top-24 right-6 z-[70] flex flex-col gap-3";
      document.body.appendChild(toastContainer);
    }

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
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-x-[120%]");
      toast.classList.add("translate-x-0");
    });

    setTimeout(() => {
      toast.classList.remove("translate-x-0");
      toast.classList.add("translate-x-[120%]");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ============================================
     17. INTEGRASI BACKEND API — TEST KONEKSI
     ============================================ */
  async function testKoneksi() {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      console.log("✅ Backend terkoneksi:", data.message);
    } catch (err) {
      console.error("❌ Backend gak bisa diakses:", err.message);
    }
  }
  testKoneksi();

  /* ============================================
     18. LOAD TESTIMONI DARI DATABASE
     ============================================ */
  async function loadTestimoni() {
    const container = document.querySelector("#testimoni .reveal.relative");
    if (!container) {
      console.warn("⚠️ Container testimoni gak ketemu");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/testimoni`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      console.log("✅ Testimoni loaded:", data.length, "item");

      // Hapus slide & dots lama
      container.querySelectorAll(".testi-slide").forEach((el) => el.remove());
      container.querySelectorAll(".testi-dot").forEach((el) => el.remove());

      // Bikin slides baru
      data.forEach((item, i) => {
        const slide = document.createElement("div");
        slide.className = `testi-slide transition-all duration-500 absolute inset-0 p-8 md:p-12 flex flex-col justify-center ${
          i === 0 ? "" : "opacity-0 pointer-events-none translate-x-4"
        }`;
        slide.innerHTML = `
          <p class="text-slate-200 text-lg md:text-xl leading-relaxed italic relative z-10">
            "${item.pesan}"
          </p>
          <div class="mt-6 flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center font-bold text-slate-950">
              ${item.inisial}
            </div>
            <div>
              <p class="font-bold text-white text-sm">${item.nama}</p>
              <p class="text-xs text-slate-400">${item.peran}</p>
            </div>
          </div>
        `;
        container.appendChild(slide);
      });

      // Bikin dots baru
      const dotsContainer = document.createElement("div");
      dotsContainer.className =
        "absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20";
      data.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = `testi-dot h-2 rounded-full transition-all duration-300 ${
          i === 0 ? "bg-brand-500 w-8" : "bg-slate-600 w-2"
        }`;
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dotsContainer.appendChild(dot);
      });
      container.appendChild(dotsContainer);

      initTestimoniSlider();
    } catch (err) {
      console.error("❌ Gagal load testimoni:", err.message);
    }
  }

  /* ============================================
     19. LOAD GALERI DARI DATABASE
     ============================================ */
  async function loadGaleri() {
    attachLightboxEvents();

    // Paksa galeri baru langsung keliatan (skip animasi reveal)
    setTimeout(() => {
      document.querySelectorAll("#galeriGrid .gallery-item").forEach((el) => {
        el.classList.add("reveal-active");
      });
    }, 100);
  }

  /* ============================================
     20. JALANKAN SEMUA
     ============================================ */
  loadTestimoni();
  loadGaleri();

  /* ============================================
     20. LOAD STATISTIK DARI DATABASE
     ============================================ */
  async function loadStatistik() {
    try {
      const res = await fetch(`${API_URL}/api/statistik`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      console.log("✅ Statistik loaded:", data);

      // Update counter di halaman
      const counters = document.querySelectorAll(".counter");

      // Urutan counter: Kolam Aktif, Panen, Pengunjung
      const values = [
        { target: data.kolamAktif, suffix: "+" },
        { target: data.panenPerBulan, suffix: "kg" },
        { target: data.pengunjung, suffix: "+" },
      ];

      counters.forEach((el, i) => {
        if (values[i]) {
          el.dataset.target = values[i].target;
          el.dataset.suffix = values[i].suffix;
        }
      });

      console.log("✅ Counter di-update dari statistik");
    } catch (err) {
      console.error("❌ Gagal load statistik:", err.message);
    }
  }

  loadStatistik();
});
