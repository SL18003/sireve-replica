/* ============================================================================
   SIREVE â€” contraste de CAJAS entre la replica React y los fragmentos estaticos
   ----------------------------------------------------------------------------
   Uso:  node wordpress/box-diff.mjs [ancho]     (por defecto 1280)

   Mide el rectangulo (ancho/alto) de un inventario de elementos en las 13 rutas,
   en los dos origenes, y reporta las diferencias de mas de 1px. Es la forma
   barata de detectar que un borde de 1px de mas, un padding o un line-height
   falsehood desalineen la maquina: el diff de CSS no ve la cascada resuelta.
   ============================================================================ */

import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TMP = process.env.TEMP || 'C:\\Users\\INTEL\\AppData\\Local\\Temp';

/* Chrome puede seguir con el perfil abierto al salir y en Windows eso produce
   EPERM; se reintenta y si aun así falla se ignora (ver interact.mjs). */
function cleanProfile(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* perfil sobrante */
  }
}
const WIDTH = Number(process.argv[2] || 1280);
/* Filtro opcional de ruta (3.er argumento) para iterar sin medir las 13. */
const ONLY = process.argv[3] || '';

/* ruta de WordPress -> ruta estatica del preview y ruta de React.
   `static` es la URL COMPLETA del preview: la portada vive en `/`, no en
   `/index.html/`. */
const ROUTES = [
  { name: 'inicio', react: '/', static: '/' },
  { name: 'actas', react: '/actas/', static: '/actas/' },
  { name: 'galeria', react: '/galeria/', static: '/galeria/' },
  { name: 'galeria-2017', react: '/galeria/2017/', static: '/galeria/2017/' },
  { name: 'galeria-2018', react: '/galeria/2018/', static: '/galeria/2018/' },
  { name: 'galeria-2019', react: '/galeria/2019/', static: '/galeria/2019/' },
  { name: 'reglamentos', react: '/reglamentos/', static: '/reglamentos/' },
  { name: 'contacto', react: '/contacto/', static: '/contacto/' },
  { name: 'ficcua', react: '/programas/ficcua/', static: '/programas/ficcua/' },
  { name: 'juduca', react: '/programas/juduca/', static: '/programas/juduca/' },
  { name: 'ruben-dario', react: '/programas/premio-ruben-dario/', static: '/programas/premio-ruben-dario/' },
  { name: 'salud', react: '/programas/promotoras-salud/', static: '/programas/promotoras-salud/' },
  { name: 'voluntariado', react: '/programas/voluntariado/', static: '/programas/voluntariado/' },
];

/* Inventario: bloques de layout, tarjetas, botones y textos con tamano fijo.
   Se listan varias ocurrencias del mismo selector con :nth-of-type para que una
   diferencia en la 3.Âª tarjeta no quede tapada por las dos primeras. */
const SELECTORS = [
  '.site-header', '.header-inner', '.header-brand', '.header-brand-logo',
  '.header-nav', '.header-link', '.header-social', '.social-links-item',
  '.site-footer', '.footer-container', '.footer-content', '.footer-col',
  '.footer-brand-row', '.footer-links', '.footer-bottom', '.footer-copy',
  '.footer-col-title', '.footer-text', '.footer-csuca', '.footer-link-inline',
  '.footer-social', '.footer-logo-img',
  '.page-wrap', '.page-hero', '.page-hero-icon', '.page-hero-title',
  '.page-hero-sub', '.page-body', '.section-header', '.section-title',
  '.section-desc', '.btn-ver',
  '.landing-hero', '.landing-hero-h1', '.landing-hero-logo-plate',
  '.landing-hero-sub', '.landing-hero-stats', '.landing-hero-stat',
  '.landing-hero-stat-value', '.landing-hero-stat-label', '.landing-hero-actions',
  '.landing-btn', '.sireve-section', '.sireve-title', '.sireve-rule',
  '.quick-section', '.quick-grid', '.quick-card', '.quick-card-image',
  '.quick-card-body', '.carousel-container', '.carousel-slide', '.carousel-btn',
  '.programs-section', '.programs-grid', '.program-card', '.program-card-image',
  '.program-card-body', '.program-card-label', '.program-card-title',
  '.program-card-text', '.program-card-cta',
  '.actas-grid', '.actas-card', '.actas-card-header', '.actas-card-icon-wrap',
  '.actas-card-title', '.actas-card-desc', '.actas-card-btn',
  '.reglamentos-list', '.reglamentos-item', '.reglamentos-item-title',
  '.reglamentos-item-btn', '.reglamentos-item-text',
  '.galeria-sections', '.galeria-years', '.galeria-year-card',
  '.galeria-year-title', '.galeria-year-count', '.galeria-albums',
  '.gallery-album', '.gallery-album-carousel', '.gallery-album-body',
  '.gallery-album-title', '.gallery-album-meta', '.gallery-album-count',
  '.gallery-album-btn', '.gallery-album-dots',
  '.galeria-timeline', '.timeline-term', '.timeline-chip',
  '.program-meta', '.program-meta-item', '.program-meta-label',
  '.program-meta-value', '.program-heading', '.program-about', '.program-about-text',
  '.program-about-figure', '.program-editions', '.program-editions-empty',
  '.program-editions-empty-icon', '.program-editions-empty-title',
  '.program-editions-empty-text',
  '.program-other-grid', '.program-other-card', '.program-other-title',
  '.program-other-sub', '.program-back',
  '.contacto-layout', '.contacto-form', '.contacto-field', '.contacto-label',
  '.contacto-input', '.contacto-textarea', '.contacto-btn', '.contacto-info',
  '.contacto-info-heading', '.contacto-info-label', '.contacto-info-value',
  '.contacto-info-link',
];

const probe = `<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body>
/* Altura de ventana realista (900px): los bloques usan 100vh, asi que un iframe
   enorme Falsearia las alturas. El ancho se normaliza con el clientWidth real
   porque con contenido largo aparece la barra de desplazamiento y el viewport
   del iframe queda 15px mas estrecho que el nominal. */
<iframe id="f" style="width:${WIDTH}px;height:900px;border:0"></iframe><pre id="o">pending</pre>
<script>
const q = new URLSearchParams(location.search);
const sels = JSON.parse(q.get('sel') || '[]');
const nth = JSON.parse(q.get('nth') || '{}');
const f = document.getElementById('f');
f.addEventListener('load', async () => {
  const w = f.contentWindow, d = f.contentDocument;
  /* el body del host tiene margen 8px por defecto de Chrome y el preview
     estatico lo pone a 0: se anota a los dos lados para comparar igual */
  d.documentElement.style.margin = '0';
  d.body.style.margin = '0';
  /* La barra de desplazamiento hace que el clientWidth del iframe sea 15px
     menor, y como no todas las paginas la tienen (segun su altura) el contraste
     sale descentrado. Se oculta en los dos lados para comparar sobre el mismo
     ancho de viewport. */
  const s = d.createElement('style');
  s.textContent = 'html{scrollbar-width:none}::-webkit-scrollbar{width:0;height:0}';
  d.head.appendChild(s);
  try { await w.document.fonts.ready; } catch (e) {}
  await new Promise((r) => setTimeout(r, 900));
  const out = [];
  const vw = d.documentElement.clientWidth || ${WIDTH};
  const k = ${WIDTH} / vw;
  for (const s of sels) {
    const list = [...d.querySelectorAll(s)];
    if (!list.length) { out.push(s + '\\tAUSENTE'); continue; }
    /* hasta 3 ocurrencias: si solo difiere una tarjeta, se nota */
    for (const i of nth[s] || [0]) {
      const el = list[i];
      if (!el) { out.push(s + '#' + i + '\\tAUSENTE'); continue; }
      const r = el.getBoundingClientRect();
      const c = w.getComputedStyle(el);
      out.push(s + '#' + i + '\\t' + (r.width * k).toFixed(1) + '\\t' + r.height.toFixed(1) + '\\t'
        + c.display + '\\t' + c.marginTop + '\\t' + c.marginBottom + '\\t' + c.paddingTop
        + '\\t' + c.fontSize + '\\t' + c.lineHeight + '\\t' + c.fontWeight);
    }
  }
  document.getElementById('o').textContent = out.join('\\n');
});
f.src = q.get('route') || '/';
</script></body></html>`;

/* el probe debe servirse desde el mismo origen que la ruta (iframe same-origin) */
for (const dir of [join(HERE, '..', 'public'), join(HERE, '.preview')]) {
  writeFileSync(join(dir, 'box-probe.html'), probe, 'utf8');
}

const NTH = {};
for (const s of SELECTORS) NTH[s] = [0, 1, 2];

function measure(origin, route, id) {
  const url = `${origin}/box-probe.html?route=${encodeURIComponent(route)}`
    + `&sel=${encodeURIComponent(JSON.stringify(SELECTORS))}&nth=${encodeURIComponent(JSON.stringify(NTH))}`;
  /* Chrome crea un perfil de ~15 MB por ejecucion; con 26 ejecuciones por
     pasada eso llena el disco, asi que el perfil se borra al terminar. */
  const profile = join(TMP, 'cprof-box-' + id + '-' + process.pid);
  let html;
  try {
    html = execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--no-sandbox',
      `--user-data-dir=${profile}`,
      `--window-size=${WIDTH},1000`,
      '--virtual-time-budget=10000', '--dump-dom', url,
    ], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    cleanProfile(profile);
  }
  const m = html.match(/<pre id="o">([\s\S]*?)<\/pre>/);
  if (!m) throw new Error('sin reporte');
  const map = new Map();
  for (const line of m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').split('\n')) {
    const [key, w, h, disp, mt, mb, pt, fs, lh, fw] = line.split('\t');
    if (key) map.set(key, { w, h, disp, mt, mb, pt, fs, lh, fw });
  }
  return map;
}

let total = 0;
let diffs = 0;
const onlyReact = [];
const onlyStatic = [];

for (const [i, route] of ROUTES.entries()) {
  if (ONLY && route.name !== ONLY) continue;
  let a, b;
  try {
    a = measure('http://localhost:5173', route.react, `r${i}`);
    b = measure('http://localhost:8099', route.static, `s${i}`);
  } catch (err) {
    console.log(`\n[${route.name}] ERROR ${err.message}`);
    continue;
  }
  const lines = [];
  for (const [key, va] of a) {
    const vb = b.get(key);
    total++;
    /* Si el elemento no existe en ninguno de los dos lados no es una diferencia. */
    if (va.w === 'AUSENTE' && (!vb || vb.w === 'AUSENTE')) continue;
    if (!vb || vb.w === 'AUSENTE') {
      onlyReact.push(`${route.name} ${key}`);
      continue;
    }
    const dw = Math.abs(Number(va.w) - Number(vb.w));
    const dh = Math.abs(Number(va.h) - Number(vb.h));
    const notes = [];
    if (dw > 1 || dh > 1) {
      notes.push(`caja React ${va.w}x${va.h} vs estatico ${vb.w}x${vb.h} (dw ${dw.toFixed(1)} dh ${dh.toFixed(1)})`);
    }
    /* display y margenes: en React sobreviven los margenes por defecto del
       navegador de los h1-h3 (0.67em / 1em), que el reset global de sireve.css
       pone a 0. Si no se replican, los bloques quedan mas bajos. */
    if (va.disp !== vb.disp) notes.push(`display "${va.disp}" vs "${vb.disp}"`);
    /* margin-top: auto se resuelve al espacio libre del flex: valores grandes no
       son margenes comparables, asi que solo se contrastan los reales. */
    const bigMt = (x) => parseFloat(x) > 200;
    if (va.mt !== vb.mt && !bigMt(va.mt) && !bigMt(vb.mt)) notes.push(`margin-top ${va.mt} vs ${vb.mt}`);
    if (va.mb !== vb.mb) notes.push(`margin-bottom ${va.mb} vs ${vb.mb}`);
    if (va.pt !== vb.pt) notes.push(`padding-top ${va.pt} vs ${vb.pt}`);
    /* El error mas comun al portar CSS a mano es inventarse un line-height que
       en React lo pone Gravity (o al reves). Se reporta aparte de la caja. */
    if (va.lh !== vb.lh) notes.push(`line-height ${va.lh} vs ${vb.lh}`);
    if (va.fs !== vb.fs) notes.push(`font-size ${va.fs} vs ${vb.fs}`);
    if (va.fw !== vb.fw) notes.push(`font-weight ${va.fw} vs ${vb.fw}`);
    if (notes.length) {
      diffs++;
      lines.push(`  ${key}: ${notes.join(' Â· ')}`);
    }
  }
  for (const key of b.keys()) if (!a.has(key)) onlyStatic.push(`${route.name} ${key}`);
  if (lines.length) {
    console.log(`\n=== ${route.react} (${lines.length}) ===`);
    for (const l of lines) console.log(l);
  }
}

console.log(`\n${total} elementos comparados, ${diffs} con diferencia de caja (>1px) a ${WIDTH}px`);
if (onlyReact.length) {
  console.log(`\nsolo en React (${onlyReact.length}):`);
  for (const x of onlyReact) console.log(`  ${x}`);
}
if (onlyStatic.length) {
  console.log(`\nsolo en estatico (${onlyStatic.length}):`);
  for (const x of onlyStatic) console.log(`  ${x}`);
}
