# Medio Pixel — Lineamientos del proyecto

## Identidad

- Marca: **Medio Pixel** (fotografía e impresiones personalizadas)
- Fotógrafa: Camila Ramirez
- Contacto principal: WhatsApp +54 9 11 6169-2631
- Dominio: definido en el archivo CNAME del repositorio

## Estilo visual

- **Minimalismo como principio rector.** Cada elemento debe justificar su presencia. Espacios en blanco generosos, jerarquía clara, sin ruido visual.
- **Animaciones innovadoras y con propósito.** Usar transiciones, micro-interacciones y efectos creativos (scroll-driven animations, view transitions, canvas/WebGL sutiles) pero siempre al servicio de la experiencia, nunca como decoración gratuita.
- Paleta oscura con acento pixel-art (amarillo `#f0c040`, naranja `#e07030`, verde `#50c878`).
- Tipografías: `Press Start 2P` para branding/headings, `Inter` para cuerpo de texto.
- Estética retro-pixel en bordes y sombras (box-shadow sólido, sin border-radius).

## Protección de imágenes

Todas las fotografías e imágenes del portfolio o catálogo **deben estar protegidas** contra descarga y captura:

1. **Deshabilitar clic derecho** sobre imágenes (`contextmenu` → `preventDefault`).
2. **Deshabilitar arrastrar** (`dragstart` → `preventDefault`).
3. **CSS `pointer-events: none`** en las imágenes dentro de un wrapper que maneje la interacción.
4. **Overlay transparente** sobre cada imagen (un `::after` o div absoluto) para que el usuario no pueda seleccionar la imagen directamente.
5. **Deshabilitar selección** (`user-select: none` y `-webkit-user-select: none`).
6. **Anti-screenshot (best effort):** aplicar `filter: blur()` o reducir opacidad cuando la ventana pierde el foco (`visibilitychange` / `blur`). Nota: esto no es 100% efectivo, pero disuade capturas casuales.
7. **No exponer la URL directa** de imágenes en alta resolución en el HTML; usar resoluciones web y, cuando sea posible, servir desde un CDN con transformaciones (ej: Cloudinary con calidad reducida para web).
8. **Metadatos de copyright** embebidos en cada imagen antes de subir.

## Estructura y código

- HTML semántico (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`).
- CSS custom properties para mantener consistencia de colores y espaciados.
- Mobile-first: diseñar para móvil primero, expandir con media queries.
- JavaScript vanilla (sin frameworks), modular y con comentarios claros.
- Lazy loading en imágenes (`loading="lazy"`).
- Accesibilidad básica: `alt` descriptivo en imágenes, contraste suficiente, navegación por teclado.

## Performance

- Imágenes optimizadas (WebP cuando sea posible, tamaño adecuado al contenedor).
- Minimizar dependencias externas.
- Priorizar Core Web Vitals (LCP, CLS, INP).

## SEO y Open Graph

- Todas las páginas deben incluir `<meta name="description">` con texto relevante al contenido.
- Incluir Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) para que los links se previsualicen correctamente en WhatsApp, Instagram y redes sociales.
- Usar `<title>` descriptivos y únicos por página.

## Lazy loading

- Todas las imágenes que no estén en el viewport inicial deben llevar `loading="lazy"`.
- Las imágenes hero o above-the-fold no llevan lazy loading (para no afectar LCP).

## HTML semántico obligatorio

- Toda página debe envolver su contenido principal en `<main>`.
- Usar `<header>` para la barra de navegación.
- Usar `<section>` con encabezados descriptivos para cada bloque de contenido.
- Usar `<article>` para items individuales de catálogo si aplica.
- Usar `<footer>` para el pie de página.

## Convenciones de archivos

- CSS separado por responsabilidad (`styles.css` general, `split.css` para landing split, `foto.css` para sección fotografía).
- Imágenes en `/img`.
- Scripts en la raíz o en `/js` si crecen.
