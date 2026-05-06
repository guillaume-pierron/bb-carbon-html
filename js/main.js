/* ============================================================
   B&B Carbon — JavaScript principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navigation mobile --- */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  const nav    = document.querySelector('.nav');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (nav) nav.classList.toggle('menu-open', open);
    });
    // Fermer au clic sur un lien
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
        if (nav) nav.classList.remove('menu-open');
      });
    });
  }

  /* --- Lien actif dans la nav --- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '');
    if (href === currentPath || (currentPath.includes(href) && href !== '/index.html' && href !== '/')) {
      link.classList.add('active');
    }
  });

  /* --- Nav transparente → blanche au scroll --- */
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Parallax hero --- */
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    const handleScroll = () => {
      const y = window.scrollY;
      heroBg.style.backgroundPositionY = `calc(50% + ${y * 0.35}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* --- Lazy load vidéos avec bouton play --- */
  document.querySelectorAll('video.lazy-video').forEach(video => {
    const btn = video.parentElement.querySelector('.video-play-btn');
    let loaded = false;

    const loadVideo = () => {
      if (loaded) return;
      loaded = true;
      video.querySelectorAll('source[data-src]').forEach(source => {
        source.src = source.dataset.src;
      });
      video.load();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo();
          observer.unobserve(video);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(video);

    const playVideo = () => {
      loadVideo();
      video.play().then(() => btn && btn.classList.add('hidden')).catch(() => {});
    };

    if (btn) {
      btn.addEventListener('click', playVideo);
      video.addEventListener('pause', () => btn.classList.remove('hidden'));
      video.addEventListener('click', () => {
        if (video.paused) playVideo();
        else video.pause();
      });
    }
  });

  /* --- Scroll animations (Intersection Observer) --- */
  const animElements = document.querySelectorAll('.animate-in');
  if (animElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animElements.forEach(el => observer.observe(el));
  }

  /* --- Filtre réalisations --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('no-results');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.cat;
        let visible = 0;

        projectCards.forEach(card => {
          const cardCat = card.dataset.category;
          const show = cat === 'Tous' || cardCat === cat;
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
      });
    });
  }

  /* --- Formulaire de contact --- */
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      // Simule un envoi (à remplacer par fetch vers votre endpoint)
      await new Promise(r => setTimeout(r, 1200));

      const success = document.getElementById('form-success');
      if (success) success.classList.add('visible');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Envoyer ma Demande';
    });
  }

  /* --- Année footer --- */
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
