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
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (!lightbox || !lbImg) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbText.textContent = card.dataset.title || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox(){ if(lightbox){lightbox.hidden=true;document.body.style.overflow='';}}
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

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
