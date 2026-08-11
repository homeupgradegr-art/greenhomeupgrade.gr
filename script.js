const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const year = document.getElementById('year');
const cursorGlow = document.querySelector('.cursor-glow');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const finePointer = window.matchMedia('(pointer:fine)').matches;

if (finePointer) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-y * 7).toFixed(2);
      const ry = (x * 9).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  window.addEventListener('mousemove', (e) => {
    if (!cursorGlow) return;
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

const quoteForm = document.getElementById('quoteForm');
quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value.trim();
  const area = document.getElementById('area').value.trim();
  const message = document.getElementById('message').value.trim();

  const text = [
    'Νέο αίτημα από greenhomeupgrade.gr',
    `Ονοματεπώνυμο: ${name}`,
    `Τηλέφωνο: ${phone}`,
    `Υπηρεσία: ${service}`,
    area ? `Περιοχή: ${area}` : '',
    message ? `Περιγραφή: ${message}` : ''
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/306936922327?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
});
