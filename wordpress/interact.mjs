/* Prueba de interacciones: comprueba el comportamiento de sireve.js sobre el
   preview estatico simulando clics y teclas con la API del DOM.
   El probe (interact-probe.html) se copia al preview y se lee su <pre>.
   Uso: node interact.mjs [ruta] */
import { execFileSync } from 'node:child_process';
import { copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TMP = process.env.TEMP || 'C:\\Users\\INTEL\\AppData\\Local\\Temp';
const BASE = 'http://localhost:8099';

const route = process.argv[2] || null;

/* Chrome deja un perfil de ~15 MB por ejecucion y, si otra instancia anterior
   quedo viva, el perfil compartido da error de bloqueo: por eso el nombre lleva
   el pid y el borrado es best-effort (reintentos, y si falla se ignora). */
function cleanProfile(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* se deja el perfil: 15 MB en TEMP, no rompe nada */
  }
}

/* Rutas a probar: la general siempre; las de galeria y contacto solo si se pide
   una ruta concreta, porque el resto comparte header y carrusel. */
const routes = route
  ? [[route, [1280, 420]]]
  : [['/', [1280, 420]], ['/galeria/2017/', [1280]], ['/contacto/', [1280]], ['/programas/ficcua/', [1280]]];

/* Chrome deja un perfil de ~15 MB por ejecucion: se borra al terminar. */
copyFileSync(join(HERE, 'interact-probe.html'), join(HERE, '.preview', 'interact-probe.html'));

function run(route, width) {
  const profile = join(TMP, 'cprof-interact-' + process.pid);
  cleanProfile(profile);
  let html;
  try {
    html = execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      `--user-data-dir=${profile}`,
      '--window-size=1400,1000', '--virtual-time-budget=10000', '--dump-dom',
      `${BASE}/interact-probe.html?route=${encodeURIComponent(route)}&w=${width}`,
    ], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    cleanProfile(profile);
  }

  const m = /<pre id="report">([\s\S]*?)<\/pre>/.exec(html);
  if (!m) throw new Error(`sin reporte: ${route} @${width}`);
  const raw = m[1]
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return JSON.parse(raw);
}

/* 1280 = escritorio (header completo, carrusel, lightbox, formulario).
   420  = movil (el menu hamburguesa solo existe por debajo del breakpoint). */
for (const [route, widths] of routes) {
  for (const width of widths) {
    const r = run(route, width);
    if (process.env.VERBOSE) console.log(JSON.stringify(r, null, 1));
    const fails = [];
    const walk = (obj, path) => {
      for (const [k, v] of Object.entries(obj)) {
        if (v === false) fails.push([path, k].filter(Boolean).join('.'));
        else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, [path, k].filter(Boolean).join('.'));
      }
    };
    walk(r, '');
    console.log(`${route.padEnd(26)} @${String(width).padEnd(5)} ${fails.length ? 'FALLOS: ' + fails.join(', ') : 'ok'}`);
  }
}