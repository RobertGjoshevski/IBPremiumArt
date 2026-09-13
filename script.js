/* =========================================================
   IB PREMIUM ART – JavaScript
   Features: Parallax Hero, Nav scroll, Mobile menu,
   Gallery filter, Lightbox, Language toggle,
   Scroll-driven entrance animations
   ========================================================= */

'use strict';

// ── Language System ─────────────────────────────────────
const translations = {
  mk: {
    langLabel: 'MK',
    langFlag: '🇲🇰',
    htmlLang: 'mk',
  },
  en: {
    langLabel: 'EN',
    langFlag: '🇬🇧',
    htmlLang: 'en',
  }
};

let currentLang = 'mk';

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = translations[lang].htmlLang;

  // Update all elements with data-mk / data-en
  document.querySelectorAll('[data-mk]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Handle elements that have children (don't overwrite HTML)
      if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  // Update lang button UI
  const langLabel = document.getElementById('langLabel');
  const langBtn = document.getElementById('langBtn');
  if (langLabel) langLabel.textContent = translations[lang].langLabel;
  if (langBtn) {
    const flag = langBtn.querySelector('.lang-flag');
    if (flag) flag.textContent = translations[lang].langFlag;
  }

  // Save preference
  try { localStorage.setItem('ibpa-lang', lang); } catch(e) {}
}

function initLanguage() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;

  // Load saved preference
  let saved = 'mk';
  try { saved = localStorage.getItem('ibpa-lang') || 'mk'; } catch(e) {}
  applyLanguage(saved);

  btn.addEventListener('click', () => {
    applyLanguage(currentLang === 'mk' ? 'en' : 'mk');
  });
}


// ── Navbar ──────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  if (!navbar) return;

  // Scroll state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      menu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}


// ── Parallax Hero ────────────────────────────────────────
function initParallax() {
  const heroBg = document.getElementById('heroBg');
  const heroSection = document.getElementById('hero');
  if (!heroBg || !heroSection) return;

  // Check for reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    // Only apply parallax when hero is visible
    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight; // 0 → 1
      const translateY = progress * 35; // Move up 35% of scroll
      heroBg.style.transform = `translateY(${translateY}%)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}


// ── Entrance Animations ──────────────────────────────────
function initAnimations() {
  const targets = document.querySelectorAll(
    '.section-label, .section-title, .section-sub, .about-text, .about-images, ' +
    '.stat-item, .service-card, .gallery-item, .contact-card, .contact-map, ' +
    '.footer-brand, .footer-links-group'
  );

  targets.forEach(el => el.classList.add('animate-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children in grids
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Add stagger delays to grid items
  document.querySelectorAll('.services-grid .service-card').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
  document.querySelectorAll('.about-stats .stat-item').forEach((el, i) => {
    el.dataset.delay = i * 100;
  });
  document.querySelectorAll('.footer-links-group').forEach((el, i) => {
    el.dataset.delay = i * 60;
  });

  targets.forEach(el => observer.observe(el));
}


// ── Gallery Filter ───────────────────────────────────────
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter items
      items.forEach(item => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}


// ── Lightbox ─────────────────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let currentIndex = 0;
  let images = [];

  function buildImageList() {
    images = Array.from(document.querySelectorAll('.gallery-zoom:not([data-src=""])'));
  }

  function openLightbox(idx) {
    buildImageList();
    currentIndex = idx;
    const btn = images[currentIndex];
    if (!btn) return;

    const src = btn.dataset.src;
    const caption = btn.getAttribute(`data-caption-${currentLang}`) || btn.dataset.captionMk || '';

    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function prevImage() {
    buildImageList();
    // Only navigate visible items
    const visible = images.filter(img => {
      const item = img.closest('.gallery-item');
      return item && !item.classList.contains('hidden');
    });
    const visIdx = visible.indexOf(images[currentIndex]);
    const prev = visible[(visIdx - 1 + visible.length) % visible.length];
    currentIndex = images.indexOf(prev);
    openLightbox(currentIndex);
  }

  function nextImage() {
    buildImageList();
    const visible = images.filter(img => {
      const item = img.closest('.gallery-item');
      return item && !item.classList.contains('hidden');
    });
    const visIdx = visible.indexOf(images[currentIndex]);
    const next = visible[(visIdx + 1) % visible.length];
    currentIndex = images.indexOf(next);
    openLightbox(currentIndex);
  }

  // Open on zoom button click
  document.querySelectorAll('.gallery-zoom').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      buildImageList();
      openLightbox(i);
    });
  });

  // Open on item click (anywhere on image)
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const btn = item.querySelector('.gallery-zoom');
      if (!btn) return;
      buildImageList();
      const i = images.indexOf(btn);
      openLightbox(i >= 0 ? i : 0);
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', prevImage);
  lbNext?.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Click outside image to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 60) {
      dx < 0 ? nextImage() : prevImage();
    }
  }, { passive: true });
}


// ── Counter Animation for Stats ──────────────────────────
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const rawText = el.textContent.trim();
      const numMatch = rawText.match(/^(\d+)/);
      if (!numMatch) return;

      const end = parseInt(numMatch[1]);
      const suffix = rawText.slice(numMatch[1].length);
      const duration = 1600;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const value = Math.floor(eased * end);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}


// ── Brands ticker pause on hover ────────────────────────
function initBrands() {
  const track = document.querySelector('.brands-slide');
  if (!track) return;
  const parent = track.parentElement;
  parent.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  parent.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}


// ── Smooth scroll for anchor links ──────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


// ── Gallery fade animation CSS ───────────────────────────
function injectFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}


// ── Init All ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectFadeIn();
  initLanguage();
  initNavbar();
  initParallax();
  initAnimations();
  initGalleryFilter();
  initLightbox();
  initCounters();
  initBrands();
  initSmoothScroll();
});
