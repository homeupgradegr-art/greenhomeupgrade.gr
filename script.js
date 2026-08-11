/* ===== Mobile menu ===== */
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

/* ===== Sticky header shrink on scroll ===== */
const header = document.querySelector('.site-header');
const onHeaderScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
};
onHeaderScroll();
window.addEventListener('scroll', onHeaderScroll, { passive: true });

/* ===== Active nav link highlighting while scrolling ===== */
const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));
}

/* ===== Scroll reveal animations ===== */
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
if ('IntersectionObserver' in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

/* ===== Back to top button ===== */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  const toggleBackToTop = () => {
    const show = window.scrollY > 480;
    backToTop.classList.toggle('visible', show);
    backToTop.hidden = false; // keep in DOM/flow, visibility controlled by class
  };
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Lightbox for project cards ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox?.querySelector('img');
const lbText = lightbox?.querySelector('p');
let lastFocusedEl = null;

document.querySelectorAll('.project-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  const title = card.dataset.title || '';
  card.setAttribute('aria-label', `Προβολή έργου: ${title}`);

  const openFromCard = () => {
    const img = card.querySelector('img');
    if (!lightbox || !lbImg) return;
    lastFocusedEl = document.activeElement;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbText.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close')?.focus();
  };

  card.addEventListener('click', openFromCard);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFromCard();
    }
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lastFocusedEl?.focus();
}
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
});

/* ===== Quote form: validation + honeypot + WhatsApp handoff ===== */
const form = document.getElementById('quote-form');
const formStatus = document.getElementById('form-status');

function setFieldError(name, show) {
  const input = form?.querySelector(`[name="${name}"]`);
  const field = input?.closest('.field');
  field?.classList.toggle('has-error', show);
}

function validateForm(data) {
  let valid = true;
  const name = (data.get('name') || '').toString().trim();
  const phone = (data.get('phone') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();

  const nameOk = name.length >= 2;
  setFieldError('name', !nameOk);
  if (!nameOk) valid = false;

  const phoneOk = /^[0-9+\s]{8,15}$/.test(phone);
  setFieldError('phone', !phoneOk);
  if (!phoneOk) valid = false;

  const emailOk = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setFieldError('email', !emailOk);
  if (!emailOk) valid = false;

  return valid;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // Honeypot: if filled, silently drop (likely a bot)
  if ((data.get('website') || '').toString().trim() !== '') {
    form.reset();
    return;
  }

  if (!validateForm(data)) {
    if (formStatus) {
      formStatus.textContent = 'Παρακαλούμε ελέγξτε τα στοιχεία που συμπληρώσατε.';
      formStatus.className = 'form-status err';
    }
    form.querySelector('.field.has-error input')?.focus();
    return;
  }

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn?.setAttribute('disabled', 'true');

  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const email = data.get('email') || '';
  const area = data.get('area') || '';
  const message = data.get('message') || '';

  const text = `Καλησπέρα, ενδιαφέρομαι για προσφορά από τη Green Home Upgrade.%0A%0AΌνομα: ${encodeURIComponent(name)}%0AΤηλέφωνο: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0AΠεριοχή: ${encodeURIComponent(area)}%0AΑνάγκη: ${encodeURIComponent(message)}`;

  window.open(`https://wa.me/306936922327?text=${text}`, '_blank');

  if (formStatus) {
    formStatus.textContent = 'Σας ανοίξαμε το WhatsApp με το μήνυμά σας έτοιμο για αποστολή!';
    formStatus.className = 'form-status ok';
  }

  setTimeout(() => submitBtn?.removeAttribute('disabled'), 1200);
});

// Clear field error state as the user corrects it
form?.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    input.closest('.field')?.classList.remove('has-error');
    if (formStatus) formStatus.textContent = '';
  });
});
