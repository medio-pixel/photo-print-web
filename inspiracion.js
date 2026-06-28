/* ══════════════════════════════════════════
   INSPIRACIÓN — interacciones
   · Stagger reveal
   · Filtros animados
   · Lightbox con info
   · Magnetic hover
   · Micro-parallax
   · Image protection
══════════════════════════════════════════ */

/* ── 1. STAGGER REVEAL ── */
(function () {
    const cards = document.querySelectorAll('.insp-card');
    if (!cards.length) return;

    const io = new IntersectionObserver((entries) => {
        let delay = 0;
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            setTimeout(() => card.classList.add('insp-visible'), delay);
            delay += 55;
            io.unobserve(card);
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => io.observe(card));
})();


/* ── 2. FILTROS ── */
(function () {
    const filters = document.querySelectorAll('.insp-filter');
    const cards   = document.querySelectorAll('.insp-card');
    if (!filters.length) return;

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach((card, i) => {
                const cats = (card.dataset.cat || '').split(' ');
                const show = filter === 'all' || cats.includes(filter);

                if (show) {
                    card.classList.remove('hidden');
                    card.classList.remove('insp-visible');
                    card.style.transitionDelay = (i % 8) * 45 + 'ms';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        card.classList.add('insp-visible');
                    }));
                } else {
                    card.style.transitionDelay = '0ms';
                    card.classList.add('hidden');
                }
            });
        });
    });
})();


/* ── 3. LIGHTBOX ── */
(function () {
    const lb      = document.getElementById('inspLb');
    const lbBg    = document.getElementById('inspLbBg');
    const lbClose = document.getElementById('inspLbClose');
    const lbPrev  = document.getElementById('inspLbPrev');
    const lbNext  = document.getElementById('inspLbNext');
    const lbImg   = document.getElementById('inspLbImg');
    const lbBadge = document.getElementById('inspLbBadge');
    const lbTitle = document.getElementById('inspLbTitle');
    const lbDesc  = document.getElementById('inspLbDesc');
    const lbCta   = document.getElementById('inspLbCta');
    if (!lb) return;

    const cards = Array.from(document.querySelectorAll('.insp-card'));
    let current = 0;

    function getData(card) {
        const img  = card.querySelector('.insp-img img');
        const badge = card.querySelector('.insp-badge');
        const title = card.querySelector('h3');
        const desc  = card.querySelector('p');
        const cta   = card.querySelector('.insp-cta');
        return {
            src:     img    ? img.src.replace(/\/w_\d+,/, '/w_1200,') : '',
            badge:   badge  ? badge.textContent : '',
            title:   title  ? title.textContent : '',
            desc:    desc   ? desc.textContent  : '',
            ctaHref: cta    ? cta.href          : '#',
            ctaText: cta    ? cta.textContent   : 'Ver →',
        };
    }

    function open(index) {
        current = index;
        render();
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    function render() {
        const d = getData(cards[current]);
        lbImg.src           = d.src;
        lbBadge.textContent = d.badge;
        lbTitle.textContent = d.title;
        lbDesc.textContent  = d.desc;
        lbCta.href          = d.ctaHref;
        lbCta.textContent   = d.ctaText;
    }

    function nextVisible(dir) {
        let idx = current;
        for (let i = 0; i < cards.length; i++) {
            idx = (idx + dir + cards.length) % cards.length;
            if (!cards[idx].classList.contains('hidden')) return idx;
        }
        return current;
    }

    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.insp-cta')) return;
            open(i);
        });
    });

    lbClose.addEventListener('click', close);
    lbBg.addEventListener('click', close);
    lbPrev.addEventListener('click', () => { current = nextVisible(-1); render(); });
    lbNext.addEventListener('click', () => { current = nextVisible(1);  render(); });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  { current = nextVisible(-1); render(); }
        if (e.key === 'ArrowRight') { current = nextVisible(1);  render(); }
    });
})();


/* ── 4. MAGNETIC HOVER ── */
(function () {
    document.querySelectorAll('.insp-cta, .insp-cta-wa').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
            const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();


/* ── 5. MICRO-PARALLAX ── */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = document.querySelectorAll('.insp-card');

    function onScroll() {
        const viewH = window.innerHeight;
        cards.forEach(card => {
            if (card.classList.contains('hidden')) return;
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > viewH) return;
            const progress = 1 - (rect.top + rect.height / 2) / viewH;
            const shift = (progress - 0.5) * 18;
            const img = card.querySelector('.insp-img img');
            if (img) img.style.transform = `scale(1.05) translateY(${shift}px)`;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ── 6. IMAGE PROTECTION ── */
(function () {
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
})();
