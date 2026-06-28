/* ══════════════════════════════════════════
   MEDIO PIXEL — image-protect.js
   Protección de imágenes contra descarga y captura
══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. DESHABILITAR CLIC DERECHO EN IMÁGENES ── */
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.foto-item, .card, .featured-card, .lightbox')) {
      e.preventDefault();
    }
  });

  /* ── 2. DESHABILITAR ARRASTRAR IMÁGENES ── */
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  /* ── 3. DESHABILITAR SELECCIÓN EN CONTENEDORES DE IMÁGENES ── */
  const protectedContainers = document.querySelectorAll(
    '.foto-item, .card, .featured-card, .lightbox, .foto-hero-bg, .split-bg'
  );

  protectedContainers.forEach(function (el) {
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
  });

  /* ── 4. CSS pointer-events: none EN IMÁGENES (overlay absorbe clics) ── */
  const style = document.createElement('style');
  style.textContent = `
    .card img,
    .featured-card img,
    .foto-item img,
    .foto-hero-bg img,
    .foto-about-img img,
    .split-bg img,
    .lightbox-img {
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
  `;
  document.head.appendChild(style);

  /* ── 5. BLOQUEAR ATAJOS DE TECLADO PARA GUARDAR/IMPRIMIR ── */
  document.addEventListener('keydown', function (e) {
    // Ctrl+S (guardar), Ctrl+P (imprimir)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
    }
  });

})();
