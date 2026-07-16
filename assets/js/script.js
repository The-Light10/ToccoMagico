document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const reveals = document.querySelectorAll('.reveal');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  /* ===== HEADER SCROLL ===== */
  // Controlla lo scroll anche all'avvio nel caso in cui la pagina venga ricaricata a metà
  const checkScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
  };
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  /* ===== MOBILE MENU ===== */
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks?.classList.toggle('open');
  });

  // Chiude il menu mobile quando si clicca su un link interno
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  /* ===== SCROLL REVEAL ===== */
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Smette di osservare una volta visibile
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  }

  /* ===== GALLERY LIGHTBOX ===== */
  // Si attiva solo se gli elementi del lightbox esistono nella pagina corrente
  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    
    // Chiude cliccando sullo sfondo scuro
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Chiude premendo il tasto ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ===== DROPDOWN PRENOTA ===== */
  document.querySelectorAll('.nav-cta-wrapper').forEach(wrapper => {
    const trigger = wrapper.querySelector('.nav-cta');
    const dropdown = wrapper.querySelector('.nav-dropdown');

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('open');
      
      // Chiude eventuali altri dropdown aperti
      document.querySelectorAll('.nav-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
    });

    // Chiude il dropdown se si clicca all'esterno
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown?.classList.remove('open');
      }
    });
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});