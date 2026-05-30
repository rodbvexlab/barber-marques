/* ═══════════════════════════════════════
   BARBEARIA MARQUES — JavaScript
   Animations · Interactions · UX
   ═══════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   1. PAGE LOADER
   ──────────────────────────────────────── */
const loader = document.getElementById('pageLoader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
    document.body.style.overflow = '';
    // Trigger hero reveal animations
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      const delay = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => el.classList.add('revealed'), 400 + delay);
    });
    // Animate hero image
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) heroImg.classList.add('loaded');
  }, 2200);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* ────────────────────────────────────────
   2. CUSTOM CURSOR
   ──────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .service-card, .gallery-item, input, textarea, select';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}


/* ────────────────────────────────────────
   3. NAVBAR — scroll behavior
   ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
}, { passive: true });


/* ────────────────────────────────────────
   4. MOBILE MENU
   ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});


/* ────────────────────────────────────────
   5. SCROLL REVEAL — Intersection Observer
   ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => el.classList.add('revealed'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

function initReveal() {
  const elements = document.querySelectorAll(
    '.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right, .reveal-scale'
  );
  elements.forEach(el => revealObserver.observe(el));
}

// Wait for loader to finish then init
setTimeout(initReveal, 1000);


/* ────────────────────────────────────────
   6. PARALLAX & FADE — hero background
   ──────────────────────────────────────── */
const heroImg = document.querySelector('.hero-img');

if (heroImg) {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = window.innerHeight;
    
    if (scrolled <= heroHeight) {
      const progress = scrolled / heroHeight;
      // Fade out dynamically from 0.4 (40% opacity) to 0%
      const opacity = 0.4 * (1 - progress);
      heroImg.style.opacity = opacity;
      
      if (isDesktop) {
        heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
      }
    }
  }, { passive: true });
}


/* ────────────────────────────────────────
   7. COUNTER ANIMATION — hero stats
   ──────────────────────────────────────── */
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = '+' + Math.floor(current) + suffix;
  }, 25);
}


/* ────────────────────────────────────────
   8. CONTACT FORM — submission handler
   ──────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Enviando...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate send (replace with real backend/formspree/netlify forms)
    setTimeout(() => {
      btn.textContent = '✓ Mensagem Enviada!';
      btn.style.opacity = '1';
      btn.style.background = '#2a7a2a';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3500);
    }, 1500);
  });
}


/* ────────────────────────────────────────
   9. SMOOTH ANCHOR SCROLL
   ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────
   10. GALLERY — lightbox (simple)
   ──────────────────────────────────────── */
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach((img) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(10,9,8,0.96);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.25s ease;
      cursor: zoom-out;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }';
    document.head.appendChild(style);

    const clone = img.cloneNode();
    clone.style.cssText = `
      max-width: 90vw; max-height: 90vh;
      object-fit: contain;
      border-radius: 2px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    `;
    lightbox.appendChild(clone);
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', () => {
      lightbox.remove();
      style.remove();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { lightbox.remove(); style.remove(); document.removeEventListener('keydown', esc); }
    });
  });
});


/* ────────────────────────────────────────
   11. SERVICE CARDS — magnetic hover
   ──────────────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${-y * 0.025}deg) rotateY(${x * 0.025}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ────────────────────────────────────────
   12. BACK TO TOP visibility
   ──────────────────────────────────────── */
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 500 ? '1' : '0.3';
  }, { passive: true });
}


/* ────────────────────────────────────────
   13. ACTIVE NAV LINK on scroll
   ──────────────────────────────────────── */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--copper)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ────────────────────────────────────────
   14. MAGNETIC BUTTONS & LINKS ($10K Detail)
   ──────────────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const magneticElements = document.querySelectorAll('.btn, .nav-link, .social-btn, .contact-link, .hamburger, .nav-logo-img');
  
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Elastic magnetic pull towards mouse (25% translation factor)
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ────────────────────────────────────────
   15. CINEMATIC PARALLAX - ABOUT SECTION
   ──────────────────────────────────────── */
const aboutSection = document.querySelector('.about');
const aboutBgImg = document.querySelector('.about-bg-img');

if (aboutBgImg && aboutSection) {
  window.addEventListener('scroll', () => {
    const rect = aboutSection.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    
    if (rect.top < viewHeight && rect.bottom > 0) {
      const scrollProgress = (viewHeight - rect.top) / (viewHeight + rect.height);
      const yOffset = (scrollProgress - 0.5) * 90; // Scroll range shift
      aboutBgImg.style.transform = `scale(1.08) translateY(${yOffset}px)`;
    }
  }, { passive: true });
}

/* ────────────────────────────────────────
   16. CARDS MOUSE GLOW SPOTLIGHT
   ──────────────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glowCards = document.querySelectorAll('.service-card, .testimonial-card, .booking-card');
  
  glowCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
