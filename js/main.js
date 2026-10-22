document.addEventListener('DOMContentLoaded', () => {
  // Navbar: solid background after scrolling
  const nav = document.querySelector('.navbar');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Mark current page in the menu
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Hero: rotating word (edit the list below)
  const rotating = document.getElementById('rotator');
  if (rotating) {
    const words = ['websites','brands','apps','stories'];
    let i = 0;
    setInterval(() => { i = (i + 1) % words.length; rotating.textContent = words[i]; }, 2200);
  }

  // Hero: glow follows the cursor
  const hero = document.querySelector('.hero'), blob = document.querySelector('.blob');
  if (hero && blob) hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    blob.style.left = (e.clientX - r.left) + 'px';
    blob.style.top = (e.clientY - r.top) + 'px';
  });

  // Animated counters: <b data-count="120">0</b>
  const counters = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); counters.unobserve(el);
  }), {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

  // Pricing: monthly / yearly toggle
  const toggle = document.getElementById('billing');
  if (toggle) toggle.addEventListener('change', () => {
    document.querySelectorAll('.price span').forEach(s => {
      s.textContent = toggle.checked ? s.dataset.year : s.dataset.month;
    });
    document.querySelectorAll('.per').forEach(p => p.textContent = toggle.checked ? '/year' : '/month');
  });

  // Contact form: validation + success message
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    // TODO: send the data to your server / form service here
    new bootstrap.Toast(document.getElementById('toast')).show();
    form.reset(); form.classList.remove('was-validated');
  });
});
