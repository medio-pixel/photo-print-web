/* ══════════════════════════════════════════
   FOTOGRAFÍA — foto.js
   · Hero slideshow
   · Navbar scroll effect
   · Filmstrip drag-scroll
   · Lightbox
   · Image protection
══════════════════════════════════════════ */

/* ── 1. HERO SLIDESHOW ── */
(function () {
    const slides = document.querySelectorAll('.fh-slide');
    if (slides.length < 2) return;
    let current = 0;
    const interval = 5000;

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, interval);
})();


/* ── 2. NAVBAR SCROLL EFFECT ── */
(function () {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
})();


/* ── 3. FILMSTRIP DRAG SCROLL ── */
(function () {
    const strips = document.querySelectorAll('.fp-strip');

    strips.forEach(strip => {
        let isDown = false;
        let startX, scrollLeft;

        strip.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - strip.offsetLeft;
            scrollLeft = strip.scrollLeft;
        });

        strip.addEventListener('mouseleave', () => { isDown = false; });
        strip.addEventListener('mouseup', ()    => { isDown = false; });

        strip.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - strip.offsetLeft;
            const walk = (x - startX) * 1.5;
            strip.scrollLeft = scrollLeft - walk;
        });
    });
})();


/* ── 4. LIGHTBOX ── */
(function () {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const lbImg     = lb.querySelector('.lb-img');
    const lbClose   = lb.querySelector('.lb-close');
    const lbPrev    = lb.querySelector('.lb-prev');
    const lbNext    = lb.querySelector('.lb-next');
    const lbCounter = lb.querySelector('.lb-counter');

    const allImgs = Array.from(document.querySelectorAll('.fp-img'));
    let current = 0;
    let isDrag = false;
    let startPos = 0;

    function getFullUrl(el) {
        const img = el.querySelector('img');
        if (!img) return '';
        return img.src.replace(/\/w_\d+,/, '/w_1600,');
    }

    function open(i) {
        current = i;
        update();
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    function update() {
        lbImg.src = getFullUrl(allImgs[current]);
        lbImg.alt = allImgs[current].querySelector('img').alt;
        lbCounter.textContent = (current + 1) + ' / ' + allImgs.length;
    }

    function next() { current = (current + 1) % allImgs.length; update(); }
    function prev() { current = (current - 1 + allImgs.length) % allImgs.length; update(); }

    // click but not drag
    allImgs.forEach((item, i) => {
        item.addEventListener('mousedown', (e) => { startPos = e.clientX; isDrag = false; });
        item.addEventListener('mousemove', (e) => {
            if (Math.abs(e.clientX - startPos) > 6) isDrag = true;
        });
        item.addEventListener('mouseup', () => {
            if (!isDrag) open(i);
        });
        item.addEventListener('click', (e) => e.preventDefault());
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
    });
})();


/* ── 5. IMAGE PROTECTION ── */
(function () {
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('.foto-img-wrap') || e.target.closest('.fh-img-wrap') || e.target.closest('.lb-img-wrap')) {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // anti-screenshot blur
    function blurAll() {
        document.querySelectorAll('.foto-img-wrap img, .fh-img-wrap img, .lb-img').forEach(img => {
            img.style.filter = 'blur(20px)';
        });
    }
    function unblurAll() {
        document.querySelectorAll('.foto-img-wrap img, .fh-img-wrap img, .lb-img').forEach(img => {
            img.style.filter = '';
        });
    }

    document.addEventListener('visibilitychange', () => {
        document.hidden ? blurAll() : unblurAll();
    });
    window.addEventListener('blur', blurAll);
    window.addEventListener('focus', unblurAll);
})();
