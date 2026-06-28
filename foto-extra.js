/* ══════════════════════════════════════════
   FOTOGRAFÍA — funciones interactivas
   · Antes/después slider
   · Test de estilo
   · WhatsApp contextual
══════════════════════════════════════════ */

/* ── 1. ANTES / DESPUÉS SLIDER ── */
(function () {
    const slider = document.getElementById('baSlider');
    if (!slider) return;

    const after  = slider.querySelector('.fba-after');
    const handle = document.getElementById('baHandle');
    let dragging = false;

    function setPos(x) {
        const rect = slider.getBoundingClientRect();
        let pct = (x - rect.left) / rect.width;
        pct = Math.min(Math.max(pct, 0.02), 0.98);
        const pctVal = pct * 100;
        after.style.clipPath = `inset(0 ${100 - pctVal}% 0 0)`;
        handle.style.left = pctVal + '%';
    }

    // init at 50%
    setPos(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width / 2);

    slider.addEventListener('mousedown', (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup',   ()  => { dragging = false; });

    slider.addEventListener('touchstart', (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove',  (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',   ()  => { dragging = false; });
})();


/* ── 2. TEST DE ESTILO ── */
(function () {
    const steps  = document.querySelectorAll('.fts-step');
    const dots   = document.querySelectorAll('.fts-dot');
    if (!steps.length) return;

    const answers = {};
    let currentStep = 1;

    // Fotos por categoría (subsets de las que están en la galería)
    const photos = {
        concierto: [
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC05208s_vf4wji.jpg',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC05096_btpvnh.jpg',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC04937_g9rs9b.jpg',
        ],
        casamiento: [
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/6_aucsuv.png',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/9_r5xkuz.png',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/12_ftnxid.png',
        ],
        evento: [
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC02901_ewgxgh.jpg',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC02936_zcrcyd.jpg',
            'https://res.cloudinary.com/dkpachrss/image/upload/w_400,q_auto,f_auto/DSC03044_uep83w.jpg',
        ],
    };

    const waMessages = {
        concierto: 'Hola%20Camila%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20contratarte%20para%20fotografiar%20un%20concierto.',
        casamiento: 'Hola%20Camila%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20contratarte%20para%20fotografiar%20mi%20casamiento.',
        evento:    'Hola%20Camila%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20contratarte%20para%20fotografiar%20un%20evento.',
    };

    function showStep(n) {
        steps.forEach(s => s.classList.remove('active'));
        const target = document.querySelector(`.fts-step[data-step="${n}"]`);
        if (target) target.classList.add('active');

        dots.forEach(d => {
            d.classList.toggle('active', parseInt(d.dataset.dot) <= n && n < 4);
        });
    }

    function showResult() {
        const ocasion = answers.ocasion || 'concierto';
        const imgs = photos[ocasion] || photos.concierto;
        const grid = document.getElementById('tsResultGrid');

        grid.innerHTML = imgs.map(url =>
            `<div class="foto-img-wrap">
                <img src="${url}" alt="Trabajo similar" loading="lazy">
            </div>`
        ).join('');

        const waBtn = document.getElementById('tsWaBtn');
        if (waBtn) {
            waBtn.href = `https://wa.me/5491161692631?text=${waMessages[ocasion] || waMessages.evento}`;
        }

        showStep(4);
    }

    document.querySelectorAll('.fts-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const val = btn.dataset.val;
            answers[key] = val;

            currentStep++;
            if (currentStep > 3) {
                showResult();
            } else {
                showStep(currentStep);
            }
        });
    });

    document.getElementById('tsReset')?.addEventListener('click', () => {
        Object.keys(answers).forEach(k => delete answers[k]);
        currentStep = 1;
        showStep(1);
    });
})();


/* ── 3. WHATSAPP CONTEXTUAL por categoría ── */
(function () {
    const messages = {
        concierto: 'Hola%20Camila%2C%20vi%20tus%20fotos%20de%20conciertos%20y%20me%20gustar%C3%ADa%20contratarte.',
        casamiento: 'Hola%20Camila%2C%20vi%20tus%20fotos%20de%20casamiento%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20mi%20boda.',
        evento: 'Hola%20Camila%2C%20vi%20tus%20fotos%20de%20eventos%20y%20me%20gustar%C3%ADa%20contratarte.',
    };

    document.querySelectorAll('.fp-section').forEach(section => {
        const title = section.querySelector('.fp-title')?.textContent?.toLowerCase() || '';
        let key = 'evento';
        if (title.includes('concierto')) key = 'concierto';
        else if (title.includes('casamiento')) key = 'casamiento';

        const strip = section.querySelector('.fp-strip');
        if (!strip) return;

        const waBar = document.createElement('div');
        waBar.className = 'fp-wa-bar';
        waBar.innerHTML = `<a href="https://wa.me/5491161692631?text=${messages[key]}" target="_blank" class="fp-wa-link">📲 Quiero sesión de ${title} →</a>`;
        section.appendChild(waBar);
    });
})();
