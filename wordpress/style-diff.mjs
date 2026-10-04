/* ============================================================================
   SIREVE · CSUCA — comparacion de estilos: replica React vs fragmentos
   ----------------------------------------------------------------------------
   Uso:  node wordpress/style-diff.mjs [ancho] [ruta...]

   Mide los MISMOS selectores en la app React (localhost:5173) y en los
   fragmentos estaticos (localhost:8099), y reporta donde difieren los estilos
   calculados. Es la forma objetiva de comprobar que el CSS estatico reproduce el
   diseno sin tener que comparar capturas a ojo.

   Requiere: `npm run dev` (5173) y `node wordpress/.preview-server.mjs` (8099).
   ============================================================================ */

import { execFileSync } from 'node:child_process';
import { cpSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REACT = 'http://localhost:5173';
const STATIC = 'http://localhost:8099';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = path.join(HERE, '.chrome-profile');

const ROUTES = [
  '/',
  '/actas/',
  '/galeria/',
  '/galeria/2019/',
  '/reglamentos/',
  '/contacto/',
  '/programas/ficcua/',
];

const argv = process.argv.slice(2);
const numeric = argv.filter((a) => /^\d+$/.test(a)).map(Number);
const routes = argv.filter((a) => !/^\d+$/.test(a));
const WIDTHS = numeric.length ? numeric : [1280];
const ROUTE_LIST = routes.length ? routes : ROUTES;

/* props cuyo orden de cascada depende del DOM y no del diseno: se ignoran */
const IGNORE_PROPS = new Set(['zIndex']);

mkdirSync(path.join(HERE, '..', 'public'), { recursive: true });
mkdirSync(path.join(HERE, '.preview'), { recursive: true });
cpSync(path.join(HERE, 'style-probe.html'), path.join(HERE, '.preview', 'style-probe.html'));
cpSync(path.join(HERE, 'style-probe.html'), path.join(HERE, '..', 'public', 'style-probe.html'));

function probe(origin, route, width) {
  const url = `${origin}/style-probe.html?route=${encodeURIComponent(route)}&w=${width}`;
  const out = execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--user-data-dir=${PROFILE}`,
      '--virtual-time-budget=12000',
      `--window-size=${width},1000`,
      '--dump-dom',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const m = /<pre id="report">([\s\S]*?)<\/pre>/.exec(out);
  if (!m) throw new Error(`sin respuesta de ${origin}${route} @${width}`);
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
}

const same = (a, b) => {
  const norm = (v) =>
    String(v)
      .replace(/\s+/g, ' ')
      .replace(/,\s*/g, ',')
      .trim()
      .toLowerCase();
  return norm(a) === norm(b);
};

/* El rect se compara con tolerancia: el texto puede diferir 1-2px entre el
   markup de React y el estatico (mismos estilos, distinta envoltura). */
const rectClose = (a, b) => Math.abs(a - b) <= 2;

let totalDiffs = 0;

for (const width of WIDTHS) {
  console.log(`\n################  ancho ${width}px  ################`);

  for (const route of ROUTE_LIST) {
    let reactStyles, staticStyles;
    try {
      reactStyles = probe(REACT, route, width);
      staticStyles = probe(STATIC, route, width);
    } catch (error) {
      console.log(`\n${route} @${width} -> ERROR ${error.message}`);
      totalDiffs++;
      continue;
    }

    const onlyReact = Object.keys(reactStyles).filter((k) => !(k in staticStyles));
    const onlyStatic = Object.keys(staticStyles).filter((k) => !(k in reactStyles));
    const shared = Object.keys(reactStyles).filter((k) => k in staticStyles);

    const diffs = [];
    for (const sel of shared) {
      const a = reactStyles[sel];
      const b = staticStyles[sel];
      const props = new Set([...Object.keys(a), ...Object.keys(b)]);
      const changed = [];
      for (const p of props) {
        if (IGNORE_PROPS.has(p) || p === 'rect' || p === 'tag') continue;
        if (!same(a[p], b[p])) changed.push(`${p}: React "${a[p] ?? '-'}" vs estatico "${b[p] ?? '-'}"`);
      }
      if (!rectClose(a.rect[0], b.rect[0]) || !rectClose(a.rect[1], b.rect[1])) {
        changed.push(`tamano: React ${a.rect[0]}x${a.rect[1]} vs estatico ${b.rect[0]}x${b.rect[1]}`);
      }
      if (changed.length) diffs.push([sel, changed]);
    }

    totalDiffs += diffs.length + onlyReact.length + onlyStatic.length;
    const status = diffs.length || onlyReact.length || onlyStatic.length ? 'DIFIERE' : 'identico';
    console.log(`\n${route} @${width} -> ${status}  (${shared.length} selectores comparados)`);

    for (const sel of onlyReact) console.log(`  solo en React:   ${sel}`);
    for (const sel of onlyStatic) console.log(`  solo en estatico: ${sel}`);
    for (const [sel, changed] of diffs) {
      console.log(`  ${sel}`);
      for (const c of changed) console.log(`      ${c}`);
    }
  }
}

console.log(`\n${totalDiffs ? totalDiffs + ' diferencias en total' : 'Sin diferencias.'}`);
