import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TMP = process.env.TEMP || 'C:\\Users\\INTEL\\AppData\\Local\\Temp';

/* Chrome puede seguir con el perfil abierto al salir y en Windows eso produce
   EPERM; se reintenta y si aun así falla se ignora (ver interact.mjs). */
function cleanProfile(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* perfil sobrante: 15 MB en TEMP */
  }
}

const PROBES = [
  { id: 'home', origin: 'http://localhost:5173', route: '/' },
  { id: 'actas', origin: 'http://localhost:5173', route: '/actas/' },
  { id: 'prog', origin: 'http://localhost:5173', route: '/programas/ficcua/' },
  { id: 'galeria', origin: 'http://localhost:5173', route: '/galeria/' },
  { id: 'contacto', origin: 'http://localhost:5173', route: '/contacto/' },
  { id: 'reglamentos', origin: 'http://localhost:5173', route: '/reglamentos/' },
  { id: 'shome', origin: 'http://localhost:8099', route: '/' },
  { id: 'sactas', origin: 'http://localhost:8099', route: '/actas/' },
  { id: 'sprog', origin: 'http://localhost:8099', route: '/programas/ficcua/' },
  { id: 'sgaleria', origin: 'http://localhost:8099', route: '/galeria/' },
  { id: 'scontacto', origin: 'http://localhost:8099', route: '/contacto/' },
  { id: 'sreglamentos', origin: 'http://localhost:8099', route: '/reglamentos/' },
];

const PAIRS = [
  ['home', 'shome'],
  ['actas', 'sactas'],
  ['prog', 'sprog'],
  ['galeria', 'sgaleria'],
  ['contacto', 'scontacto'],
  ['reglamentos', 'sreglamentos'],
];

/* el mismo probe debe servirse desde los dos origenes: el iframe es same-origin */
const probeSrc = join(ROOT, 'public', 'scale-probe.html');
if (!existsSync(probeSrc)) {
  console.error('falta public/scale-probe.html');
  process.exit(1);
}
copyFileSync(probeSrc, join(HERE, '.preview', 'scale-probe.html'));

const report = (id, origin, route) => {
  const url = `${origin}/scale-probe.html?route=${encodeURIComponent(route)}`;
  /* Chrome crea un perfil de ~15 MB por ejecucion y esta pasada lanza 12: sin
     borrarlo al terminar, repeats llenan el disco. */
  const profile = join(TMP, 'cprof-scale-' + id + '-' + process.pid);
  let html;
  try {
    html = execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--no-sandbox',
      `--user-data-dir=${profile}`,
      '--virtual-time-budget=9000', '--dump-dom', url,
    ], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    cleanProfile(profile);
  }
  const m = html.match(/<pre id="report">([\s\S]*?)<\/pre>/);
  if (!m) throw new Error(`sin reporte: ${url}`);
  const text = m[1]
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const map = new Map();
  for (const line of text.split('\n')) {
    const i = line.indexOf(' -> ');
    if (i === -1) continue;
    map.set(line.slice(0, i).trim(), line.slice(i + 4).trim());
  }
  return map;
};

/* Solo lo que define caja y tipo. padding y font-family se omiten a proposito:
   los <button> nativos conservan el UA de Chrome en React (Arial 13.33) y el
   .sireve los normaliza a Montserrat; esas diferencias son intencionadas y no
   cambian el resultado visual porque esos botones solo contienen SVG. */
const FIELDS = ['font', 'w', 'ls', 'display'];

const pick = (value) => FIELDS.map((f) => {
  const m = value.match(new RegExp('(?:^|[ ;])' + f + ' ([^;]+)'));
  return m ? `${f}=${m[1].trim()}` : null;
}).filter(Boolean).join(' ');

let total = 0;
let bad = 0;
const reportLines = [];

for (const [a, b] of PAIRS) {
  const pa = PROBES.find((p) => p.id === a);
  const pb = PROBES.find((p) => p.id === b);
  let ma, mb;
  try {
    ma = report(a, pa.origin, pa.route);
    mb = report(b, pb.origin, pb.route);
  } catch (err) {
    console.log(`\n[${a}] ERROR ${err.message}`);
    continue;
  }
  const diffs = [];
  for (const [sel, va] of ma) {
    if (!vb(mb, sel)) continue; /* el elemento no existe en la replica */
    const fa = pick(va);
    const fb = pick(vb(mb, sel));
    if (fa === fb) continue;
    /* diferencias de fuente en <button> nativos: Gravity deja el UA default */
    const changed = [];
    for (const f of FIELDS) {
      const va2 = (va.match(new RegExp('(?:^|[ ;])' + f + ' ([^;]+)')) || [])[1];
      const vb2 = (vb(mb, sel).match(new RegExp('(?:^|[ ;])' + f + ' ([^;]+)')) || [])[1];
      if (va2 && vb2 && va2.trim() !== vb2.trim()) changed.push(`${f}: "${va2.trim()}" vs "${vb2.trim()}"`);
    }
    diffs.push({ sel, changed });
  }
  total += ma.size;
  bad += diffs.length;
  reportLines.push(`\n=== ${pa.route} (${diffs.length} selectores) ===`);
  for (const d of diffs) {
    reportLines.push(`  ${d.sel}`);
    for (const c of d.changed) reportLines.push(`      ${c}`);
  }
}

function vb(map, sel) { return map.get(sel); }

console.log(reportLines.join('\n'));
console.log(`\n${total} selectores comparados, ${bad} con diferencias de caja/tipo`);
