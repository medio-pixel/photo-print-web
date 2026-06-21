/* ══════════════════════════════════════════
   MEDIO PIXEL — pixel.js
   · Animated pixel canvas background
   · Scroll reveal
   · Victory click animation
══════════════════════════════════════════ */

/* ── 1. PIXEL CANVAS BACKGROUND ── */
(function () {
  const canvas = document.getElementById('pixel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#f0c040', '#e07030', '#50c878', '#4090e0', '#e040a0'];
  const PIXEL_SIZE = 6;
  const SPEED = 0.18;
  let W, H, pixels;
  let scrollY = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    const count = Math.floor((W * H) / 14000);
    pixels = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vy:    (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
      vx:    (Math.random() * 0.2 - 0.1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.15,
      size:  PIXEL_SIZE * (Math.random() * 1.5 + 0.5),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const parallax = scrollY * 0.08;

    pixels.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.fillRect(
        Math.round(p.x / p.size) * p.size,
        Math.round(((p.y + parallax) % H) / p.size) * p.size,
        p.size, p.size
      );

      p.x += p.vx * SPEED;
      p.y += p.vy * SPEED;

      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < -p.size) p.y = H;
      if (p.y > H + p.size) p.y = 0;
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });
  resize();
  draw();
})();


/* ── 2. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();


/* ── 3. VICTORY CLICK ANIMATION ── */
(function () {
  /* Build overlay once */
  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.innerHTML = `
    <div class="victory-flash"></div>
    <div class="victory-text">★ NIVEL UP ★</div>
  `;
  document.body.appendChild(overlay);

  const COLORS  = ['#f0c040','#e07030','#50c878','#4090e0','#e040a0','#ffffff'];
  const MESSAGES = ['★ LEVEL UP ★', '► GO! ◄', '✦ LISTO ✦', '[ OK ]'];

  function spawnParticles() {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const count = 28;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'vparticle';
      const angle  = (i / count) * Math.PI * 2;
      const dist   = 80 + Math.random() * 160;
      const tx     = `translate(${Math.cos(angle) * dist + cx - 5}px, ${Math.sin(angle) * dist + cy - 5}px)`;
      p.style.cssText = `
        left: ${cx - 5}px;
        top:  ${cy - 5}px;
        background: ${COLORS[i % COLORS.length]};
        --tx: ${tx};
        animation-delay: ${Math.random() * 0.1}s;
      `;
      overlay.appendChild(p);
    }
  }

  function clearParticles() {
    overlay.querySelectorAll('.vparticle').forEach(p => p.remove());
  }

  function triggerVictory(href, isNewTab) {
    clearParticles();

    /* pick random message */
    const txt = overlay.querySelector('.victory-text');
    txt.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    /* reset animations by cloning */
    const flash = overlay.querySelector('.victory-flash');
    const freshFlash = flash.cloneNode(true);
    flash.replaceWith(freshFlash);
    const freshTxt = txt.cloneNode(true);
    txt.replaceWith(freshTxt);

    spawnParticles();
    overlay.classList.add('active');

    setTimeout(() => {
      overlay.classList.remove('active');
      clearParticles();
      if (isNewTab) {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
    }, 950);
  }

  /* Intercept all clickable cards and featured-cards */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('.card, .featured-card');
    if (!link || !link.href) return;
    e.preventDefault();
    const isNewTab = link.target === '_blank';
    triggerVictory(link.href, isNewTab);
  });
})();
