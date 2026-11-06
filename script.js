// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Cursor glow (desktop only, respects reduced motion)
const cursorGlow = document.getElementById('cursorGlow');
const isTouchDevice = window.matchMedia('(hover: none)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!isTouchDevice && !prefersReducedMotion) {
  let glowX = 0, glowY = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => { glowX = e.clientX; glowY = e.clientY; });
  function animateGlow() {
    curX += (glowX - curX) * 0.12;
    curY += (glowY - curY) * 0.12;
    cursorGlow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
} else {
  cursorGlow.style.display = 'none';
}

// Auto-assign stagger delays to reveal items within the same grid
document.querySelectorAll('.skills-grid, .projects-grid, .achievements-grid, .goals-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    if (child.classList.contains('reveal')) child.setAttribute('data-stagger', Math.min(i + 1, 6));
  });
});

// NAVBAR scroll + mobile toggle
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('active'); navLinks.classList.remove('open'); }));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Skill bar animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animated'); skillObserver.unobserve(entry.target); } });
}, { threshold: 0.3 });
skillCards.forEach(el => skillObserver.observe(el));

// Contact form (mailto fallback)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in your name, email, and message.';
    formNote.style.color = '#ff6b6b';
    return;
  }
  formNote.textContent = 'Opening your email client...';
  formNote.style.color = 'var(--teal)';
  const subject = encodeURIComponent(document.getElementById('fsubject').value || 'Portfolio Contact');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:abir@example.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

// CV download buttons
const cvBtn = document.getElementById('cvDownloadBtn');
if(cvBtn) {
  cvBtn.addEventListener('click', (e) => {
    if (cvBtn.getAttribute('href') === '#') {
      e.preventDefault();
      alert('Add your Europass CV link or file path to the href in the HTML to enable downloads.');
    }
  });
}

document.getElementById('footerYear').textContent = new Date().getFullYear();

// Hero particle network (adjusted for orange tint)
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [], w, h;
function resizeCanvas() {
  const hero = document.getElementById('hero');
  w = canvas.width = hero.offsetWidth;
  h = canvas.height = hero.offsetHeight;
}
function initParticles() {
  const count = Math.min(60, Math.floor((w * h) / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.4 + 0.5
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255, 87, 34, 0.4)';
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.strokeStyle = `rgba(255, 87, 34, ${0.15 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}