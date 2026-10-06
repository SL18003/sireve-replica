/* sync-check.mjs — ¿están igual local y servidor?
 *
 *   node wordpress/sync-check.mjs
 *
 * Compara por SHA-1 cada archivo público del tema (vistas HTML, style.css,
 * assets, imágenes) descargado desde https://sireve.csuca.org contra lo que hay
 * en wordpress/sireve-theme/. Los .php no son descargables (WordPress los
 * ejecuta): se validan por comportamiento (SEO renderizado en las 18 rutas).
 *
 * Sale con código 1 si hay cualquier divergencia. Uso:
 *   - después de subir cambios del local al servidor,
 *   - antes de regenerar el ZIP (que lo que subas sea lo que esté en vivo),
 *   - como respaldo periódico de que el servidor no se ha tocado "por fuera".
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.join(HERE, 'sireve-theme');
const LIVE = 'https://sireve.csuca.org/wp-content/themes/sireve-theme';
const SITE = 'https://sireve.csuca.org';
const HEADER_SRC = path.join(HERE, 'header-src.php');

const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

function walk(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, base));
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

/* Descriptions por ruta, extraídas de header-src.php (fuente local del SEO).
   Parsing por líneas: cada clave del mapa empieza en '\t'/... => array(' y
   lleva su 'description' en las líneas siguientes. */
function localDescriptions() {
  const src = readFileSync(HEADER_SRC, 'utf8');
  const map = new Map();
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const key = lines[i].match(/^\t'(\/[^']*)' => array\(/);
    if (!key) continue;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const desc = lines[j].match(/^\s*'description' => '([^']*)'/);
      if (desc) { map.set(key[1], desc[1]); break; }
      if (/^\s*'crumbs'/.test(lines[j])) break;
    }
  }
  return map;
}

const fails = [];
const ok = (msg) => console.log(`  ok   ${msg}`);
const bad = (msg, detail = '') => {
  fails.push(msg);
  console.log(`  DIF  ${msg}${detail ? `\n       ${detail}` : ''}`);
};

console.log('1) Archivos públicos del tema (SHA-1 local vs vivo)');
const files = walk(THEME).filter((f) => !f.endsWith('.php'));
let liveBytes = 0;
for (const rel of files) {
  try {
    const res = await fetch(`${LIVE}/${rel}`);
    if (!res.ok) { bad(rel, `en vivo: HTTP ${res.status}`); continue; }
    const live = Buffer.from(await res.arrayBuffer());
    liveBytes += live.length;
    const local = readFileSync(path.join(THEME, rel));
    if (sha1(live) !== sha1(local)) {
      bad(rel, `en vivo ${live.length}B / local ${local.length}B`);
    }
  } catch (e) {
    bad(rel, String(e));
  }
}
if (!fails.length) ok(`${files.length} archivos idénticos (${(liveBytes / 1024 / 1024).toFixed(1)} MB)`);

console.log('\n2) SEO renderizado en las 18 rutas (valida header.php en vivo)');
const desc = localDescriptions();
const routes = [...desc.keys()];
if (routes.length !== 18) bad('header-src.php', `solo ${routes.length} rutas en el mapa (esperadas 18)`);
for (const route of routes) {
  try {
    const res = await fetch(SITE + route, { redirect: 'manual' });
    if (res.status !== 200) { bad(route, `HTTP ${res.status}`); continue; }
    const html = await res.text();
    const problems = [];
    if (!html.includes(`<meta name="description" content="${desc.get(route)}"`)) problems.push('description');
    if (!html.includes('property="og:title"')) problems.push('og:title');
    if (!html.includes('name="twitter:card"')) problems.push('twitter:card');
    if (!html.includes('rel="canonical"')) problems.push('canonical');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    const parsed = ld.map((b) => { try { JSON.parse(b.replace(/<\/?script[^>]*>/g, '')); return true; } catch { return false; } });
    if (ld.length < 3) problems.push(`JSON-LD solo ${ld.length}/3`);
    else if (parsed.includes(false)) problems.push('JSON-LD no parsea');
    if (problems.length) bad(route, problems.join(', '));
  } catch (e) {
    bad(route, String(e));
  }
}
if (!fails.length) ok('18/18 rutas con description + OG + Twitter + canonical + 3 JSON-LD');

/* Spot-check: campos del header-src.php que deben salir idénticos en vivo. */
{
  const html = await (await fetch(SITE + '/')).text();
  const expect = [
    ['"telephone":"+502-2502-7500"', 'Organization telephone'],
    ['"email":"sg@csuca.org"', 'Organization email'],
    ['"parentOrganization"', 'Organization parent'],
    ['summary_large_image', 'twitter:card'],
    ['assets/images/hero-sicevaes.jpg', 'og:image'],
    ['"inLanguage":"es"', 'WebSite inLanguage'],
  ];
  const missing = expect.filter(([needle]) => !html.includes(needle)).map(([, label]) => label);
  if (missing.length) bad('home header.php', `no se ve: ${missing.join(', ')}`);
  else ok('header.php vivo = header-src.php (Organization/WebSite/og:image)');
}

console.log('\n3) Comportamiento clave');
const checks = [
  ['/galeria/2017/', 200, 'regla de rewrite (sin 301 a /galeria/)'],
  ['/galeria/2025/', 200, 'año sin página en la BD (intercept de functions.php)'],
  ['/programas/noexiste/', 404, 'ruta inexistente'],
  ['/wp-sitemap.xml', 200, 'sitemap'],
  ['/robots.txt', 200, 'robots'],
];
for (const [route, want, label] of checks) {
  try {
    const res = await fetch(SITE + route, { redirect: 'manual' });
    if (res.status === want) ok(`${route} -> ${res.status} (${label})`);
    else bad(route, `HTTP ${res.status}, esperado ${want}`);
  } catch (e) {
    bad(route, String(e));
  }
}
const robots = await (await fetch(`${SITE}/robots.txt`)).text();
if (robots.includes('wp-sitemap.xml')) ok('robots.txt apunta al sitemap');
else bad('robots.txt', 'no menciona wp-sitemap.xml');

console.log('\n4) Nota: functions.php / header.php / footer.php / page.php no se');
console.log('   pueden descargar (WordPress los ejecuta). header.php se valida por');
console.log('   su salida (paso 2); los demás, regenerados desde las fuentes locales.');

if (fails.length) {
  console.log(`\nSINCRONIZADOS: NO — ${fails.length} divergencia(s):`);
  for (const f of fails) console.log(`  - ${f}`);
  process.exitCode = 1;
} else {
  console.log('\nSINCRONIZADOS: SI — local y servidor coinciden.');
}
