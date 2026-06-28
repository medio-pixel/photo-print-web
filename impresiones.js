/* ══════════════════════════════════════════
   IMPRESIONES — funciones interactivas
   · Calculadora de precios
   · Detector de calidad + recorte
   · Comparador de papeles
   · Contadores animados
══════════════════════════════════════════ */

/* ── 1. CALCULADORA ── */
(function () {
    // Precios base por tamaño (en pesos, ejemplo)
    const precios = {
        '10x15': { brillante: 400,  mate: 450,  satinado: 480,  fineart: 700  },
        '13x18': { brillante: 600,  mate: 680,  satinado: 720,  fineart: 1100 },
        '15x21': { brillante: 800,  mate: 900,  satinado: 950,  fineart: 1400 },
        '20x30': { brillante: 1200, mate: 1350, satinado: 1400, fineart: 2200 },
        '30x40': { brillante: 2200, mate: 2500, satinado: 2600, fineart: 4000 },
        '30x45': { brillante: 2600, mate: 2900, satinado: 3000, fineart: 4500 },
    };

    // Packs sugeridos
    const packs = [
        { minCant: 10,  minTotal: 10000, msg: '💡 Con 10 fotos o más: consultá por el pack fotográfico con descuento.' },
        { minCant: 20,  minTotal: 20000, msg: '📦 Por $4.000 más agregá un fotolibro al pedido.' },
        { minCant: 50,  minTotal: 40000, msg: '⭐ Pedido grande: contactanos para precio especial.' },
    ];

    let tamano = '10x15';
    let papel  = 'brillante';
    let cant   = 1;

    function getPrice() {
        return precios[tamano]?.[papel] || 400;
    }

    function update() {
        const unit  = getPrice();
        const total = unit * cant;

        document.getElementById('calcPrecioUnit').textContent  = '$' + unit.toLocaleString('es-AR');
        document.getElementById('calcPrecioTotal').textContent = '$' + total.toLocaleString('es-AR');
        document.getElementById('calcCantNum').textContent     = cant;

        // pack sugerido
        const ps = document.getElementById('calcPackSugerido');
        let msg = '';
        for (const p of packs) {
            if (cant >= p.minCant || total >= p.minTotal) msg = p.msg;
        }
        ps.textContent = msg;
        ps.classList.toggle('visible', !!msg);

        // WhatsApp link
        const txt = `Hola%2C%20quiero%20pedir%20${cant}%20foto${cant > 1 ? 's' : ''}%20en%20tama%C3%B1o%20${tamano}%2C%20papel%20${papel}.%20Total%3A%20%24${total.toLocaleString('es-AR')}`;
        document.getElementById('calcWaBtn').href = `https://wa.me/5491161692631?text=${txt}`;
    }

    // tamaño
    document.getElementById('calcTamano')?.querySelectorAll('.imp-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#calcTamano .imp-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tamano = btn.dataset.tamano;
            update();
        });
    });

    // papel
    document.getElementById('calcPapel')?.querySelectorAll('.imp-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#calcPapel .imp-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            papel = btn.dataset.papel;
            update();
        });
    });

    // cantidad
    document.getElementById('calcCant')?.addEventListener('input', function () {
        cant = parseInt(this.value);
        update();
    });

    update();
})();


/* ── 2. UPLOAD: DETECTOR DE CALIDAD + RECORTE ── */
(function () {
    const drop      = document.getElementById('impDrop');
    const fileInput = document.getElementById('impFile');
    const fileList  = document.getElementById('impFileList');
    const analysis  = document.getElementById('impAnalysis');
    const quality   = document.getElementById('impQuality');
    const cropSizes = document.getElementById('impCropSizes');
    const canvas    = document.getElementById('impCanvas');
    if (!drop || !canvas) return;

    const ctx = canvas.getContext('2d');

    const SIZES = [
        { label: '10×15', w: 10, h: 15 },
        { label: '13×18', w: 13, h: 18 },
        { label: '15×21', w: 15, h: 21 },
        { label: '20×30', w: 20, h: 30 },
        { label: '30×40', w: 30, h: 40 },
    ];

    let currentImg   = null;
    let currentSize  = SIZES[0];
    let loadedFiles  = [];
    let seenHashes   = new Set();

    // drag over
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', ()  => drop.classList.remove('dragover'));
    drop.addEventListener('drop', (e) => {
        e.preventDefault();
        drop.classList.remove('dragover');
        handleFiles(Array.from(e.dataTransfer.files));
    });

    fileInput.addEventListener('change', () => handleFiles(Array.from(fileInput.files)));

    function simpleHash(file) {
        return `${file.name}_${file.size}_${file.lastModified}`;
    }

    function getQualityInfo(w, h) {
        const maxW = Math.max(w, h);
        if (maxW >= 3600) return { cls: 'green',  text: '🟢 Excelente — imprimible hasta 60×90 cm' };
        if (maxW >= 2400) return { cls: 'green',  text: '🟢 Muy buena — imprimible hasta 40×60 cm' };
        if (maxW >= 1800) return { cls: 'yellow', text: '🟡 Buena — recomendado hasta 30×45 cm' };
        if (maxW >= 1200) return { cls: 'yellow', text: '🟡 Aceptable — recomendado hasta 20×30 cm' };
        return { cls: 'red',    text: '🔴 Baja resolución — puede verse pixelada en grande' };
    }

    function handleFiles(files) {
        // filtrar no-imágenes
        const imgs = files.filter(f => f.type.startsWith('image/'));
        if (!imgs.length) return;

        let firstNew = null;

        imgs.forEach(file => {
            const hash = simpleHash(file);
            const isDup = seenHashes.has(hash);

            if (!isDup) {
                seenHashes.add(hash);
                loadedFiles.push(file);
                if (!firstNew) firstNew = file;
            }

            // agregar a lista
            const item = document.createElement('div');
            item.className = 'imp-file-item';
            item.innerHTML = `
                <span>${file.name.slice(0, 30)}${file.name.length > 30 ? '…' : ''}</span>
                <span class="imp-file-status ${isDup ? 'dup' : ''}">${isDup ? '⚠ Duplicado' : '...'}</span>
            `;
            fileList.appendChild(item);

            if (!isDup) {
                // leer dimensiones
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const q = getQualityInfo(img.width, img.height);
                        item.querySelector('.imp-file-status').className = `imp-file-status ${q.cls}`;
                        item.querySelector('.imp-file-status').textContent = q.text.split('—')[0].trim();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // mostrar análisis de la primera foto nueva
        if (firstNew) loadAnalysis(firstNew);
    }

    function loadAnalysis(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentImg = img;
                const q = getQualityInfo(img.width, img.height);
                quality.className = `imp-quality-badge ${q.cls}`;
                quality.innerHTML = `${q.text}<br><small>${img.width}×${img.height} px</small>`;
                analysis.style.display = 'block';
                buildCropButtons();
                drawCrop();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function buildCropButtons() {
        cropSizes.innerHTML = '';
        SIZES.forEach((sz, i) => {
            const btn = document.createElement('button');
            btn.className = 'imp-crop-btn' + (i === 0 ? ' active' : '');
            btn.textContent = sz.label;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.imp-crop-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSize = sz;
                drawCrop();
            });
            cropSizes.appendChild(btn);
        });
    }

    function drawCrop() {
        if (!currentImg || !currentSize) return;

        const CANVAS_W = 460;
        const CANVAS_H = 320;
        canvas.width  = CANVAS_W;
        canvas.height = CANVAS_H;

        const imgW = currentImg.width;
        const imgH = currentImg.height;
        const imgRatio  = imgW / imgH;
        const sizeRatio = currentSize.w / currentSize.h;

        // fit imagen en canvas
        let drawW, drawH;
        if (imgRatio > CANVAS_W / CANVAS_H) {
            drawW = CANVAS_W; drawH = CANVAS_W / imgRatio;
        } else {
            drawH = CANVAS_H; drawW = CANVAS_H * imgRatio;
        }
        const offX = (CANVAS_W - drawW) / 2;
        const offY = (CANVAS_H - drawH) / 2;

        // área de recorte en coordenadas del canvas
        let cropW, cropH;
        if (sizeRatio > imgRatio) {
            cropW = drawW; cropH = drawW / sizeRatio;
        } else {
            cropH = drawH; cropW = drawH * sizeRatio;
        }
        const cropX = offX + (drawW - cropW) / 2;
        const cropY = offY + (drawH - cropH) / 2;

        // dibujar imagen
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.drawImage(currentImg, offX, offY, drawW, drawH);

        // oscurecer zona recortada
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(offX, offY, drawW, drawH);
        ctx.clearRect(cropX, cropY, cropW, cropH);
        ctx.drawImage(currentImg,
            (imgW - (cropW / drawW) * imgW) / 2, (imgH - (cropH / drawH) * imgH) / 2,
            (cropW / drawW) * imgW, (cropH / drawH) * imgH,
            cropX, cropY, cropW, cropH
        );

        // borde del recorte
        ctx.strokeStyle = '#f0c040';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX, cropY, cropW, cropH);

        // etiqueta
        ctx.fillStyle = '#f0c040';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(`${currentSize.label} cm`, cropX + 4, cropY + 14);
    }
})();


/* ── 3. COMPARADOR DE PAPELES ── */
(function () {
    const tabs    = document.querySelectorAll('.imp-paper-tab');
    const img     = document.getElementById('paperImg');
    const imgWrap = document.getElementById('paperImgWrap');
    const zoom    = document.getElementById('paperZoom');
    const name    = document.getElementById('paperName');
    const desc    = document.getElementById('paperDesc');
    const pros    = document.getElementById('paperPros');
    if (!tabs.length) return;

    const papers = {
        brillante: {
            name: 'Brillante',
            desc: 'Acabado clásico con brillo intenso. Colores vivos y profundos. Ideal para retratos, eventos y regalos.',
            pros: ['✓ Colores más intensos', '✓ Negros profundos', '✓ El más económico', '— Puede reflejar luz'],
            img: 'img/combo1.jpeg',
        },
        mate: {
            name: 'Mate',
            desc: 'Sin reflejo. Aspecto suave y natural, ideal para colgar en paredes con mucha luz o para textos.',
            pros: ['✓ Sin reflejos', '✓ Ideal para marcos', '✓ Aspecto artístico', '— Colores levemente menos saturados'],
            img: 'img/combo5.jpeg',
        },
        satinado: {
            name: 'Satinado',
            desc: 'Lo mejor de los dos mundos: colores intensos sin el reflejo del brillante. Muy popular en bodas.',
            pros: ['✓ Colores vibrantes', '✓ Poca reflexión', '✓ Tacto suave', '✓ Ideal para casamientos'],
            img: 'img/combo8.jpg',
        },
        fineart: {
            name: 'Fine Art',
            desc: 'Papel de algodón de alta gramatura. Resultados de galería de arte. Para quien quiere lo mejor.',
            pros: ['✓ Calidad museum', '✓ Durabilidad extrema', '✓ Textura visible', '— El más costoso'],
            img: 'img/combo7.jpg',
        },
    };

    function setPaper(key) {
        const p = papers[key];
        if (!p) return;
        name.textContent = p.name;
        desc.textContent = p.desc;
        pros.innerHTML = p.pros.map(t => `<li>${t}</li>`).join('');
        img.src = p.img;
        img.alt = `Muestra papel ${p.name}`;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            setPaper(tab.dataset.paper);
        });
    });

    // zoom efecto lupa
    if (imgWrap && zoom) {
        imgWrap.addEventListener('mousemove', (e) => {
            const rect = imgWrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const pctX = (x / rect.width)  * 100;
            const pctY = (y / rect.height) * 100;

            zoom.style.display = 'block';
            zoom.style.backgroundImage = `url(${img.src})`;
            zoom.style.backgroundSize  = `${rect.width * 3}px ${rect.height * 3}px`;
            zoom.style.backgroundPosition = `-${x * 3 - 100}px -${y * 3 - 100}px`;
            zoom.style.top  = Math.min(y - 100, rect.height - 210) + 'px';
            zoom.style.left = Math.max(0, Math.min(x + 10, rect.width - 210)) + 'px';
        });
        imgWrap.addEventListener('mouseleave', () => { zoom.style.display = 'none'; });
    }
})();


/* ── 4. CONTADORES ANIMADOS ── */
(function () {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current.toLocaleString('es-AR') + '+';
                if (current >= target) clearInterval(timer);
            }, 25);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
})();
