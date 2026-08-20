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

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  if (!scrollProgress) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Active nav-link highlighting
const navLinks = document.querySelectorAll('#primaryNav a[data-nav]');
const navSections = ['work', 'profile', 'skills', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

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

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('load', updateActiveNav);
updateActiveNav();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
let lastFocused = null;

function openLightbox(trigger) {
  lastFocused = trigger;
  lightboxImg.src = trigger.dataset.full;
  lightboxImg.alt = trigger.querySelector('img').alt;
  lightboxCaption.textContent = trigger.dataset.caption || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightboxClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.sample-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
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