const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const lightbox = document.getElementById('lightbox');
const lbImg = lightbox?.querySelector('img');
const lbText = lightbox?.querySelector('p');
const lbCounter = lightbox?.querySelector('.lightbox-counter');
const prevBtn = lightbox?.querySelector('.lightbox-nav.prev');
const nextBtn = lightbox?.querySelector('.lightbox-nav.next');

let activeGallery = [];
let activeIndex = 0;
let activeTitle = '';
let activeDescription = '';

function renderLightbox() {
  if (!lightbox || !lbImg || !activeGallery.length) return;
  lbImg.src = activeGallery[activeIndex];
  lbImg.alt = activeTitle || 'Έργο';
  lbText.textContent = activeDescription ? `${activeTitle} — ${activeDescription}` : activeTitle;
  if (lbCounter) lbCounter.textContent = activeGallery.length > 1 ? `${activeIndex + 1} / ${activeGallery.length}` : '';
  const showNav = activeGallery.length > 1;
  if (prevBtn) prevBtn.hidden = !showNav;
  if (nextBtn) nextBtn.hidden = !showNav;
}

function openLightbox(card) {
  const gallery = (card.dataset.gallery || '').split('|').filter(Boolean);
  const img = card.querySelector('img');
  if (!gallery.length && !img) return;

  activeGallery = gallery.length ? gallery : [img.src];
  activeIndex = 0;
  activeTitle = card.dataset.title || '';
  activeDescription = card.dataset.description || '';

  renderLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (lightbox) {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
}

function changeSlide(step) {
  if (!activeGallery.length) return;
  activeIndex = (activeIndex + step + activeGallery.length) % activeGallery.length;
  renderLightbox();
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
prevBtn?.addEventListener('click', e => { e.stopPropagation(); changeSlide(-1); });
nextBtn?.addEventListener('click', e => { e.stopPropagation(); changeSlide(1); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (lightbox?.hidden) return;
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});

const form = document.getElementById('quote-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const email = data.get('email') || '';
  const area = data.get('area') || '';
  const message = data.get('message') || '';
  const text = `Καλησπέρα, ενδιαφέρομαι για προσφορά από τη Green Home Upgrade.%0A%0AΌνομα: ${encodeURIComponent(name)}%0AΤηλέφωνο: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0AΠεριοχή: ${encodeURIComponent(area)}%0AΑνάγκη: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/306936922327?text=${text}`, '_blank');
});
