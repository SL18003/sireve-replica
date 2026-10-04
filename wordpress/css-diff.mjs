/* ============================================================================
   SIREVE · CSUCA — comparacion de declaraciones CSS: fuente React vs sireve.css
   ----------------------------------------------------------------------------
   Uso:  node wordpress/css-diff.mjs [selector...]

   Parsea los CSS de la replica React y los contrasta con wordpress/sireve.css,
   declaracion por declaracion, en los selectores que existen en ambos. Sirve
   para detectar divergencias que a ojo no se ven (un px de padding, un
   line-height, un color de borde).

   Los valores con var(--x) se resuelven contra el bloque :root de src/index.css
   para poder compararlos con los valores ya "horneados" de sireve.css.
   ============================================================================ */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const SOURCES = [
  'src/index.css',
  'src/components/Layout/Header.css',
  'src/components/Layout/Footer.css',
  'src/components/Layout/SocialLinks.css',
  'src/components/Layout/Sidebar.css',
  'src/pages/LandingPage.css',
  'src/pages/Actas.css',
  'src/pages/Galeria.css',
  'src/pages/Programa.css',
  'src/pages/Reglamentos.css',
  'src/pages/Contacto.css',
  'src/components/Gallery/GalleryAlbum.css',
];

/* Quita comentarios y @media anidados, conservando el contexto del media. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/* Parsea CSS plano -> Map<clave, {props, media}> */
function parse(css) {
  const out = new Map();
  const re = /@media([^{]*)\{([\s\S]*?)\n\}/g;
  let match;
  while ((match = re.exec(css))) {
    const cond = match[1].trim().replace(/\s+/g, ' ');
    collect(out, match[2], `@media ${cond}`);
  }
  /* lo que queda fuera de los @media */
  const withoutMedia = css.replace(re, '');
  collect(out, withoutMedia, null);
  return out;
}

function collect(out, css, media) {
  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const selectors = m[1]
      .split(',')
      .map((s) => s.trim().replace(/\s+/g, ' '))
      .filter((s) => s && !s.startsWith('@'));
    const body = m[2];
    if (!body.trim()) continue;
    for (const sel of selectors) {
      const key = media ? `${sel}  @${media}` : sel;
      if (!out.has(key)) out.set(key, {});
      const props = out.get(key);
      for (const decl of body.split(';')) {
        const idx = decl.indexOf(':');
        if (idx < 0) continue;
        const prop = decl.slice(0, idx).trim().toLowerCase();
        const value = decl.slice(idx + 1).trim();
        if (!prop || prop.startsWith('--')) continue;
        props[prop] = value;
      }
    }
  }
}

/* Resuelve var(--x) contra los tokens de :root. `selector` permite leer otro
   bloque (los tokens que sireve.css declara dentro de .sireve). */
function tokenMap(css, selector = ':root') {
  const tokens = new Map();
  const rootRe = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^{]*\\{([\\s\\S]*?)\\}', 'g');
  let m;
  while ((m = rootRe.exec(css))) {
    for (const decl of m[1].split(';')) {
      const idx = decl.indexOf(':');
      if (idx < 0) continue;
      const name = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim();
      if (name.startsWith('--')) tokens.set(name, value);
    }
  }
  return tokens;
}

function resolve(value, tokens, depth = 0) {
  if (depth > 6) return value;
  let out = value;
  let changed = false;
  out = out.replace(/var\((--[\w-]+)\)/g, (_, name) => {
    const v = tokens.get(name);
    if (v === undefined) return _;
    changed = true;
    return v;
  });
  if (!changed) return out;
  return resolve(out, tokens, depth + 1);
}

const norm = (v) =>
  String(v)
    .replace(/\s*!important/g, '')
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .replace(/\(\s*/g, '(')
    .replace(/\s*\)/g, ')')
    .trim()
    .toLowerCase();

/* Propiedades donde el prefijo de proveedor o el orden no significan nada. */
const SKIP = new Set([
  '-webkit-text-size-adjust', '-webkit-font-smoothing', 'box-sizing',
  'color-scheme', 'accent-color', 'caret-color', 'scroll-margin',
]);

const indexCss = readFileSync(path.join(ROOT, 'src/index.css'), 'utf8');
const tokens = tokenMap(indexCss);

/* sireve.css no depende de Gravity, asi que sus "--sireve-*" ya traen el valor
   horneado de los "--g-color-*" de Gravity. Se mapean para que el resolvedor
   de los dos lados termine en el mismo color y no se reporten como diferencias
   los alias que son intencionalmente el mismo valor. */
const sireveTokens = tokenMap(stripComments(readFileSync(path.join(HERE, 'sireve.css'), 'utf8')), '.sireve');
const GRAVITY_ALIAS = {
  '--g-color-base-background': '--sireve-bg',
  '--g-color-base-float': '--sireve-float',
  '--g-color-base-generic': '--sireve-generic',
  '--g-color-base-generic-hover': '--sireve-hover',
  '--g-color-base-simple-hover': '--sireve-hover',
  '--g-color-line-generic': '--sireve-line',
  '--g-color-line-generic-hover': '--sireve-line-hover',
  '--g-color-line-generic-active': '--sireve-line-active',
  '--g-color-text-primary': '--sireve-text-primary',
  '--g-color-text-secondary': '--sireve-text-secondary',
  '--g-color-text-hint': '--sireve-text-hint',
  '--g-color-line-focus': '--sireve-focus',
};
for (const [gravity, sireve] of Object.entries(GRAVITY_ALIAS)) {
  const value = sireveTokens.get(sireve);
  if (value) tokens.set(gravity, value);
  else console.warn(`aviso: alias ${gravity} -> ${sireve} no encontrado en .sireve`);
}
/* los tokens propios tambien se resuelven, para comparar color con color */
for (const [name, value] of sireveTokens) tokens.set(name, value);

/* Diferencias que el replica resuelve a proposito y el contraste debe ignorar:
   - .fade-section arranca visible (el reveal lo aplica sireve.js al hacer scroll);
   - los botones de Gravity tenian su propio fondo con !important y aqui el
     boton es un <a>/<button> propio con el shorthand `background`. */
const INTENTIONAL = new Map([
  ['.fade-section', new Set(['opacity', 'transform', 'transition'])],
]);
const SHORTHAND_OK = new Set(['background', 'background-color']);

const source = new Map();
for (const rel of SOURCES) {
  const parsed = parse(stripComments(readFileSync(path.join(ROOT, rel), 'utf8')));
  for (const [sel, props] of parsed) {
    /* el archivo de la replica gana si dos (mismos selectores) */
    if (!source.has(sel)) source.set(sel, props);
  }
}

/* sireve.css escribe todos los selectores con el prefijo de aislamiento
   ".sireve ". Para comparar se quita ese prefijo (salvo cuando el selector ya
   es de la clase bloque, ".sireve" a secas). */
const parsedTarget = parse(stripComments(readFileSync(path.join(HERE, 'sireve.css'), 'utf8')));
const target = new Map();
for (const [sel, props] of parsedTarget) {
  const bare = sel.replace(/\.sireve\s+/g, '').trim();
  const key = bare === '.sireve' ? sel : bare;
  if (!target.has(key)) target.set(key, props);
}

const only = process.argv.slice(2);
const wants = (sel) => !only.length || only.some((o) => sel.includes(o));

let diffs = 0;
const missing = [];
const mediaOnly = [];

for (const [sel, srcProps] of source) {
  if (!wants(sel)) continue;
  /* las reglas dentro de @media se omiten del contraste: los breakpoints se
     combinaron y el orden de cascada no se puede comparar por selector. */
  if (sel.includes('@media')) {
    const bareMedia = sel.split('  @media')[0];
    if (!parsedTarget.has(sel) && !parsedTarget.has(bareMedia) && !target.has(sel)) {
      if (!mediaOnly.includes(sel)) mediaOnly.push(sel);
    }
    continue;
  }

  const tgtProps = target.get(sel);
  if (!tgtProps) {
    missing.push(sel);
    continue;
  }

  const ignore = INTENTIONAL.get(sel) || new Set();
  const problems = [];
  for (const [prop, value] of Object.entries(srcProps)) {
    if (SKIP.has(prop) || ignore.has(prop)) continue;
    if (!(prop in tgtProps)) {
      /* si el destinoDefine el shorthand equivalente no es una falta real */
      if (SHORTHAND_OK.has(prop) && prop in tgtProps) continue;
      problems.push(`falta  ${prop}: ${value}`);
      continue;
    }
    const a = norm(resolve(value, tokens));
    const b = norm(resolve(tgtProps[prop], tokens));
    if (a !== b) problems.push(`${prop}: React "${a}"  vs  estatico "${b}"`);
  }

  /* props que sireve.css agrega y la fuente no tiene */
  for (const prop of Object.keys(tgtProps)) {
    if (SKIP.has(prop) || ignore.has(prop)) continue;
    if (!(prop in srcProps)) problems.push(`extra  ${prop}: ${tgtProps[prop]}`);
  }

  if (problems.length) {
    diffs++;
    console.log(`\n${sel}`);
    for (const p of problems) console.log(`    ${p}`);
  }
}

console.log(`\n${diffs} selectores con diferencias; ${missing.length} selectores de la fuente ausentes en sireve.css`);
if (missing.length) {
  console.log('\n--- ausentes (revisar si aplican) ---');
  for (const sel of missing) console.log(`  ${sel}`);
}
console.log(`\n(${mediaOnly.length} reglas de @media omitidas del contraste)`);
