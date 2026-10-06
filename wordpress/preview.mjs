/* ============================================================================
   SIREVE · CSUCA — armador de un sitio de prueba para verificar los fragmentos
   ----------------------------------------------------------------------------
   Uso:  node wordpress/preview.mjs

   Toma los 13 fragmentos de wordpress/*.html y los convierte en un sitio de
   prueba completo (wordpress/.preview/) replicando EXACTAMENTE las rutas de
   WordPress, para poder abrirlo en el navegador:

     /                      -> inicio.html
     /actas/                -> actas.html
     /galeria/              -> galeria.html
     /galeria/2017/         -> galeria-2017.html
     ...
     /programas/ficcua/     -> programa-ficcua.html

   Cada pagina incluye sireve.css y sireve.js como lo haria el tema. Es solo
   para revisar; en WordPress no se usa.
   ============================================================================ */

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '.preview');

/* canonical -> archivo fuente */
const ROUTES = {
  '/': 'inicio.html',
  '/actas/': 'actas.html',
  '/galeria/': 'galeria.html',
  '/galeria/2017/': 'galeria-2017.html',
  '/galeria/2018/': 'galeria-2018.html',
  '/galeria/2019/': 'galeria-2019.html',
  '/galeria/2020/': 'galeria-2020.html',
  '/galeria/2023/': 'galeria-2023.html',
  '/galeria/2024/': 'galeria-2024.html',
  '/galeria/2025/': 'galeria-2025.html',
  '/reglamentos/': 'reglamentos.html',
  '/contacto/': 'contacto.html',
  '/programas/ficcua/': 'programa-ficcua.html',
  '/programas/juduca/': 'programa-juduca.html',
  '/programas/premio-ruben-dario/': 'programa-premio-ruben-dario.html',
  '/programas/promotoras-salud/': 'programa-promotoras-salud.html',
  '/programas/voluntariado/': 'programa-voluntariado.html',
};

const PAGE = (route, title, body) => `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · SIREVE</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/sireve.css">
</head>
<body>
${body}
  <script src="/assets/sireve.js" defer></script>
</body>
</html>
`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(path.join(OUT, 'assets'), { recursive: true });

cpSync(path.join(HERE, 'sireve.css'), path.join(OUT, 'assets', 'sireve.css'));
cpSync(path.join(HERE, 'sireve.js'), path.join(OUT, 'assets', 'sireve.js'));

const titles = [];
for (const [route, file] of Object.entries(ROUTES)) {
  const raw = readFileSync(path.join(HERE, file), 'utf8');
  /* se quita el comentario de cabecera que agrega el generador */
  /* Las fotos del tema se piden a https://sireve.csuca.org/.../sireve-theme/
     (aun no subido). En el preview se rebajan a ruta relativa para que las
     sirva el servidor local y la verificacion mide los bytes reales. */
  const body = raw
    .replace(/^<!--[\s\S]*?-->\n/, '')
    .replaceAll(
      'https://sireve.csuca.org/wp-content/themes/sireve-theme/assets/',
      '/wp-content/themes/sireve-theme/assets/',
    );

  const titleMatch = /<h1 class="page-hero-title">([^<]+)<\/h1>/.exec(body);
  const title = titleMatch ? titleMatch[1] : 'Portada';

  const target = path.join(OUT, route, 'index.html');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, PAGE(route, title, body), 'utf8');
  titles.push(`${route.padEnd(32)} ${file}`);
}

console.log(`Sitio de prueba generado en ${OUT}`);
for (const t of titles) console.log('  ' + t);

/* ---------------------------------------------------------------------------
   Sonda de verificacion. Chrome headless la abre con --dump-dom y el JSON que
   escribe en <pre id="report"> es lo que se revisa: comprueba que sireve.js
   corrio de verdad (dropdowns cerrados, enlace activo, lightbox, carrusel) y
   que no hay desbordamiento horizontal.
   --------------------------------------------------------------------------- */
writeFileSync(
  path.join(OUT, 'probe.html'),
  `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>probe</title>
<style>html,body{margin:0}iframe{width:1280px;height:900px;border:0}pre{font:12px monospace;white-space:pre-wrap}</style>
</head>
<body>
<iframe id="f"></iframe>
<pre id="report">pending</pre>
<script>
const params = new URLSearchParams(location.search);
const route = params.get('route') || '/';
const width = Number(params.get('w') || 1280);
const f = document.getElementById('f');

const report = {};
const done = (r) => { document.getElementById('report').textContent = JSON.stringify(r, null, 1); };

f.style.width = width + 'px';
f.style.height = Math.max(900, Math.round(width * 0.7)) + 'px';

f.addEventListener('load', async () => {
  const w = f.contentWindow, d = f.contentDocument;
  await w.document.fonts.ready;
  await new Promise((r) => setTimeout(r, 900));

  const $ = (s) => d.querySelectorAll(s);
  const active = $$('.active').length;
  function $$(s) { return Array.from(d.querySelectorAll(s)); }

  report.route = route;
  report.viewport = width;
  report.overflowX = d.documentElement.scrollWidth - d.documentElement.clientWidth;
  report.bodyOverflowX = d.body.scrollWidth - d.body.clientWidth;

  const nav = $('.header-nav')[0];
  report.header = !!nav;
  report.footer = !!$('.footer-container')[0];
  report.logoCargada = !!($('.header-logo-img')[0] && $('.header-logo-img')[0].naturalWidth > 0);
  report.logoAlt = $('.header-logo-img')[0] ? $('.header-logo-img')[0].naturalWidth : -1;

  /* el texto de marca solo existe a partir de 1300px */
  const brandText = $('.header-brand-text')[0];
  report.brandTextVisible = brandText ? w.getComputedStyle(brandText).display !== 'none' : false;

  /* dropdowns arrancan cerrados */
  report.dropdowns = $$('.header-dropdown-menu').map((m) => m.hidden === true);
  report.dropdownToggles = $$('.header-dropdown-toggle').length;

  /* enlace de navegacion activo */
  report.navActivo = $$('[data-nav].active').map((a) => a.getAttribute('data-nav'));
  report.navItems = $$('[data-nav]').map((a) => a.getAttribute('data-nav'));

  /* ano del footer injectado por JS */
  report.anoFooter = ($('[data-year]')[0] || {}).textContent;

  /* tipografia */
  report.montserrat = d.fonts.check('600 13px Montserrat');

  /* imagenes rotas */
  const imgs = $$('img');
  report.imgs = imgs.length;
  report.imgsRotas = imgs.filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => (i.currentSrc || i.src).slice(-42));
  report.widgetkit = imgs.filter((i) => (i.currentSrc || i.src).includes('/cache/widgetkit/')).length;

  /* iconos svg */
  report.svg = $$('svg').length;

  /* lightbox */
  const lb = $('.gallery-lightbox')[0];
  report.lightbox = lb ? { hidden: lb.hidden, title: !!$('.gallery-lightbox-title')[0] } : null;

  /* albums de galeria */
  report.albums = $$('.gallery-album').length;
  const primerAlbum = $('.gallery-album')[0];
  if (primerAlbum) {
    let n = -1;
    try { n = JSON.parse(primerAlbum.getAttribute('data-images')).length; } catch (e) { n = -2; }
    report.primerAlbum = {
      fotos: n,
      contador: ($('.gallery-album-counter', primerAlbum) || {}).textContent,
      dots: primerAlbum.querySelectorAll('.gallery-album-dot').length,
      primerSrc: (($('.gallery-album-img-btn img', primerAlbum) || {}).src || '').slice(-24),
    };
  }

  /* landing: carrusel y reveal */
  const slides = $$('.carousel-slide');
  if (slides.length) {
    report.carrusel = {
      slides: slides.length,
      activo: slides.findIndex((s) => s.classList.contains('active')),
      dots: $$('.carousel-dot').length,
    };
  }
  const fade = $$('.fade-section');
  if (fade.length) {
    w.scrollTo(0, d.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 700));
    w.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
    report.reveal = {
      secciones: fade.length,
      visibles: fade.filter((s) => s.classList.contains('visible')).length,
      revealReady: $('.sireve')[0].classList.contains('reveal-ready'),
    };
  }

  /* contacto */
  const form = $('.contacto-form')[0];
  report.formulario = form ? { tag: form.tagName, campos: form.querySelectorAll('input,textarea').length } : null;

  /* programas */
  const otros = $$('.program-other-card');
  if (otros.length) report.programas = { otros: otros.length, edicionesVacias: !!$('.program-editions-empty')[0] };
  report.metaChips = $$('.program-meta-item').length;

  /* timeline */
  report.timeline = { vacio: !!$('.timeline-empty')[0], items: $$('.timeline-item').length, tarjetasAnio: $$('.galeria-year-card').length };

  done(report);
});

f.src = route;
</script>
</body>
</html>
`,
  'utf8',
);

console.log('  + probe.html (sonda de verificacion)');
