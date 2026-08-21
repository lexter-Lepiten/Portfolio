// Gallery filter
const filterButtons = document.querySelectorAll('.filter-btn');
const sampleItems = document.querySelectorAll('.sample-item');

function applyFilter(filter) {
  filterButtons.forEach(b => b.classList.toggle('is-active', b.dataset.filter === filter));
  sampleItems.forEach(item => {
    const match = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('is-hidden', !match);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

// Scroll progress bar + active nav highlighting (rAF-throttled)
const scrollProgress = document.getElementById('scrollProgress');
const navLinks = document.querySelectorAll('#primaryNav a[data-nav]');
const navSections = ['work', 'profile', 'skills', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function updateScrollProgress() {
  if (!scrollProgress) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

function updateActiveNav() {
  if (!navSections.length) return;

  const headerOffset = 120; // account for sticky header height
  const scrollPos = window.scrollY + headerOffset;

  let currentId = null;
  navSections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.dataset.nav === currentId);
  });
}

let scrollTicking = false;
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    updateActiveNav();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  updateScrollProgress();
  updateActiveNav();
});
updateScrollProgress();
updateActiveNav();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
let lastFocused = null;

// Ordered list of triggers currently visible, for prev/next + preload
const allTriggers = Array.from(document.querySelectorAll('.sample-trigger'));
let currentIndex = -1;

function getVisibleTriggers() {
  return allTriggers.filter(t => !t.closest('.sample-item').classList.contains('is-hidden'));
}

function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function preloadNeighbors(list, index) {
  const next = list[index + 1];
  const prev = list[index - 1];
  if (next) preloadImage(next.dataset.full);
  if (prev) preloadImage(prev.dataset.full);
}

function showAtIndex(list, index) {
  const trigger = list[index];
  if (!trigger) return;
  currentIndex = index;
  lightboxImg.src = trigger.dataset.full;
  lightboxImg.alt = trigger.querySelector('img').alt;
  lightboxCaption.textContent = trigger.dataset.caption || '';
  preloadNeighbors(list, index);
}

function openLightbox(trigger) {
  lastFocused = trigger;
  const list = getVisibleTriggers();
  const index = list.indexOf(trigger);
  showAtIndex(list, index === -1 ? 0 : index);

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightboxClose.focus();
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.classList.remove('lightbox-open');
  if (lastFocused) lastFocused.focus();
}

function showNext() {
  const list = getVisibleTriggers();
  if (!list.length) return;
  const next = (currentIndex + 1) % list.length;
  showAtIndex(list, next);
}

function showPrev() {
  const list = getVisibleTriggers();
  if (!list.length) return;
  const prev = (currentIndex - 1 + list.length) % list.length;
  showAtIndex(list, prev);
}

allTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}