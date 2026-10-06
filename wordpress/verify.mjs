/* ============================================================================
   SIREVE Â· CSUCA â€” verificacion automatica de los fragmentos
   ----------------------------------------------------------------------------
   Uso:  node wordpress/verify.mjs [ancho...]

   Requiere el sitio de prueba servido (node wordpress/.preview-server.mjs, que
   corre en el puerto 8099) y el generador ejecutado antes:
     node wordpress/build.mjs
     node wordpress/preview.mjs

   Abre la sonda con Chrome headless en cada ruta y ancho, y resume lo que
   importa: desbordamiento horizontal, enlaces activos, dropdowns, imagenes
   rotas, iconos, albums y lightbox.
   ============================================================================ */

import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:8099';
const USER_DIR = path.join(HERE, '.chrome-profile-' + process.pid);

/* Chrome puede seguir con el perfil abierto al salir y en Windows eso produce
   EPERM; se reintenta y si aun así falla se ignora (ver interact.mjs). */
function cleanProfile(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* perfil sobrante */
  }
}

const ROUTES = [
  '/',
  '/actas/',
  '/galeria/',
  '/galeria/2017/',
  '/galeria/2018/',
  '/galeria/2019/',
  '/galeria/2020/',
  '/galeria/2023/',
  '/galeria/2024/',
  '/galeria/2025/',
  '/reglamentos/',
  '/contacto/',
  '/programas/ficcua/',
  '/programas/juduca/',
  '/programas/premio-ruben-dario/',
  '/programas/promotoras-salud/',
  '/programas/voluntariado/',
];

const widths = process.argv.slice(2).map(Number).filter(Boolean);
const SIZES = widths.length ? widths : [1280, 375];

function probe(route, width) {
  const url = `${BASE}/probe.html?route=${encodeURIComponent(route)}&w=${width}`;
  const out = execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--user-data-dir=${USER_DIR}`,
      '--virtual-time-budget=9000',
      `--window-size=${width},900`,
      '--dump-dom',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const m = /<pre id="report">([\s\S]*?)<\/pre>/.exec(out);
  if (!m) throw new Error(`la sonda no respondio para ${route} @${width}`);
  return JSON.parse(m[1]);
}

const pad = (s, n) => String(s).padEnd(n);
let problems = 0;

for (const width of SIZES) {
  console.log(`\n=== ancho ${width}px ===`);
  console.log(pad('ruta', 32) + pad('ovf', 5) + pad('logo', 6) + pad('marca', 7) + pad('iconos', 8) + pad('img/broken', 12) + pad('albums', 8) + 'notas');

  for (const route of ROUTES) {
    let r;
    try {
      r = probe(route, width);
    } catch (error) {
      problems++;
      console.log(pad(route, 32) + `ERROR ${error.message}`);
      continue;
    }

    const notes = [];
    if (r.overflowX > 0) notes.push(`OVERFLOW-X +${r.overflowX}px`);
    if (!r.logoAlt || r.logoAlt < 100) notes.push('logo no cargo');
    if (r.imgsRotas?.length) notes.push(`imagenes rotas: ${r.imgsRotas.length}`);
    if (r.widgetkit) notes.push(`${r.widgetkit} img cache/widgetkit (404 -> fallback)`);
    if (r.dropdownToggles && !r.dropdowns?.every(Boolean)) notes.push('dropdown abierto al cargar');
    if (!r.navActivo?.length) notes.push('ningun enlace de nav activo');
    if (!r.anoFooter) notes.push('ano de footer vacio');
    if (!r.montserrat) notes.push('Montserrat no cargo');
    if (r.lightbox && !r.lightbox.title) notes.push('lightbox sin pie');
    if (r.albums && !r.primerAlbum?.fotos) notes.push('album sin fotos parseables');
    if (notes.length) problems++;

    console.log(
      pad(route, 32) +
        pad(r.overflowX, 5) +
        pad(r.logoAlt > 0 ? 'ok' : 'NO', 6) +
        pad(r.brandTextVisible ? 'si' : 'no', 7) +
        pad(r.svg, 8) +
        pad(`${r.imgs}/${r.imgsRotas.length}`, 12) +
        pad(r.albums, 8) +
        (notes.join('; ') || 'ok'),
    );
  }
}

console.log(problems ? `\n${problems} filas con observaciones.` : '\nTodo limpio.');

/* Chrome deja un perfil de ~15 MB; se borra para no acumular basura en TEMP. */
cleanProfile(USER_DIR);
