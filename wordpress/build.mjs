/* ============================================================================
   SIREVE · CSUCA — generador del sitio estatico para WordPress
   ----------------------------------------------------------------------------
   Uso:  node wordpress/build.mjs        (desde la raiz del repo o desde wordpress/)

   Lee los datos reales del proyecto React (src/data/*) y los iconos de
   @gravity-ui/icons, y escribe:

     - 13 fragmentos en wordpress/*.html  (los usa el preview de verificacion)
     - wordpress/sireve-theme/            (el tema que se sube a WordPress:
       header.php, footer.php, plantillas, views/, assets/ y las imagenes)

   No hay que editar el HTML a mano: los datos salen de src/data/* y la
   estructura de cada pagina vive en las plantillas de este archivo. Ojo con lo
   que NO se copia de src/: los estilos van en wordpress/sireve.css y el markup
   de los .jsx de React esta replicado aqui en plantillas (React es el lado de
   referencia y el harness -- css-diff / box-diff / interact -- contrasta los
   dos lados). Si se cambia un .jsx hay que cambiar tambien su plantilla.

   NO se usa React para el HTML: los <svg> de los iconos se renderizan con
   react-dom/server en tiempo de compilacion y se guardan ya "planos" en el
   HTML, de modo que el sitio publicado no necesita React ni Gravity UI.
   ============================================================================ */

import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';

/* ------------------------------------------------------------- Rutas */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const TMP = path.join(HERE, '.tmp');
const THEME = path.join(HERE, 'sireve-theme');
const IMAGES = path.join(ROOT, 'public', 'images');

/* Donde quedan las imagenes publicadas. Por defecto: dentro del propio tema,
   asi el sitio es autocontenido y no depende de la biblioteca de medios.
   Se puede sobre-escribir:  node build.mjs --media=https://otro-sitio/img/  */
const mediaArg = process.argv.find((a) => a.startsWith('--media='));
const MEDIA_BASE = mediaArg
  ? mediaArg.slice('--media='.length).replace(/\/?$/, '/')
  : 'https://sireve.csuca.org/wp-content/themes/sireve-theme/assets/images/';

/* Rutas locales que NO se publican (las que quedaron sin uso). Todo lo demas
   se sirve conservando su estructura relativa a public/images/, de modo que
   un archivo nuevo solo tiene que existir en disco. */
const MEDIA_SKIP = new Set([
  '/images/hero.jpg', // sin uso desde que el hero paso a foto lateral
]);

/* Rutas -> archivo real bajo public/images/ (excepciones puntuales). */
const MEDIA_ALIAS = {
  '/images/gallery/1.jpg': 'gallery/1.jpg',
};

const mediaUsed = new Set();

function media(local) {
  if (MEDIA_SKIP.has(local)) {
    throw new Error(`"${local}" esta marcado como sin uso; no se puede publicar.`);
  }
  const rel = MEDIA_ALIAS[local] ?? local.replace(/^\/images\//, '');
  const file = path.join(IMAGES, rel);
  if (!existsSync(file)) {
    throw new Error(`Falta la imagen "${local}" (esperada en public/images/${rel}).`);
  }
  mediaUsed.add(rel);
  return MEDIA_BASE + rel.split(path.sep).join('/');
}


const PLACEHOLDER = media('/images/placeholder.jpg');

/* ------------------------------------------------------------ Utilidades */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Atributo data-images: se usa comilla simple porque el valor es un JSON con
   comillas dobles. Las URLs del sitio no contienen comillas simples. */
const attr = (value) => esc(value).replace(/'/g, '&#39;');

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

/* --------------------------------------------------------------- Iconos */
const ICON_NAMES = [
  'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'Bars', 'Xmark',
  'ArrowUpRightFromSquare', 'ArrowRight', 'ArrowLeft',
  'Folder', 'Picture', 'FileText', 'GraduationCap', 'BookOpen', 'Globe',
  'MusicNote', 'Cup', 'Medal', 'HeartPulse', 'Person',
  'MapPin', 'CircleXmark', 'CircleInfo', 'Book',
  'Envelope', 'Geo', 'Smartphone', 'Calendar',
];

const icons = new Map();

async function loadIcons() {
  const dir = path.join(ROOT, 'node_modules', '@gravity-ui', 'icons', 'esm');
  for (const name of ICON_NAMES) {
    const mod = await import(pathToFileURL(path.join(dir, `${name}.js`)).href);
    icons.set(kebab(name), mod.default);
  }
}

/* `className` se pone sobre el <svg> para igualar a Gravity <Icon className>. */
function icon(name, size = 16, className = '') {
  const Cmp = icons.get(name);
  if (!Cmp) throw new Error(`Icono no cargado: "${name}" (falta agregarlo a ICON_NAMES)`);
  const svg = renderToStaticMarkup(Cmp({ width: size, height: size }));
  if (!className) return svg;
  return svg.replace('<svg ', `<svg class="${className}" `);
}

/* Iconos que cambian de estado (hamburguesa <-> X, chevron <-> chevron).
   Se emiten los dos y el CSS elige cual mostrar. Las clases DEBEN coincidir con
   las de sireve.css (.ico-bars/.ico-close y .ico-down/.ico-up): si no, los dos
   iconos quedan visibles a la vez y el control mide ~18px de mas. */
const ICON_STATES = {
  chevron: [
    ['down', 'chevron-down'],
    ['up', 'chevron-up'],
  ],
  bars: [
    ['bars', 'bars'],
    ['close', 'xmark'],
  ],
};

function iconState(kind, size = 16) {
  const pair = ICON_STATES[kind];
  if (!pair) throw new Error(`Par de iconos desconocido: "${kind}"`);
  return pair.map(([cls, name]) => `<span class="ico-${cls}">${icon(name, size)}</span>`).join('');
}

/* El icono "Cup" trae un clipPath con id fijo; si el mismo icono se repitiera en
   una pagina habria colision. Se renumeran al final de cada pagina. */
/* Gravity emite <clipPath id="a"> y clip-path="url(#a)" dentro de cada SVG. Al
   pegar varios SVG en una misma pagina los ids se colisionan (y el SVG puede
   quedar recortado por el primer #a ajeno), asi que se renumeran por SVG
   manteniendo la definicion y su referencia en el mismo id. */
function uniqueClipIds(html) {
  let n = 0;
  return html.replace(/<svg\b[\s\S]*?<\/svg>/g, (svg) => {
    if (!svg.includes('id="')) return svg;
    let i = 0;
    const ids = new Map();
    const rename = (old) => {
      if (!ids.has(old)) ids.set(old, `ico-clip-${n++}-${i++}`);
      return ids.get(old);
    };
    return svg
      .replace(/(<clipPath id=")([^"]+)(")/g, (_, a, old, c) => a + rename(old) + c)
      .replace(/(clip-path="url\(#)([^)]+)(\)")/g, (_, a, old, c) => a + rename(old) + c);
  });
}

/* ---------------------------------------------------------------- Datos */
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

/* galleryData.json se incrusta como literal: Node exige atributos de import
   para los JSON, pero el archivo del proyecto usa import plano (Vite lo resuelve
   sin problema). Se reescribe solo esa linea. */
const galleryJson = readFileSync(path.join(ROOT, 'src/data/galleryData.json'), 'utf8');
writeFileSync(
  path.join(TMP, 'galleryData.mjs'),
  read('src/data/galleryData.js').replace(
    /^import rawGalleryData from '\.\/galleryData\.json';$/m,
    `const rawGalleryData = ${galleryJson};`,
  ),
);

/* programs.js importa iconos de React como componentes; aqui solo hacen falta
   los NOMBRES, asi que se sustituyen por cadenas. */
const programsSrc = read('src/data/programs.js');
const importedIcons = [.../import \{([^}]+)\} from '@gravity-ui\/icons';/.exec(programsSrc)[1].matchAll(/[A-Za-z]\w+/g)]
  .map((m) => m[0]);
writeFileSync(
  path.join(TMP, 'icons-shim.mjs'),
  importedIcons.map((n) => `export const ${n} = '${kebab(n)}';`).join('\n'),
);
writeFileSync(
  path.join(TMP, 'programs.mjs'),
  programsSrc.replace(/from '@gravity-ui\/icons'/, "from './icons-shim.mjs'"),
);

/* presidents.js importa galleryByYear; se le pasa el ya resuelto. */
writeFileSync(
  path.join(TMP, 'galleryByYear.mjs'),
  `export const galleryByYear = await import('./galleryData.mjs').then((m) => m.galleryByYear);\n`,
);
writeFileSync(
  path.join(TMP, 'presidents.mjs'),
  read('src/data/presidents.js').replace(/from '\.\/galleryData'/, "from './galleryByYear.mjs'"),
);

const { programs } = await import(pathToFileURL(path.join(TMP, 'programs.mjs')).href);
const { galleryByYear } = await import(pathToFileURL(path.join(TMP, 'galleryData.mjs')).href);
const { timeline, getPresidentForYear, formatTerm } = await import(
  pathToFileURL(path.join(TMP, 'presidents.mjs')).href
);

await loadIcons();

/* -------------------------------------------------------------- Contenido */
/* El menu del header usa las etiquetas originales de Header.jsx */
const HEADER_PROGRAM_ITEMS = [
  { label: 'Qué es FICCUA', to: '/programas/ficcua/' },
  { label: 'Qué es JUDUCA', to: '/programas/juduca/' },
  { label: 'Excelencia Académica', to: '/programas/premio-ruben-dario/' },
  { label: 'Promotoras de Salud', to: '/programas/promotoras-salud/' },
  { label: 'Voluntariado', to: '/programas/voluntariado/' },
];

const YEARS = Object.keys(galleryByYear).sort();

const YEAR_COVERS = {
  2017: '/images/gallery/1.jpg',
  2018: '/images/gallery/2.jpg',
  2019: '/images/gallery/3.jpg',
};

/* --------------------------------------------------------------- Header */
function socialLinks(variant, extraClass = '') {
  const items = [
    {
      label: 'Facebook CSUCA',
      href: 'https://www.facebook.com/csuca/',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
    {
      label: 'X (Twitter) CSUCA',
      href: 'https://x.com/SGCSUCA',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
  ];
  const links = items
    .map(
      (it) =>
        `<a class="social-links-item" href="${it.href}" target="_blank" rel="noopener noreferrer" aria-label="${esc(it.label)}">` +
        `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="${it.path}"></path></svg>` +
        `</a>`,
    )
    .join('\n          ');
  return `<div class="social-links social-links--${variant}${extraClass ? ' ' + extraClass : ''}">
          ${links}
        </div>`;
}

function dropdown(label, items, activePath) {
  const entries = items
    .map(
      (it) =>
        `<a class="header-dropdown-item${activePath && activePath.startsWith(it.to) ? ' active' : ''}" href="${it.to}" data-nav="${it.to.replace(/\/$/, '')}">${esc(it.label)}</a>`,
    )
    .join('\n              ');
  const isActive = items.some((it) => activePath && activePath.startsWith(it.to));
  return `<div class="header-dropdown">
            <button type="button" class="header-link header-dropdown-toggle${isActive ? ' active' : ''}" aria-expanded="false" aria-haspopup="true">
              ${esc(label)}
              ${iconState('chevron', 14)}
            </button>
            <div class="header-dropdown-menu" hidden>
              ${entries}
            </div>
          </div>`;
}

function header(activePath) {
  const link = (href, label, { cta = false, nav = null, cls = '' } = {}) => {
    const isActive = nav && activePath && activePath.replace(/\/$/, '') === nav.replace(/\/$/, '');
    const classes = ['header-link', cta ? 'header-link--cta' : '', cls, isActive ? 'active' : '']
      .filter(Boolean)
      .join(' ');
    return `<a class="${classes}" href="${href}"${nav ? ` data-nav="${nav}"` : ''}>${esc(label)}</a>`;
  };

  const galeriaItems = [
    { label: 'Todas las galerías', to: '/galeria/' },
    ...YEARS.map((y) => ({ label: y, to: `/galeria/${y}/` })),
  ];

  return `<header class="site-header">
      <div class="header-inner">
        <a href="/" class="header-brand">
          <span class="header-brand-logo">
            <img src="${media('/images/logo-csuca.png')}" alt="CSUCA" class="header-logo-img">
          </span>
          <span class="header-brand-text">
            <span class="header-brand-title">Consejo Superior Universitario<br>Centroamericano</span>
          </span>
        </a>

        <button type="button" class="header-mobile-toggle" aria-label="Menú" aria-expanded="false">
          ${iconState('bars', 22)}
        </button>

        <nav class="header-nav">
          ${link('/', 'Inicio', { nav: '/' })}

          <a class="header-link header-nav-anchor" href="/#sireve" data-target="#sireve">SIREVE</a>

          <div class="header-divider" aria-hidden="true"></div>

          ${dropdown('Programas', HEADER_PROGRAM_ITEMS, activePath)}

          ${link('/actas/', 'Actas', { nav: '/actas' })}

          ${dropdown('Galería', galeriaItems, activePath)}

          ${link('/reglamentos/', 'Reglamentos', { nav: '/reglamentos' })}

          ${link('/contacto/', 'Contacto', { nav: '/contacto', cta: true })}

          <a class="header-link header-link--external" href="https://csuca.org/" target="_blank" rel="noopener noreferrer" title="Sitio oficial del CSUCA">
            CSUCA
            ${icon('arrow-up-right-from-square', 11)}
          </a>

          ${socialLinks('header', 'header-social')}
        </nav>
      </div>
    </header>`;
}

/* --------------------------------------------------------------- Footer */
function footer() {
  const programLinks = HEADER_PROGRAM_ITEMS.map(
    (p) => `<li><a href="${p.to}">${esc(p.label)}</a></li>`,
  ).join('\n            ');

  return `<footer class="footer-container">
      <div class="footer-content">
        <div class="footer-col">
          <div class="footer-brand-row">
            <img src="${media('/images/logo-csuca.png')}" alt="CSUCA" class="footer-logo-img">
          </div>
          <span class="footer-csuca">Sistema Regional de Vida Estudiantil</span>
          <p class="footer-text">Consejo Superior Universitario Centroamericano. Coordinando la vida estudiantil en Centroamérica y el Caribe.</p>
          ${socialLinks('footer', 'footer-social')}
        </div>

        <div class="footer-col">
          <span class="footer-col-title">Recursos</span>
          <ul class="footer-links">
            <li><a href="/">Inicio</a></li>
            <li><a href="/actas/">Actas SIREVE</a></li>
            <li><a href="/galeria/">Galería</a></li>
            <li><a href="/reglamentos/">Reglamentos</a></li>
            <li><a href="/contacto/">Contacto</a></li>
            <li><a href="https://csuca.org/" target="_blank" rel="noopener noreferrer">Sitio oficial CSUCA</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <span class="footer-col-title">Programas</span>
          <ul class="footer-links">
            ${programLinks}
          </ul>
        </div>

        <div class="footer-col">
          <span class="footer-col-title">Contacto</span>
          <p class="footer-text">
            Secretaría General del CSUCA<br>
            Av. Las Américas 1-03, Zona 14,<br>
            interior Club Deportivo Los Arcos,<br>
            Ciudad de Guatemala, Guatemala<br>
            <a href="mailto:sg@csuca.org" class="footer-link-inline">sg@csuca.org</a><br>
            <a href="tel:+50225027500" class="footer-link-inline">+(502) 2502-7500</a>
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">© <span data-year>2026</span> SIREVE · CSUCA. Todos los derechos reservados.</span>
      </div>
    </footer>`;
}

/* ----------------------------------------------------------- PageHeader */
function pageHero({ title, subtitle, icon: iconName }) {
  /* En React la clase va sobre el propio <svg> (Gravity <Icon className="...">),
     no en un <span> contenedor: se replica para que la caja del icono y el
     interlineado del hero midan igual. */
  return `<div class="page-hero">
          ${iconName ? icon(iconName, 40, 'page-hero-icon') : ''}
          <h1 class="page-hero-title">${esc(title)}</h1>
          ${subtitle ? `<p class="page-hero-sub">${esc(subtitle)}</p>` : ''}
        </div>`;
}

/* ------------------------------------------------------------ Lightbox */
function lightbox() {
  return `<div class="gallery-lightbox" hidden role="dialog" aria-modal="true" aria-label="Galería">
        <div class="gallery-lightbox-inner">
          <button type="button" class="gallery-lightbox-close" aria-label="Cerrar">${icon('xmark', 22)}</button>
          <img class="gallery-lightbox-img" src="${PLACEHOLDER}" alt="">
          <button type="button" class="gallery-lightbox-nav gallery-lightbox-nav--prev" aria-label="Anterior">${icon('chevron-left', 28)}</button>
          <button type="button" class="gallery-lightbox-nav gallery-lightbox-nav--next" aria-label="Siguiente">${icon('chevron-right', 28)}</button>
          <div class="gallery-lightbox-footer">
            <span class="gallery-lightbox-title"></span>
            <span class="gallery-lightbox-counter"></span>
          </div>
        </div>
      </div>`;
}

/* ------------------------------------------------------------- Imagenes */
function img(local, alt, cls = '') {
  return `<img src="${media(local)}" alt="${attr(alt)}"${cls ? ` class="${cls}"` : ''}>`;
}

/* ----------------------------------------------------------- Fragmento */
/* Cada pagina se genera una sola vez y se usa dos veces: como fragmento
   (wordpress/*.html, que es lo que mide el preview) y como vista del tema
   (sireve-theme/views/*.html, que es lo que se publica). */
const VIEWS = [];

function fragment({ file, title, url, body }) {
  const html = `<div class="sireve">
  ${header(url)}

  <main class="sireve-main">
${body}
  </main>

  ${footer()}
</div>
`;
  const note = `<!--
  ${title}
  Generado por build.mjs: el fragmento alimenta el preview de verificacion y
  la vista que usa el tema de WordPress.
  ${file} · ruta canonica: ${url}
  NO editar a mano: los cambios se pierden al recompilar.
-->
`;
  writeFileSync(path.join(HERE, file), uniqueClipIds(note + html), 'utf8');
  VIEWS.push({ file, url, html: uniqueClipIds(html) });
  return file;
}

/* Los SVG de Gravity traen <clipPath id="a"> y clip-path="url(#a)". Si un id se
   duplica entre iconos de la misma pagina, el navegador resuelve el #a al
   primer <clipPath> del documento y el icono se recorta con la mascara de otro.
   Se comprueba aqui para que un fallo llegue al build y no a la pagina. */
function assertClipIds(html, file) {
  const defs = [...html.matchAll(/<clipPath id="([^"]+)"/g)].map((m) => m[1]);
  const refs = [...html.matchAll(/clip-path="url\(#([^)]+)\)"/g)].map((m) => m[1]);
  const problems = [];
  for (const r of refs) if (!defs.includes(r)) problems.push(`referencia sin definir: #${r}`);
  for (const d of defs) {
    const n = defs.filter((x) => x === d).length;
    if (n > 1) problems.push(`id duplicado (${n}x): ${d}`);
    if (!refs.includes(d)) problems.push(`clipPath sin usar: ${d}`);
  }
  if (problems.length) {
    console.error(`\n  ERROR ${file}:`);
    for (const p of problems) console.error(`    - ${p}`);
    process.exitCode = 1;
  }
}

/* ==========================================================================
   PAGINAS
   ========================================================================== */

const HERO_STATS = [
  { value: '30+', label: 'Universidades miembros' },
  { value: '5', label: 'Programas regionales' },
  { value: '8', label: 'Países de la región' },
];

const QUICK_LINKS = [
  {
    title: 'Actas SIREVE',
    desc: 'Documentos oficiales del CONREVE y comités',
    icon: 'folder',
    path: '/actas/',
    image: '/images/quick/actas.jpg',
  },
  {
    title: 'Galería',
    desc: 'Eventos y actividades por año',
    icon: 'picture',
    path: '/galeria/',
    image: '/images/quick/galeria.jpg',
  },
  {
    title: 'Reglamentos',
    desc: 'Normativas vigentes del sistema',
    icon: 'file-text',
    path: '/reglamentos/',
    image: '/images/quick/reglamentos.jpg',
  },
];

const CAROUSEL_IMAGES = [
  { image: '/images/carousel/1.jpg', alt: 'Autoridades de la CSUCA con las banderas de los países centroamericanos' },
  { image: '/images/carousel/2.jpg', alt: 'Plenaria del 5.º SICEVAES en la UNED de Costa Rica' },
  { image: '/images/carousel/3.jpg', alt: 'Comité del SIREVE en el Auditorio Cora Ferro Calabrese de la UNA' },
];

const SIREVE_SECTION = {
  title: 'SIREVE',
  subtitle: '¿Qué es SIREVE?',
  description:
    'El Sistema Regional de Vida Estudiantil (SIREVE), es el órgano del Consejo Superior Universitario Centroamericano CSUCA, que a través del Consejo Regional de Vida Estudiantil (CONREVE), está encargado de coordinar, promover, fortalecer y generar iniciativas, programas y proyectos que impulsen el desarrollo del área de Vida Estudiantil de las Universidades miembros; contribuyendo a la formación integral de profesionales que participen con compromiso social, en la transformación, desarrollo e Integración de los países miembros del Sistema de Integración Centroamericana SICA.',
};

function landing() {
  const stats = HERO_STATS.map(
    (s) => `<div class="landing-hero-stat">
              <span class="landing-hero-stat-bar" aria-hidden="true"></span>
              <span class="landing-hero-stat-value">${s.value}</span>
              <span class="landing-hero-stat-label">${esc(s.label)}</span>
            </div>`,
  ).join('\n            ');

  const mosaic = programs
    .map((p) => `<div class="sireve-mosaic-item">${img(p.image, '', '')}</div>`)
    .join('\n              ');

  const quick = QUICK_LINKS.map(
    (q) => `<a class="quick-card" href="${q.path}">
                <div class="quick-card-image">
                  ${img(q.image, q.title)}
                </div>
                <div class="quick-card-body">
                  <div class="quick-card-icon">${icon(q.icon, 20)}</div>
                  <h3 class="quick-card-title">${esc(q.title)}</h3>
                  <p class="quick-card-desc">${esc(q.desc)}</p>
                  <span class="btn-ver quick-card-ver">Ver</span>
                </div>
              </a>`,
  ).join('\n            ');

  const slides = CAROUSEL_IMAGES.map(
    (c, i) => `<div class="carousel-slide${i === 0 ? ' active' : ''}">
                  ${img(c.image, c.alt)}
                </div>`,
  ).join('\n                ');

  const slideDots = CAROUSEL_IMAGES.map(
    (_, i) => `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i + 1}"></button>`,
  ).join('\n                ');

  const programCards = programs
    .map(
      (p) => `<article id="${p.slug}" class="program-card">
              <div class="program-card-image">
                ${img(p.image, p.title)}
                <div class="program-card-image-overlay">
                  <div class="program-card-image-badge">${icon(p.icon, 18)}</div>
                  <h3 class="program-card-image-title">${esc(p.title)}</h3>
                </div>
                <div class="program-card-accent-bar"></div>
              </div>
              <div class="program-card-body">
                <span class="program-card-label">${esc(p.subtitle)}</span>
                <p class="program-card-text">${esc(p.excerpt)}</p>
                <a class="program-card-cta" href="/programas/${p.slug}/">
                  Ver programa
                  ${icon('arrow-right', 14)}
                </a>
              </div>
            </article>`,
    )
    .join('\n            ');

  const body = `<div class="landing">
      <section class="landing-hero">
        <div class="landing-hero-content">
          <div class="landing-hero-brand landing-hero-animate landing-hero-animate--1">
            <span class="landing-hero-logo-plate">
              ${img('/images/logo-csuca.png', 'SIREVE — Sistema Regional de Vida Estudiantil (CSUCA)', 'landing-hero-logo')}
            </span>
            <span class="landing-hero-brand-divider" aria-hidden="true"></span>
            <span class="landing-hero-brand-text">CSUCA</span>
          </div>
          <span class="landing-hero-eyebrow landing-hero-animate landing-hero-animate--1">Integración universitaria regional</span>
          <h1 class="landing-hero-title landing-hero-animate landing-hero-animate--2">Consejo Superior Universitario Centroamericano</h1>
          <span class="landing-hero-rule" aria-hidden="true"></span>
          <div class="landing-hero-actions landing-hero-animate landing-hero-animate--3">
            <button type="button" class="landing-btn landing-btn-primary" data-target="#programas">Explorar programas</button>
            <a class="landing-btn landing-btn-secondary" href="/contacto/">Contacto</a>
          </div>
          <div class="landing-hero-stats landing-hero-animate landing-hero-animate--4">
            ${stats}
          </div>
        </div>
        <div class="landing-hero-figure landing-hero-animate landing-hero-animate--2">
          <span class="landing-hero-figure-frame" aria-hidden="true"></span>
          <div class="landing-hero-photo-plate">
            ${img('/images/hero-sicevaes.jpg', 'Participantes en una plenaria del encuentro estudiantil regional del CSUCA', 'landing-hero-photo')}
          </div>
          <span class="landing-hero-badge">
            <span class="landing-hero-badge-dot" aria-hidden="true"></span>
            Vida estudiantil · Centroamérica
          </span>
        </div>
      </section>

      <div class="fade-section">
        <section class="sireve-section" id="sireve">
          <div class="sireve-grid">
            <div class="sireve-copy">
              <span class="sireve-eyebrow">${esc(SIREVE_SECTION.subtitle)}</span>
              <h2 class="sireve-title">${esc(SIREVE_SECTION.title)}</h2>
              <span class="sireve-rule" aria-hidden="true"></span>
              <p class="sireve-text">${esc(SIREVE_SECTION.description)}</p>
              <button type="button" class="landing-btn landing-btn-primary sireve-cta" data-target="#programas">Ver programas</button>
            </div>
            <div class="sireve-mosaic" aria-hidden="true">
              ${mosaic}
            </div>
          </div>
        </section>
      </div>

      <div class="fade-section">
        <section class="quick-section">
          <div class="section-header">
            <h2 class="section-title">Acceso rápido</h2>
            <p class="section-desc">Recursos y documentos del SIREVE</p>
          </div>
          <div class="quick-grid">
            ${quick}
          </div>
        </section>
      </div>

      <div class="fade-section">
        <section class="carousel-section">
          <div class="section-header">
            <h2 class="section-title">Vida estudiantil</h2>
            <p class="section-desc">Momentos y actividades de las universidades miembros del CSUCA</p>
          </div>
          <div class="carousel-container">
            <button type="button" class="carousel-btn carousel-btn-left" aria-label="Anterior">${icon('chevron-left', 22)}</button>
            <div class="carousel-track">
              ${slides}
            </div>
            <button type="button" class="carousel-btn carousel-btn-right" aria-label="Siguiente">${icon('chevron-right', 22)}</button>
          </div>
          <div class="carousel-dots">
            ${slideDots}
          </div>
        </section>
      </div>

      <div class="fade-section">
        <section class="programs-section" id="programas">
          <div class="section-header">
            <h2 class="section-title">Nuestros programas</h2>
            <p class="section-desc">Iniciativas del SIREVE desarrolladas por el Consejo Regional de Vida Estudiantil (CONREVE)</p>
          </div>
          <div class="programs-grid">
            ${programCards}
          </div>
        </section>
      </div>
    </div>`;

  return fragment({ file: 'inicio.html', title: 'Portada', url: '/', body });
}

function actas() {
  const categories = [
    {
      title: 'CONSEJO DIRECTIVO CONREVE',
      desc: 'Actas del comité directivo, órgano propositivo del CONREVE, encargado de formular los planes y proyectos.',
      url: 'https://drive.google.com/drive/folders/1lOTQdIyd4qffetTIOtlz5vlaYvx2aE_h',
    },
    {
      title: 'FICCUA',
      desc: 'Detalles de los Congresos Pre FICCUA, enmarcados en la organización previa al evento de Cultura y Arte del CSUCA.',
      url: 'https://drive.google.com/drive/folders/1DfOaQ_DFvqHXgVvk5X19PlLu44JK_Hc4',
    },
    {
      title: 'JUDUCA',
      desc: 'Detalles de los Congresos Pre JUDUCA, enmarcados en la organización previa al evento deportivo del CSUCA.',
      url: 'https://drive.google.com/drive/folders/1Wfw6WwTzJWllWrIAGM6qs_hnoNc3Q35g',
    },
    {
      title: 'PROMOTORAS DE LA SALUD',
      desc: 'Acuerdos de las Asambleas General de delegados que promueven el programa de Universidades Promotoras de la Salud.',
      url: 'https://drive.google.com/drive/folders/1-y2M78ic5uRzOBZKeAF08BqGEkYb1E_W',
    },
    {
      title: 'SESIONES CONREVE',
      desc: 'El CONREVE se reúne ordinariamente dos veces por año y extraordinariamente cuando lo decidan sus miembros.',
      url: 'https://drive.google.com/drive/folders/1rx_yImAJi__RcTDTp6Mv61FYJ0hc5h1Q',
    },
  ];

  const cards = categories
    .map(
      (c) => `<article class="actas-card">
            <div class="actas-card-accent"></div>
            <div class="actas-card-header">
              <div class="actas-card-icon-wrap">${icon('folder', 22)}</div>
              <h3 class="actas-card-title">${esc(c.title)}</h3>
            </div>
            <p class="actas-card-desc">${esc(c.desc)}</p>
            <div class="actas-card-spacer"></div>
            <a class="actas-card-btn" href="${c.url}" target="_blank" rel="noopener noreferrer">
              Consultar
              ${icon('arrow-up-right-from-square', 14)}
            </a>
          </article>`,
    )
    .join('\n          ');

  const body = `<div class="page-wrap">
      ${pageHero({
        title: 'Actas SIREVE',
        subtitle: 'Documentos oficiales de las sesiones y actividades del CONREVE',
        icon: 'folder',
      })}
      <div class="page-body">
        <div class="actas-grid">
          ${cards}
        </div>
      </div>
    </div>`;

  return fragment({ file: 'actas.html', title: 'Actas SIREVE', url: '/actas/', body });
}

function timelineBlock() {
  if (timeline.length === 0) {
    return `<div class="timeline-empty">
          <span class="timeline-empty-icon">${icon('person', 26)}</span>
          <h2 class="timeline-empty-title">Espacio reservado para la línea de tiempo de presidentes</h2>
          <p class="timeline-empty-text">Aquí se publicarán los presidentes del CONREVE con su periodo de mandato y los años de galería que les corresponden.</p>
        </div>`;
  }

  const items = timeline
    .map((item) => {
      const years = item.years.length
        ? `<div class="timeline-years">
            ${item.years
              .map(
                (y) =>
                  `<a class="timeline-year" href="/galeria/${y}/">${y}${item.partialYears[y] ? '<span class="timeline-year-tag">parcial</span>' : ''}</a>`,
              )
              .join('\n            ')}
          </div>`
        : `<span class="timeline-noyears">Sin galerías publicadas de este periodo</span>`;

      const photo = item.photo
        ? `<span class="timeline-photo"><img src="${item.photo}" alt="${attr(item.name)}"></span>`
        : '';

      return `<li class="timeline-item">
          <span class="timeline-marker" aria-hidden="true"></span>
          <div class="timeline-body">
            <span class="timeline-term">${icon('calendar', 14)}<span class="timeline-term-icon" aria-hidden="true"></span>Mandato ${esc(formatTerm(item))}</span>
            <div class="timeline-head">
              ${photo}
              <div class="timeline-headings">
                <h3 class="timeline-name">${esc(item.name)}</h3>
                <span class="timeline-org">${esc([item.university, item.country].filter(Boolean).join(' · '))}</span>
              </div>
            </div>
            ${item.session ? `<p class="timeline-session">${esc(item.session)}</p>` : ''}
            ${item.note ? `<p class="timeline-note">${esc(item.note)}</p>` : ''}
            ${years}
          </div>
        </li>`;
    })
    .join('\n        ');

  return `<ol class="timeline">
        ${items}
      </ol>`;
}

function galeriaIndex() {
  const timelineLast = timeline.length === 0;

  const yearCards = YEARS.map((year) => {
    const local = YEAR_COVERS[year] ?? '/images/placeholder.jpg';
    return `<a class="galeria-year-card" href="/galeria/${year}/">
              <div class="galeria-year-image">${img(local, `Galería ${year}`)}</div>
              <div class="galeria-year-body">
                <h3 class="galeria-year-title">${year}</h3>
                <span class="btn-ver">Consultar</span>
              </div>
            </a>`;
  }).join('\n            ');

  const body = `<div class="page-wrap">
      ${pageHero({ title: 'Galería', subtitle: 'Eventos y actividades del SIREVE por año', icon: 'picture' })}
      <div class="page-body">
        <div class="galeria-sections${timelineLast ? ' galeria-sections--timeline-last' : ''}">
          <section class="timeline-section">
            <h2 class="timeline-title">Presidentes del CONREVE</h2>
            <p class="timeline-lead">Línea de tiempo de los mandatos. Cada presidente aparece una vez por mandato, con los años de galería que le corresponden.</p>
            ${timelineBlock()}
          </section>

          <section class="galeria-years-section">
            <h2 class="timeline-title">Galerías por año</h2>
            <div class="galeria-years-grid">
            ${yearCards}
            </div>
          </section>
        </div>
      </div>
    </div>`;

  return fragment({ file: 'galeria.html', title: 'Galería (índice)', url: '/galeria/', body });
}

function albumCard(album) {
  /* las fotos del fallback 2019 (y cualquier otra local) van al tema; las del
     sitio oficial ya son URLs absolutas y se dejan como estan */
  const images = album.images.map((src) => (src.startsWith('/images/') ? media(src) : src));
  const total = images.length;
  const multi = total > 1;
  const dots = images
    .map((_, i) => `<button type="button" class="gallery-album-dot${i === 0 ? ' active' : ''}" aria-label="Imagen ${i + 1}"></button>`)
    .join('\n                ');

  /* Los dots van FUERA de la foto (en .gallery-album-body): sobre la imagen
     el punto activo desaparecia en las fotos claras. El contador y las flechas
     siguen encima, donde ya eran chips solidos. */
  const controls = multi
    ? `<button type="button" class="gallery-album-nav gallery-album-nav--prev" aria-label="Anterior">${icon('chevron-left', 20)}</button>
              <button type="button" class="gallery-album-nav gallery-album-nav--next" aria-label="Siguiente">${icon('chevron-right', 20)}</button>
              <span class="gallery-album-counter">1 / ${total}</span>`
    : '';

  const meta = multi
    ? `<span class="gallery-album-meta">${total} fotos — clic en la imagen para ampliar</span>`
    : '';

  return `<article class="gallery-album" data-title="${attr(album.title)}" data-images='${attr(JSON.stringify(images))}'>
            <div class="gallery-album-carousel">
              <button type="button" class="gallery-album-img-btn" aria-label="Ampliar imagen de ${attr(album.title)}">
                <img src="${attr(images[0])}" alt="${attr(`${album.title} — imagen 1`)}">
              </button>
              ${controls}
            </div>
            <div class="gallery-album-body">
              ${multi ? `<div class="gallery-album-dots">
                ${dots}
              </div>` : ''}
              <span class="gallery-album-title">${esc(album.title)}</span>
              ${meta}
            </div>
          </article>`;
}

function galeriaYear(year) {
  const albums = galleryByYear[year] || [];
  const president = getPresidentForYear(year);

  const context = president
    ? `<div class="galeria-context">
          <span class="galeria-context-icon">${icon('person', 18)}</span>
          <span class="galeria-context-text">
            <strong>Presidente del CONREVE en ${year}:</strong> ${esc(president.name)}${president.university ? ` · ${esc(president.university)}` : ''}
            <span class="galeria-context-term">${icon('calendar', 13)}<span class="galeria-context-term-icon" aria-hidden="true"></span> mandato ${esc(formatTerm(president))}${president.partial ? ' (año de transición)' : ''}</span>
          </span>
        </div>`
    : '';

  const grid = albums.length
    ? albums.map(albumCard).join('\n          ')
    : `<div class="galeria-empty"><p>No hay eventos registrados para el año ${year}</p></div>`;

  const body = `<div class="page-wrap">
      ${pageHero({ title: `Galería ${year}`, subtitle: 'Eventos y actividades del SIREVE', icon: 'picture' })}
      <div class="page-body">
        ${context}
        <div class="galeria-grid">
          ${grid}
        </div>
      </div>
    </div>
    ${lightbox()}`;

  return fragment({ file: `galeria-${year}.html`, title: `Galería ${year}`, url: `/galeria/${year}/`, body });
}

function reglamentos() {
  const body = `<div class="page-wrap">
      ${pageHero({
        title: 'Reglamentos',
        subtitle: 'Normativas vigentes del Sistema Regional de Vida Estudiantil',
        icon: 'file-text',
      })}
      <div class="page-body">
        <div class="reglamentos-list">
          <div class="reglamentos-item">
            <div class="reglamentos-item-icon">${icon('file-text', 20)}</div>
            <p class="reglamentos-item-title">REGLAMENTO GENERAL SIREVE</p>
            <a class="reglamentos-item-btn" href="https://drive.google.com/file/d/10Xzi970AWcU-wtjjToGSosP54_dXWo-M/view?usp=sharing" target="_blank" rel="noopener noreferrer">Consultar</a>
          </div>
        </div>
      </div>
    </div>`;

  return fragment({ file: 'reglamentos.html', title: 'Reglamentos', url: '/reglamentos/', body });
}

function contacto() {
  const body = `<div class="page-wrap">
      ${pageHero({
        title: 'Contacto',
        subtitle: 'El SIREVE es un sistema del CSUCA; las consultas se dirigen a la Secretaría General.',
        icon: 'envelope',
      })}
      <div class="page-body">
        <div class="contacto-grid">
          <form class="contacto-form" method="post">
            <!-- Envio real: agregar action="https://formsubmit.co/sg@csuca.org"
                 (o el endpoint de Formspree) y quitar el preventDefault del
                 listener initForm() de sireve.js. El envio se SIMULA: la
                 validacion nativa (required + type=email) bloquea campos
                 vacios y correos invalidos, y sireve.js muestra este mensaje
                 de confirmacion y limpia los campos. -->
            <div class="contacto-form-success" role="status">
              <p class="contacto-form-success-text">¡Gracias por contactarnos! Nos pondremos en contacto con usted en breve.</p>
            </div>
            <div class="contacto-field">
              <label class="contacto-label" for="nombre">Nombre Completo</label>
              <input class="contacto-input" id="nombre" name="nombre" type="text" placeholder="Ingresa tu nombre" required>
            </div>
            <div class="contacto-field">
              <label class="contacto-label" for="email">Correo Electrónico</label>
              <input class="contacto-input" id="email" name="email" type="email" placeholder="tucorreo@ejemplo.com" required>
            </div>
            <div class="contacto-field">
              <label class="contacto-label" for="asunto">Asunto</label>
              <input class="contacto-input" id="asunto" name="asunto" type="text" placeholder="¿De qué trata tu consulta?" required>
            </div>
            <div class="contacto-field">
              <label class="contacto-label" for="mensaje">Mensaje</label>
              <textarea class="contacto-textarea" id="mensaje" name="mensaje" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
            </div>
            <button type="submit" class="contacto-btn">Enviar Mensaje</button>
          </form>

          <div class="contacto-info">
            <h2 class="contacto-info-heading">Información</h2>
            <div class="contacto-info-item">
              <span class="contacto-info-icon">${icon('geo', 20)}</span>
              <div>
                <p class="contacto-info-label">Dirección</p>
                <p class="contacto-info-text">
                  Av. Las Américas 1-03, Zona 14,<br>
                  interior Club Deportivo Los Arcos,<br>
                  Ciudad de Guatemala, Guatemala
                </p>
              </div>
            </div>
            <div class="contacto-info-item">
              <span class="contacto-info-icon">${icon('envelope', 20)}</span>
              <div>
                <p class="contacto-info-label">Correo</p>
                <a href="mailto:sg@csuca.org" class="contacto-info-link">sg@csuca.org</a>
              </div>
            </div>
            <div class="contacto-info-item">
              <span class="contacto-info-icon">${icon('smartphone', 20)}</span>
              <div>
                <p class="contacto-info-label">Teléfono</p>
                <a href="tel:+50225027500" class="contacto-info-link">+(502) 2502-7500</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return fragment({ file: 'contacto.html', title: 'Contacto', url: '/contacto/', body });
}

const PROGRAM_META = [
  { icon: 'globe', label: 'Ámbito', value: 'Regional centroamericano' },
  { icon: 'circle-info', label: 'Órgano', value: 'SIREVE · CONREVE' },
  { icon: 'book', label: 'Cobertura', value: '30+ universidades del CSUCA' },
];

function programa(program) {
  const meta = PROGRAM_META.map(
    (m) => `<div class="program-meta-item">
              <span class="program-meta-icon">${icon(m.icon, 18)}</span>
              <div class="program-meta-body">
                <span class="program-meta-label">${esc(m.label)}</span>
                <span class="program-meta-value">${esc(m.value)}</span>
              </div>
            </div>`,
  ).join('\n            ');

  const editions = program.editions.length
    ? `<div class="program-editions-list">
            ${program.editions
        .map((edition) => {
          const slot = edition.logo
            ? `<div class="program-edition-logo has-logo"><img src="${edition.logo}" alt="${attr(`Gráfica del ${program.title} ${edition.year || ''}`)}"></div>`
            : `<div class="program-edition-logo">${icon(program.icon, 26)}<span>${esc(edition.year || 'Edición')}</span></div>`;

          const place = edition.place
            ? `<span class="program-edition-place">${icon('map-pin', 14)}${esc(edition.place)}</span>`
            : '';

          const links = edition.links?.length
            ? `<div class="program-edition-links">
                ${edition.links
                  .map((link) =>
                    link.to
                      ? `<a class="program-edition-link" href="${link.to}">${esc(link.label)}</a>`
                      : `<a class="program-edition-link" href="${link.url}" target="_blank" rel="noopener noreferrer">${esc(link.label)}${icon('arrow-up-right-from-square', 12)}</a>`,
                  )
                  .join('\n                ')}
              </div>`
            : `<p class="program-edition-placeholder">Documentos y enlaces de esta edición — espacio reservado.</p>`;

          return `<article class="program-edition">
              ${slot}
              <div class="program-edition-body">
                <div class="program-edition-head">
                  <h3 class="program-edition-title">${esc(edition.title || `${program.title} ${edition.year || ''}`)}</h3>
                  ${place}
                </div>
                ${links}
              </div>
            </article>`;
        })
        .join('\n            ')}
          </div>`
    : `<div class="program-editions-empty">
            <span class="program-editions-empty-icon">${icon(program.icon, 26)}</span>
            <div class="program-editions-empty-body">
              <h3 class="program-editions-empty-title">Espacio reservado para las ediciones</h3>
              <p class="program-editions-empty-text">Aquí se publicarán la gráfica o mascota, la sede y los documentos de cada edición de ${esc(program.title)}.</p>
            </div>
          </div>`;

  const others = programs
    .filter((p) => p.slug !== program.slug)
    .map(
      (p) => `<a class="program-other-card" href="/programas/${p.slug}/">
                <span class="program-other-image">${img(p.image, '')}</span>
                <span class="program-other-body">
                  <span class="program-other-title">${icon(p.icon, 15)}${esc(p.title)}</span>
                  <span class="program-other-sub">${esc(p.subtitle)}</span>
                </span>
              </a>`,
    )
    .join('\n            ');

  const body = `<div class="page-wrap">
      <div class="page-body">
        <a class="program-back program-back--top" href="/#programas" data-target="#programas">
          ${icon('arrow-left', 16)}
          Volver a programas
        </a>

        <section class="program-hero">
          <div class="program-hero-copy">
            <span class="program-section-eyebrow">${esc(program.subtitle)}</span>
            <h1 class="program-hero-title">${esc(program.title)}</h1>
            <span class="program-rule" aria-hidden="true"></span>
            <p class="program-hero-tagline">${esc(program.tagline)}</p>
            <span class="program-hero-kind">Programa regional</span>

            <div class="program-meta">
              ${meta}
            </div>
          </div>

          <figure class="program-hero-figure">
            <span class="program-hero-frame" aria-hidden="true"></span>
            ${img(program.featureImage, `Gráfica del ${program.title}`)}
          </figure>
        </section>

        <section class="program-about">
          <div class="program-about-copy">
            <span class="program-section-eyebrow">Sobre el programa</span>
            <h2 class="program-heading">El programa</h2>
            <span class="program-rule" aria-hidden="true"></span>
            <p class="program-about-text">${esc(program.description)}</p>
          </div>
          <figure class="program-about-figure">
            ${img(program.image, program.title)}
          </figure>
        </section>

        <section class="program-editions">
          <span class="program-section-eyebrow">Archivo y documentos</span>
          <h2 class="program-heading">Historial de ediciones</h2>
          <span class="program-rule" aria-hidden="true"></span>
          ${editions}
        </section>

        <section class="program-others">
          <h2 class="program-heading">Otros programas</h2>
          <span class="program-rule" aria-hidden="true"></span>
          <div class="program-others-grid">
            ${others}
          </div>
        </section>
      </div>
    </div>`;

  return fragment({
    file: `programa-${program.slug}.html`,
    title: program.title,
    url: `/programas/${program.slug}/`,
    body,
  });
}

/* ==========================================================================
   TEMA DE WORDPRESS
   Los PHP de aqui abajo son plantillas estaticas: build.mjs solo las copia y
   les inyecta el mapa de vistas. No se editan a mano.
   ========================================================================== */

const THEME_STYLE = `/*
Theme Name: SIREVE CSUCA
Theme URI: https://sireve.csuca.org/
Author: CSUCA
Description: Sistema Regional de Vida Estudiantil (SIREVE) del CSUCA. Tema generado por wordpress/build.mjs; no editar a mano.
Version: 1.0
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: sireve
*/

/* Los estilos reales estan en assets/sireve.css y se encolan en functions.php.
   Este archivo solo lleva la cabecera que WordPress exige para activar el tema. */
`;

const FUNCTIONS_PHP = `<?php
/**
 * SIREVE · CSUCA — functions del tema.
 * Generado por wordpress/build.mjs: no editar a mano (se sobreescribe al recompilar).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
} );

/** Mapa ruta canonica => archivo de vista (lo escribe build.mjs). */
function sireve_views() {
	static $views = null;
	if ( null === $views ) {
		$file = get_template_directory() . '/views/index.php';
		$views = file_exists( $file ) ? require $file : array();
	}
	return $views;
}

/** Ruta pedida por el navegador, normalizada con barra final: "/galeria/2017/". */
function sireve_route() {
	$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	$path = wp_parse_url( $uri, PHP_URL_PATH );
	if ( ! $path ) {
		$path = '/';
	}
	$home = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( $home && '/' !== $home && 0 === strpos( $path, $home ) ) {
		$path = substr( $path, strlen( rtrim( $home, '/' ) ) );
		if ( false === $path || '' === $path ) {
			$path = '/';
		}
	}
	$path = untrailingslashit( $path );
	return '' === $path ? '/' : $path . '/';
}

/** true si la ruta pedida tiene vista generada. */
function sireve_is_view() {
	$views = sireve_views();
	$route = sireve_route();
	return isset( $views[ $route ] );
}

/** Pinta la vista de la ruta actual. Devuelve false si no hay vista. */
function sireve_render() {
	$views = sireve_views();
	$route = sireve_route();
	if ( ! isset( $views[ $route ] ) ) {
		return false;
	}
	$file = basename( $views[ $route ] );
	if ( ! preg_match( '/^[a-z0-9-]+\\.html$/', $file ) ) {
		return false;
	}
	include get_template_directory() . '/views/' . $file;
	return true;
}

/* Slugs numericos: WordPress renombra "2017" a "2017-2" al importar (los anos
   de la galeria, sireve-pages.xml). Devolver algo distinto de null corta el
   calculo de unicidad. El tema tiene que estar activo ANTES de importar. */
add_filter( 'pre_wp_unique_post_slug', function ( $override, $slug, $post_id, $post_status, $post_type, $post_parent ) {
	if ( 'page' === $post_type && in_array( $slug, array( '2017', '2018', '2019' ), true ) ) {
		return $slug;
	}
	return $override;
}, 10, 6 );

/* /galeria/2017/ la captura la regla de paginacion de paginas
   (pagename=galeria + page=2017) y redirect_canonical lo manda a /galeria/.
   Esta regla ("top") resuelve la pagina hija antes que esa regla generica;
   hace falta un flush de permalinks (Guardar enlaces permanentes) al activar. */
add_action( 'init', function () {
	add_rewrite_rule( '^galeria/([0-9]{4})/?$', 'index.php?pagename=galeria/$matches[1]', 'top' );
} );

/* Un solo juego de assets para todo el sitio. La hoja va en prioridad 999 para
   cargar despues de cualquier CSS del tema y poder pisar lo que haga. */
add_action( 'wp_enqueue_scripts', function () {
	$uri = get_template_directory_uri();
	wp_enqueue_style(
		'sireve-fonts',
		'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'sireve', $uri . '/assets/sireve.css', array( 'sireve-fonts' ), '1.0', 'all' );
	wp_enqueue_script( 'sireve', $uri . '/assets/sireve.js', array(), '1.0', true );
}, 999 );

/* En las vistas no hay contenido de bloques: sin el CSS global de WordPress su
   tipografia (Manrope) no se come la nuestra. El resto del sitio no se toca. */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! sireve_is_view() ) {
		return;
	}
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'wp-block-library' );
}, 20 );
`;

const HEADER_PHP = `<?php
/**
 * Apertura del documento. El header del SIREVE (barra, nav y redes) vive dentro
 * de cada vista, generado por build.mjs, para que el preview mida lo mismo que
 * se publica.
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
`;

const FOOTER_PHP = `<?php
/**
 * Cierre del documento. El pie del SIREVE tambien vive en cada vista.
 */
?>
<?php wp_footer(); ?>
</body>
</html>
`;

const TEMPLATE_PHP = `<?php
/**
 * Plantilla de las vistas SIREVE: si la ruta tiene vista generada se pinta esa
 * vista; si no, se pinta lo que tenga la pagina en el editor.
 * Generado por wordpress/build.mjs.
 */
get_header();

if ( ! sireve_render() ) {
	?>
	<div class="page-wrap">
		<div class="page-body">
			<h1 class="page-hero-title"><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</div>
	</div>
	<?php
}

get_footer();
`;

function emitTheme() {
  rmSync(THEME, { recursive: true, force: true });
  const put = (rel, data) => {
    const target = path.join(THEME, rel);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, data, 'utf8');
  };

  put('style.css', THEME_STYLE);
  put('functions.php', FUNCTIONS_PHP);
  put('header.php', HEADER_PHP);
  put('footer.php', FOOTER_PHP);
  put('page.php', TEMPLATE_PHP);
  put('front-page.php', TEMPLATE_PHP);
  put('index.php', TEMPLATE_PHP);

  const map = VIEWS.map((v) => `  '${v.url}' => '${v.file}',`).join('\n');
  put('views/index.php', `<?php\n/* Ruta canonica => vista. Generado por build.mjs: no editar. */\nreturn array(\n${map}\n);\n`);
  for (const v of VIEWS) put(`views/${v.file}`, v.html);

  mkdirSync(path.join(THEME, 'assets', 'images'), { recursive: true });
  copyFileSync(path.join(HERE, 'sireve.css'), path.join(THEME, 'assets', 'sireve.css'));
  copyFileSync(path.join(HERE, 'sireve.js'), path.join(THEME, 'assets', 'sireve.js'));

  for (const rel of [...mediaUsed].sort()) {
    const dst = path.join(THEME, 'assets', 'images', rel);
    mkdirSync(path.dirname(dst), { recursive: true });
    copyFileSync(path.join(IMAGES, rel), dst);
  }

  return { views: VIEWS.length, images: mediaUsed.size };
}

/* ------------------------------------------------------------------ Run */
const written = [
  landing(),
  actas(),
  galeriaIndex(),
  ...YEARS.map(galeriaYear),
  reglamentos(),
  contacto(),
  ...programs.map(programa),
];

rmSync(TMP, { recursive: true, force: true });
console.log(`${written.length} fragmentos escritos en ${HERE}`);
for (const f of written) {
  const size = statSync(path.join(HERE, f)).size;
  console.log(`  - ${f} (${(size / 1024).toFixed(1)} KB)`);
  assertClipIds(readFileSync(path.join(HERE, f), 'utf8'), f);
}

const theme = emitTheme();
console.log(`\ntema escrito en ${path.relative(ROOT, THEME)}`);
console.log(`  - ${theme.views} vistas, ${theme.images} imagenes en assets/images/`);
console.log(`  - base de imagenes: ${MEDIA_BASE}`);

if (process.exitCode) {
  console.error('\nbuild incompleto: revisa los ids de clipPath de arriba');
}
