/* ========================================
   Harsh Suradkar — Portfolio JavaScript
   ======================================== */

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 800);
});

/* ---- Scroll Progress Bar ---- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / max) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ---- Navbar: scroll class + active link ---- */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const onScroll = () => {
  /* sticky style */
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  /* active section highlighting */
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });

  /* scroll-to-top visibility */
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

/* Close on link click */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ---- Scroll to Top ---- */
const scrollTopBtn = document.getElementById('scroll-top');
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Typed Text Effect ---- */
const typedEl   = document.getElementById('typed');
const phrases   = [
  'CSE Student',
  'AI & ML Enthusiast',
  'Data Science Explorer',
  'Software Developer',
  'Problem Solver'
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

function typeLoop() {
  if (paused) return;

  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      paused   = true;
      setTimeout(() => { paused = false; typeLoop(); }, 2000);
      return;
    }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      paused    = true;
      setTimeout(() => { paused = false; typeLoop(); }, 400);
      return;
    }
    setTimeout(typeLoop, 45);
  }
}
typeLoop();

/* ---- AOS-style Intersection Observer ---- */
const aosEls = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.aosDelay || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      aosObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObserver.observe(el));

/* ---- Contact Form ---- */
const form    = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !subject || !message) {
    formMsg.textContent  = 'Please fill in all fields.';
    formMsg.style.color  = '#f87171';
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    formMsg.textContent = 'Please enter a valid email address.';
    formMsg.style.color = '#f87171';
    return;
  }

  /* Simulate send */
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled   = true;
  btn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    form.reset();
    btn.disabled  = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    formMsg.textContent = '✓ Message sent! I will get back to you soon.';
    formMsg.style.color = '#4ade80';
    setTimeout(() => { formMsg.textContent = ''; }, 5000);
  }, 1500);
});

/* ---- Skill tag: ripple glow on click ---- */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', function () {
    this.style.boxShadow = '0 0 18px var(--accent-glow)';
    setTimeout(() => { this.style.boxShadow = ''; }, 600);
  });
});

/* ---- Project card: tilt effect (desktop only) ---- */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Count-up animation for stat chips ---- */
function animateCount(el, target, duration = 1200) {
  let start = 0;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const chipObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const chip = entry.target;
    const text = chip.textContent;
    const match = text.match(/(\d+)\+/);
    if (match) {
      const num = parseInt(match[1], 10);
      const icon = chip.querySelector('i');
      const label = text.replace(/\d+\+/, '').trim();
      chip.innerHTML = '';
      if (icon) chip.appendChild(icon.cloneNode(true));
      chip.appendChild(document.createTextNode(' '));
      const countSpan = document.createElement('span');
      chip.appendChild(countSpan);
      chip.appendChild(document.createTextNode(' ' + label));
      animateCount(countSpan, num);
    }
    chipObserver.unobserve(chip);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.chip').forEach(c => chipObserver.observe(c));

/* ---- Smooth section entrance for achievement cards ---- */
document.querySelectorAll('.achievement-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 60) + 'ms';
});

/* ---- Init scroll handler once ---- */
onScroll();
