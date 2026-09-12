document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const line1 = hamburgerBtn ? hamburgerBtn.querySelector('.line-1') : null;
  const line2 = hamburgerBtn ? hamburgerBtn.querySelector('.line-2') : null;
  const line3 = hamburgerBtn ? hamburgerBtn.querySelector('.line-3') : null;

  let isOpen = false;

  // 1. Fitur Jam & Tanggal Digital Real-Time
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

  // Jalankan jam secara berkala
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Efek Shadow pada Nav saat Scroll
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

  // 3. Fungsi Buka Menu Mobile
  function openMenu() {
    isOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';

    if (line1 && line2 && line3) {
      line1.classList.add('translate-y-[7px]', 'rotate-45');
      line2.classList.add('opacity-0');
      line3.classList.add('-translate-y-[7px]', '-rotate-45');
    }
  }

  // 4. Fungsi Tutup Menu Mobile
  function closeMenu() {
    isOpen = false;
    mobileMenu.style.maxHeight = '0px';

    if (line1 && line2 && line3) {
      line1.classList.remove('translate-y-[7px]', 'rotate-45');
      line2.classList.remove('opacity-0');
      line3.classList.remove('-translate-y-[7px]', '-rotate-45');
    }
  }

  // 5. Event Listener Hamburger & Outside Click
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Otomatis tutup menu pas link navigasi mobile diklik
    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Tutup menu kalau klik di luar area navbar
    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target) && isOpen) {
        closeMenu();
      }
    });
  }
});