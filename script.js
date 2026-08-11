(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const header = $('.site-header');
  const menuBtn = $('.menu-button');
  const mobileMenu = $('#mobile-menu');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      mobileMenu.hidden = open;
      document.body.classList.toggle('menu-open', !open);
    });
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.classList.remove('menu-open');
    }));
  }

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Hero slideshow
  const slides = $$('.hero-slide');
  const dots = $$('.hero-slide-dots button');
  let slideIndex = 0;
  let heroTimer;
  const showSlide = index => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === slideIndex));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === slideIndex));
  };
  const startHero = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || slides.length < 2) return;
    clearInterval(heroTimer);
    heroTimer = setInterval(() => showSlide(slideIndex + 1), 6200);
  };
  dots.forEach((d, i) => d.addEventListener('click', () => { showSlide(i); startHero(); }));
  startHero();

  // Project filters
  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  const applyFilter = filter => {
    filterButtons.forEach(b => b.classList.toggle('is-active', b.dataset.filter === filter));
    projectCards.forEach(card => {
      const cats = (card.dataset.categories || '').split(' ');
      card.classList.toggle('is-hidden', filter !== 'all' && !cats.includes(filter));
    });
  };
  filterButtons.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
  $$('[data-filter-jump]').forEach(link => link.addEventListener('click', () => {
    const filter = link.dataset.filterJump;
    setTimeout(() => applyFilter(filter), 350);
  }));

  // Lightbox for projects and certificates
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');
  const closeBtn = $('.lightbox-close');
  const prevBtn = $('.lightbox-nav.prev');
  const nextBtn = $('.lightbox-nav.next');
  let currentItems = [];
  let currentIndex = 0;

  const showInLightbox = (src, title, list, index) => {
    if (!lightbox || !lightboxImage) return;
    currentItems = list || [];
    currentIndex = index ?? 0;
    lightboxImage.src = src;
    lightboxImage.alt = title || '';
    lightboxCaption.textContent = title || '';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  };

  const visibleProjects = () => projectCards.filter(c => !c.classList.contains('is-hidden'));
  projectCards.forEach(card => {
    const open = () => {
      const items = visibleProjects();
      const idx = items.indexOf(card);
      showInLightbox(card.dataset.full, card.dataset.title, items.map(c => ({ src: c.dataset.full, title: c.dataset.title })), idx);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  $$('.certificate-thumb').forEach(btn => btn.addEventListener('click', () => {
    const certs = $$('.certificate-thumb').map(c => ({ src: c.dataset.cert, title: c.dataset.certTitle }));
    showInLightbox(btn.dataset.cert, btn.dataset.certTitle, certs, $$('.certificate-thumb').indexOf(btn));
  }));

  const navLightbox = dir => {
    if (!currentItems.length) return;
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    const item = currentItems[currentIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title || '';
    lightboxCaption.textContent = item.title || '';
  };
  prevBtn?.addEventListener('click', e => { e.stopPropagation(); navLightbox(-1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); navLightbox(1); });
  closeBtn?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.open) return;
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // Subtle 3D tilt on capable pointers
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const max = card.classList.contains('layer-scene') ? 2.2 : 4.5;
        card.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        if (!card.classList.contains('layer-scene')) card.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => {
        if (!card.classList.contains('layer-scene')) card.style.transform = '';
      });
    });
  }

  // WhatsApp form
  const form = $('#whatsapp-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const service = (data.get('service') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const text = [
      'Καλησπέρα, επικοινωνώ από το greenhomeupgrade.gr.',
      '',
      `Ονοματεπώνυμο: ${name}`,
      `Τηλέφωνο: ${phone}`,
      `Εργασία: ${service}`,
      message ? `Περιγραφή: ${message}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/306936922327?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  $('#year').textContent = new Date().getFullYear();
})();
