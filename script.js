/* =========================================================
   IB PREMIUM ART – Main Script
   Features:
   - Project gallery generated from data (hover cycling)
   - Lightbox with auto-slide, dots, progress bar
   - Parallax hero, Navbar, Gallery filter
   - Bilingual MK/EN switcher (fixed innerHTML for HTML content)
   - Scroll animations, counters, brand ticker
   ========================================================= */

'use strict';

// ── Project Data ─────────────────────────────────────────
// Each project: folder, count (images 0.jpg … (count-1).jpg),
// category, optional featured (spans 2 cols), labels
const PROJECTS = [
  { id: 'home',   folder: 'Assets/Home',       count: 10, category: 'home',    featured: true,
    labelMk: 'Наша компанија',     labelEn: 'Our Company',
    descMk:  'Реновација на нашата зграда – од темели до финален изглед',
    descEn:  'Renovation of our building – from foundations to final look' },

  { id: 'p2',    folder: 'Assets/2',            count: 2,  category: 'project',
    labelMk: 'Проект #2',          labelEn: 'Project #2',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p3',    folder: 'Assets/3',            count: 4,  category: 'project',
    labelMk: 'Проект #3',          labelEn: 'Project #3',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p4',    folder: 'Assets/4',            count: 2,  category: 'project',
    labelMk: 'Проект #4',          labelEn: 'Project #4',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p5',    folder: 'Assets/5',            count: 2,  category: 'project',
    labelMk: 'Проект #5',          labelEn: 'Project #5',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p6',    folder: 'Assets/6',            count: 3,  category: 'project',
    labelMk: 'Проект #6',          labelEn: 'Project #6',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p7',    folder: 'Assets/7',            count: 4,  category: 'project',
    labelMk: 'Проект #7',          labelEn: 'Project #7',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p8',    folder: 'Assets/8',            count: 2,  category: 'project',
    labelMk: 'Проект #8',          labelEn: 'Project #8',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p9',    folder: 'Assets/9',            count: 4,  category: 'project',
    labelMk: 'Проект #9',          labelEn: 'Project #9',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p10',   folder: 'Assets/10',           count: 5,  category: 'project', featured: true,
    labelMk: 'Проект #10',         labelEn: 'Project #10',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p11',   folder: 'Assets/11',           count: 3,  category: 'project',
    labelMk: 'Проект #11',         labelEn: 'Project #11',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p12',   folder: 'Assets/12',           count: 2,  category: 'project',
    labelMk: 'Проект #12',         labelEn: 'Project #12',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p13',   folder: 'Assets/13',           count: 6,  category: 'project', featured: true,
    labelMk: 'Проект #13',         labelEn: 'Project #13',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p14',   folder: 'Assets/14',           count: 2,  category: 'project',
    labelMk: 'Проект #14',         labelEn: 'Project #14',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p15',   folder: 'Assets/15',           count: 3,  category: 'project',
    labelMk: 'Проект #15',         labelEn: 'Project #15',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p16',   folder: 'Assets/16',           count: 3,  category: 'project',
    labelMk: 'Проект #16',         labelEn: 'Project #16',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p17',   folder: 'Assets/17',           count: 4,  category: 'project',
    labelMk: 'Проект #17',         labelEn: 'Project #17',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'p18',   folder: 'Assets/18',           count: 3,  category: 'project',
    labelMk: 'Проект #18',         labelEn: 'Project #18',
    descMk:  'Клиентски проект',   descEn:  'Client project' },

  { id: 'other', folder: 'Assets/other',        count: 12, category: 'project', featured: true,
    labelMk: 'Финишерски работи',  labelEn: 'Finishing Works',
    descMk:  'Молерај, глетување и декоративни ефекти',
    descEn:  'Painting, plastering and decorative effects' },

  { id: 'p19',   folder: 'Assets/19',           count: 2,  category: 'project',
    labelMk: 'Проект #19',         labelEn: 'Project #19',
    descMk:  'Клиентски проект',   descEn:  'Client project' },
];

// Helper: build sorted image url list (0.jpg → last)
function buildImageList(project) {
  const urls = [];
  for (let i = 0; i < project.count; i++) {
    urls.push(`${project.folder}/${i}.jpg`);
  }
  return urls;
}

// Load per-folder project.json (or name.txt) to override labels & image count
async function loadProjectMeta(project) {
  try {
    const res = await fetch(`${project.folder}/project.json`);
    if (res.ok) {
      const meta = await res.json();
      if (meta.nameMk) project.labelMk = meta.nameMk;
      if (meta.nameEn) project.labelEn = meta.nameEn;
      if (meta.name) {
        project.labelMk = meta.name;
        project.labelEn = meta.name;
      }
      if (meta.descMk) project.descMk = meta.descMk;
      if (meta.descEn) project.descEn = meta.descEn;
      if (typeof meta.count === 'number' && meta.count > 0) project.count = meta.count;
      if (typeof meta.featured === 'boolean') project.featured = meta.featured;
      return;
    }
  } catch (_e) { /* offline or missing file — keep defaults */ }

  try {
    const res = await fetch(`${project.folder}/name.txt`);
    if (res.ok) {
      const name = (await res.text()).trim();
      if (name) {
        project.labelMk = name;
        project.labelEn = name;
      }
    }
  } catch (_e) { /* keep defaults */ }
}

async function loadAllProjectMeta() {
  await Promise.all(PROJECTS.map(loadProjectMeta));
}


// ── Language System ──────────────────────────────────────
let currentLang = 'mk';

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'mk' ? 'mk' : 'en';

  document.querySelectorAll('[data-mk]').forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (!val) return;

    // If the element has interactive children (a, button, input) do NOT overwrite its innerHTML
    if (el.querySelector('a, button, input, select, textarea')) return;

    // Use innerHTML for elements marked data-html="true" or when value has tags
    if (el.dataset.html === 'true' || val.includes('<')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Update language button UI
  const flag  = document.querySelector('#langBtn .lang-flag');
  const label = document.getElementById('langLabel');
  if (flag)  flag.textContent  = lang === 'mk' ? '🇲🇰' : '🇬🇧';
  if (label) label.textContent = lang === 'mk' ? 'MK'  : 'EN';

  // Re-apply project card labels that were rendered by JS
  document.querySelectorAll('.proj-label-text[data-mk]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`) || el.textContent;
  });

  // Re-apply lightbox caption if open
  if (!document.getElementById('lightbox').hidden) {
    Lightbox.refreshCaption();
  }

  try { localStorage.setItem('ibpa-lang', lang); } catch(_e) {}
}

function initLanguage() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;
  let saved = 'mk';
  try { saved = localStorage.getItem('ibpa-lang') || 'mk'; } catch(_e) {}
  applyLanguage(saved);
  btn.addEventListener('click', () => applyLanguage(currentLang === 'mk' ? 'en' : 'mk'));
}


// ── Gallery Builder ──────────────────────────────────────
// Preload cache to avoid re-creating Image objects
const preloadCache = new Map();

function preloadProjectImages(project, images) {
  if (preloadCache.has(project.id)) return;
  preloadCache.set(project.id, true);
  images.forEach(src => { const i = new Image(); i.src = src; });
}

function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  PROJECTS.forEach(project => {
    const images = buildImageList(project);
    const lastImg = images[images.length - 1];
    const isFeatured = project.featured;
    const photoWord = project.count === 1 ? 'фото' : 'фотографии';

    const card = document.createElement('div');
    card.className = `proj-card${isFeatured ? ' proj-card--featured' : ''}`;
    card.dataset.category  = project.category;
    card.dataset.projectId = project.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${project.labelMk} – ${project.count} ${photoWord}`);

    card.innerHTML = `
      <div class="proj-img-wrap">
        <img class="proj-img"
             src="${lastImg}"
             alt="${project.labelMk}"
             loading="lazy" />
      </div>

      <!-- Top-right: image count badge -->
      <div class="proj-count-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        ${project.count}
      </div>

      <!-- Project name – always visible -->
      <div class="proj-caption">
        <span class="proj-label-text"
              data-mk="${project.labelMk}"
              data-en="${project.labelEn}">${project.labelMk}</span>
      </div>

      <!-- Overlay: extra info on hover -->
      <div class="proj-overlay">
        <div class="proj-dots-row">
          ${images.map((_, i) =>
            `<span class="proj-dot${i === images.length - 1 ? ' active' : ''}"></span>`
          ).join('')}
        </div>
        <div class="proj-meta">
          <span class="proj-count-text">${project.count} ${photoWord}</span>
          <button class="proj-expand-btn" aria-label="Отвори галерија">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // ── Hover cycling ─────────────────────────────────────
    const img  = card.querySelector('.proj-img');
    const dots = card.querySelectorAll('.proj-dot');
    let cycleTimer   = null;
    let currentIdx   = images.length - 1; // start on last

    function setImg(idx, animate = true) {
      currentIdx = ((idx % images.length) + images.length) % images.length;
      if (animate) {
        img.classList.remove('img-fade');
        void img.offsetWidth; // force reflow
        img.classList.add('img-fade');
      }
      img.src = images[currentIdx];
      // Update dots
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
    }

    card.addEventListener('mouseenter', () => {
      preloadProjectImages(project, images);
      // Start from image 0
      setImg(0, true);
      cycleTimer = setInterval(() => {
        setImg((currentIdx + 1) % images.length, true);
      }, 1600);
    });

    card.addEventListener('mouseleave', () => {
      clearInterval(cycleTimer);
      cycleTimer = null;
      // Return to last image (final/finished result)
      setImg(images.length - 1, true);
    });

    // ── Open lightbox on click ────────────────────────────
    function openLightbox(e) {
      // Avoid double-fire when expand button is clicked
      if (e && e.target.closest('.proj-expand-btn')) return;
      Lightbox.open(images, project, 0);
    }

    card.addEventListener('click', openLightbox);
    card.querySelector('.proj-expand-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      Lightbox.open(images, project, 0);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        Lightbox.open(images, project, 0);
      }
    });

    // Store reference
    card._images  = images;
    card._project = project;

    grid.appendChild(card);
  });

  // Apply current language to newly rendered label-text elements
  document.querySelectorAll('.proj-label-text[data-mk]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`) || el.textContent;
  });
}


// ── Lightbox ─────────────────────────────────────────────
const Lightbox = {
  el:          null,
  imgEl:       null,
  captionEl:   null,
  dotsEl:      null,
  progressEl:  null,

  images:      [],
  project:     null,
  currentIdx:  0,
  autoTimer:   null,
  INTERVAL:    3000,

  init() {
    this.el         = document.getElementById('lightbox');
    this.imgEl      = document.getElementById('lightboxImg');
    this.captionEl  = document.getElementById('lightboxCaption');
    this.dotsEl     = document.getElementById('lightboxDots');
    this.progressEl = document.getElementById('lbProgressBar');

    const closeBtn  = document.getElementById('lightboxClose');
    const prevBtn   = document.getElementById('lightboxPrev');
    const nextBtn   = document.getElementById('lightboxNext');
    const stage     = document.getElementById('lightboxStage');

    if (!this.el) return;

    closeBtn?.addEventListener('click', () => this.close());
    prevBtn?.addEventListener('click',  () => this.prev());
    nextBtn?.addEventListener('click',  () => this.next());

    // Click outside (on stage background) to close
    this.el.addEventListener('click', e => {
      if (e.target === this.el) this.close();
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (!this.el || this.el.hidden) return;
      if (e.key === 'Escape')      this.close();
      if (e.key === 'ArrowLeft')   this.prev();
      if (e.key === 'ArrowRight')  this.next();
    });

    // Touch swipe
    let touchX = 0;
    this.el.addEventListener('touchstart', e => {
      touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 55) dx < 0 ? this.next() : this.prev();
    }, { passive: true });
  },

  open(images, project, startIdx = 0) {
    this.images  = images;
    this.project = project;
    this.buildDots();
    this.show(startIdx, false); // no animation on open
    this.el.hidden = false;
    document.body.style.overflow = 'hidden';
    this.startAuto();
    document.getElementById('lightboxClose')?.focus();
  },

  close() {
    this.stopAuto();
    this.el.hidden = true;
    this.imgEl.src = '';
    document.body.style.overflow = '';
  },

  show(idx, animate = true) {
    this.currentIdx = ((idx % this.images.length) + this.images.length) % this.images.length;

    if (animate) {
      this.imgEl.classList.remove('lb-img-anim');
      void this.imgEl.offsetWidth;
      this.imgEl.classList.add('lb-img-anim');
    }

    this.imgEl.src = this.images[this.currentIdx];
    this.refreshCaption();
    this.updateDots();
    this.restartProgress();
  },

  refreshCaption() {
    if (!this.project) return;
    const langKey  = `desc${currentLang === 'mk' ? 'Mk' : 'En'}`;
    const label    = this.project[`label${currentLang === 'mk' ? 'Mk' : 'En'}`];
    const total    = this.images.length;
    this.captionEl.textContent = `${label}  ·  ${this.currentIdx + 1} / ${total}`;
  },

  prev() {
    this.stopAuto();
    this.show(this.currentIdx - 1);
    this.startAuto();
  },

  next() {
    this.stopAuto();
    this.show(this.currentIdx + 1);
    this.startAuto();
  },

  buildDots() {
    this.dotsEl.innerHTML = '';
    this.images.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'lb-dot';
      btn.setAttribute('aria-label', `Слика ${i + 1}`);
      btn.addEventListener('click', () => {
        this.stopAuto();
        this.show(i);
        this.startAuto();
      });
      this.dotsEl.appendChild(btn);
    });
  },

  updateDots() {
    const dots = this.dotsEl.querySelectorAll('.lb-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === this.currentIdx));
    // Scroll active dot into view (for projects with many images)
    const active = this.dotsEl.querySelector('.lb-dot.active');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  },

  restartProgress() {
    if (!this.progressEl) return;
    // Remove then re-add 'running' class to restart CSS animation
    this.progressEl.classList.remove('running');
    void this.progressEl.offsetWidth; // force reflow
    this.progressEl.classList.add('running');
  },

  startAuto() {
    this.stopAuto();
    this.autoTimer = setInterval(() => {
      this.show((this.currentIdx + 1) % this.images.length);
    }, this.INTERVAL);
  },

  stopAuto() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
    // Pause progress bar
    if (this.progressEl) {
      this.progressEl.classList.remove('running');
    }
  },
};


// ── Navbar ──────────────────────────────────────────────
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    menu?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  menu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        active?.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }).observe
    && sections.forEach(s => new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          document.querySelector(`.nav-link[href="#${e.target.id}"]`)?.classList.add('active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }).observe(s));
}


// ── Parallax Hero ────────────────────────────────────────
function initParallax() {
  const heroBg  = document.getElementById('heroBg');
  const hero    = document.getElementById('hero');
  if (!heroBg || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (sy < hero.offsetHeight) {
          const p = sy / hero.offsetHeight;
          heroBg.style.transform = `translateY(${p * 35}%)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


// ── Gallery Filter ───────────────────────────────────────
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('galleryGrid');
  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      grid.querySelectorAll('.proj-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}


// ── Entrance Animations ──────────────────────────────────
function initAnimations() {
  const targets = document.querySelectorAll(
    '.section-label, .section-title, .section-sub, .about-text, .about-images, ' +
    '.stat-item, .service-card, .faq-item, .contact-card, .contact-map, ' +
    '.footer-brand, .footer-links-group'
  );
  targets.forEach(el => el.classList.add('animate-in'));

  // Stagger delays
  document.querySelectorAll('.services-grid .service-card').forEach((el, i) => el.dataset.delay = i * 80);
  document.querySelectorAll('.faq-grid .faq-item').forEach((el, i) => el.dataset.delay = i * 70);
  document.querySelectorAll('.about-stats .stat-item').forEach((el, i) => el.dataset.delay = i * 100);
  document.querySelectorAll('.footer-links-group').forEach((el, i) => el.dataset.delay = i * 60);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay) || 0;
      setTimeout(() => e.target.classList.add('visible'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
}


// ── Gallery Cards Stagger Animation ─────────────────────
function animateGalleryCards() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.proj-card').forEach((el, i) => {
    el.classList.add('animate-in');
    el.dataset.delay = (i % 4) * 60; // stagger within each row
    obs.observe(el);
  });
}


// ── Counter Animation ────────────────────────────────────
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)/);
      if (!match) return;
      const end    = parseInt(match[1]);
      const suffix = raw.slice(match[1].length);
      const dur    = 1600;
      const start  = performance.now();
      const step   = now => {
        const t = Math.min((now - start) / dur, 1);
        const v = Math.floor((1 - Math.pow(1 - t, 3)) * end);
        el.textContent = v + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => obs.observe(el));
}


// ── Brand Ticker ─────────────────────────────────────────
function initBrands() {
  const slide = document.querySelector('.brands-slide');
  const track = slide?.parentElement;
  if (!slide || !track) return;
  track.addEventListener('mouseenter', () => slide.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => slide.style.animationPlayState = 'running');
}


// ── Smooth Scroll ────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}


// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load names/counts from each folder's project.json, then build gallery
  await loadAllProjectMeta();
  buildGallery();
  animateGalleryCards();

  Lightbox.init();
  initLanguage();   // after gallery so label-text elements exist
  initNavbar();
  initParallax();
  initAnimations();
  initGalleryFilter();
  initCounters();
  initBrands();
  initSmoothScroll();
});
