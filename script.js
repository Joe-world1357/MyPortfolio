/* ═══════════════════════════════════════════════════
   YOUSIF M. RABEA · SOC ANALYST PORTFOLIO
   Main JavaScript
═══════════════════════════════════════════════════ */

'use strict';

/* ── SERVICE WORKER ─────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}

/* ── DOM READY ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initScrollAnimations();
  initLabProgressBars();
  initContactForm();
  initSmoothScroll();
  initTypingEffect();
});

/* ═══════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════ */
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Scroll: add .scrolled class to navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile hamburger toggle
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        e.target !== hamburger &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ═══════════════════════════════════════════════════
   ACTIVE SECTION HIGHLIGHTING
═══════════════════════════════════════════════════ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ═══════════════════════════════════════════════════
   SCROLL ANIMATIONS (animate-on-scroll)
═══════════════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('animate-on-scroll'));
        const index = siblings.indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   LAB PROGRESS BARS
═══════════════════════════════════════════════════ */
function initLabProgressBars() {
  const bars = document.querySelectorAll('.lab-progress-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = targetWidth;
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════
   TERMINAL TYPING EFFECT (hero only)
═══════════════════════════════════════════════════ */
function initTypingEffect() {
  // Stagger terminal lines appearance on load
  const terminalLines = document.querySelectorAll('.terminal-body .t-line');
  terminalLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      line.style.opacity = '1';
    }, 300 + i * 160);
  });
}

/* ═══════════════════════════════════════════════════
   CONTACT FORM (EmailJS)
═══════════════════════════════════════════════════ */
function initContactForm() {
  // Initialize EmailJS
  emailjs.init('CIeita8FRrKPiEWR4');

  const form        = document.getElementById('contact-form');
  const formResp    = document.getElementById('form-response');
  const submitBtn   = document.getElementById('submit-btn');

  if (!form) return;

  /* Real-time validation */
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset response
    formResp.className = 'form-response';
    formResp.textContent = '';
    formResp.style.display = 'none';

    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const msgInput     = document.getElementById('message');

    const valid = [
      validateField(nameInput),
      validateField(emailInput),
      validateField(subjectInput),
      validateField(msgInput)
    ].every(Boolean);

    if (!valid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const templateParams = {
      user_name:  nameInput.value.trim(),
      user_email: emailInput.value.trim(),
      subject:    subjectInput.value.trim(),
      message:    msgInput.value.trim()
    };

    try {
      await emailjs.send('service_htfyhld', 'template_mn00udu', templateParams);
      formResp.textContent = '✓ Message sent. I\'ll respond within 24 hours.';
      formResp.classList.add('success');
      formResp.style.display = 'block';
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('success', 'error'));
    } catch (err) {
      formResp.textContent = '✕ Something went wrong. Please try again or email me directly.';
      formResp.classList.add('error');
      formResp.style.display = 'block';
      console.error('EmailJS error:', err);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function validateField(input) {
  const group      = input.parentElement;
  const validDiv   = group.querySelector('.form-validation');
  const val        = input.value.trim();

  if (!val) {
    group.classList.add('error');
    group.classList.remove('success');
    if (validDiv) validDiv.textContent = `${input.placeholder} is required.`;
    return false;
  }

  if (input.type === 'email') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(val)) {
      group.classList.add('error');
      group.classList.remove('success');
      if (validDiv) validDiv.textContent = 'Please enter a valid email address.';
      return false;
    }
  }

  group.classList.remove('error');
  group.classList.add('success');
  if (validDiv) validDiv.textContent = '';
  return true;
}

/* ═══════════════════════════════════════════════════
   KEYBOARD NAVIGATION INDICATOR
═══════════════════════════════════════════════════ */
document.addEventListener('keydown', () => {
  document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});
