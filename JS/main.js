document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const line1 = hamburgerBtn ? hamburgerBtn.querySelector('.line-1') : null;
  const line2 = hamburgerBtn ? hamburgerBtn.querySelector('.line-2') : null;
  const line3 = hamburgerBtn ? hamburgerBtn.querySelector('.line-3') : null;

  let isOpen = false;

  /* ============================================
     1. JAM & TANGGAL REAL-TIME
     ============================================ */
  function updateClock() {
    const desktopClock = document.getElementById('realtimeClock');
    const mobileClock = document.getElementById('realtimeClockMobile');

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('shadow-2xl', 'bg-slate-900/95');
        nav.classList.remove('bg-slate-900/80');
      } else {
        nav.classList.remove('shadow-2xl', 'bg-slate-900/95');
        nav.classList.add('bg-slate-900/80');
      }
    });
  }

  /* ============================================
     3. FUNGSI BUKA / TUTUP MENU MOBILE
     ============================================ */
  function openMenu() {
    isOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';

    if (line1 && line2 && line3) {
      line1.classList.add('translate-y-[7px]', 'rotate-45');
      line2.classList.add('opacity-0');
      line3.classList.add('-translate-y-[7px]', '-rotate-45');
    }
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.style.maxHeight = '0px';

    if (line1 && line2 && line3) {
      line1.classList.remove('translate-y-[7px]', 'rotate-45');
      line2.classList.remove('opacity-0');
      line3.classList.remove('-translate-y-[7px]', '-rotate-45');
    }
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target) && isOpen) {
        closeMenu();
      }
    });
  }

  /* ============================================
     4. SCROLL PROGRESS BAR
     ============================================ */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  });

  /* ============================================
     5. REVEAL ON SCROLL
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 100}ms`;
    revealObserver.observe(el);
  });

  /* ============================================
     6. ACTIVE NAV LINK
     ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('bg-brand-500/20', 'text-brand-500');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('bg-brand-500/20', 'text-brand-500');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ============================================
     7. BACK TO TOP BUTTON
     ============================================ */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTop.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTop.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     8. LIGHTBOX GALLERY
     ============================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      requestAnimationFrame(() => {
        lightbox.classList.remove('opacity-0');
        lightboxImg.classList.remove('scale-90');
        lightboxImg.classList.add('scale-100');
      });
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('opacity-0');
    lightboxImg.classList.add('scale-90');
    lightboxImg.classList.remove('scale-100');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    }, 300);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ============================================
     9. COUNTER ANIMATION
     ============================================ */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix || '';
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
    { threshold: 0.5 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ============================================
     10. TYPING EFFECT HERO TITLE
     ============================================ */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const words = ['Kemandirian', 'Keberlanjutan', 'Kesejahteraan', 'Masa Depan'];
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
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  /* ============================================
     12. PARALLAX HERO BG
     ============================================ */
  const heroBlob = document.getElementById('heroBlob');
  const heroSection = document.getElementById('heroSection');
  if (heroBlob && heroSection) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBlob.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
    });
  }

  /* ============================================
     13. TESTIMONI SLIDER AUTO
     ============================================ */
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('opacity-0', i !== index);
      s.classList.toggle('pointer-events-none', i !== index);
      s.classList.toggle('translate-x-4', i !== index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('bg-brand-500', i === index);
      d.classList.toggle('w-8', i === index);
      d.classList.toggle('bg-slate-600', i !== index);
      d.classList.toggle('w-2', i !== index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startAuto() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  if (slides.length > 0) {
    showSlide(0);
    startAuto();

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(i);
        startAuto();
      });
    });
  }

  /* ============================================
     14. MOBILE BOTTOM NAV — Hide on scroll down
     ============================================ */
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        bottomNav.style.transform = 'translateY(100%)';
      } else {
        bottomNav.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  }
});