/* Sonda puntual: imprime estilos calculados de N selectores en una ruta.
   El probe se sirve desde el MISMO origen que la ruta (el iframe es
   same-origin), por eso se copia a public/ y a .preview/.
   Uso: node one.mjs <route> <sel1|sel2|...> [origen1,origen2] [ancho]
        node one.mjs <route> <sel> --tree <raiz> <profundidad> [ancho] */
import { execFileSync } from 'node:child_process';
import { copyFileSync, rmSync } from 'node:fs';
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

const isTree = process.argv[4] === '--tree';
const route = process.argv[2] || '/';
const sels = (process.argv[3] || 'body').split('|').filter(Boolean);
const tree = isTree ? process.argv[5] : '';
const depth = isTree ? process.argv[6] || 3 : 3;
const width = isTree ? process.argv[7] : process.argv[5];
const origins = process.argv[isTree ? 8 : 6]
  ? process.argv[isTree ? 8 : 6].split(',')
  : ['http://localhost:5173', 'http://localhost:8099'];

const probe = join(HERE, 'one-probe.html');
/* El probe tiene que existir en los DOS origenes: public/ lo sirve el dev
   server de React (5173) y .preview/ el de la replica (8099). Si solo se
   copiara en uno, el otro mediria con una version vieja del probe. */
copyFileSync(probe, join(HERE, '.preview', 'one-probe.html'));
copyFileSync(probe, join(HERE, '..', 'public', 'one-probe.html'));

for (const origin of origins) {
  const url = `${origin}/one-probe.html?route=${encodeURIComponent(route)}`
    + `&sel=${encodeURIComponent(sels.join('|'))}`
    + (width ? `&w=${width}` : '')
    + (tree ? `&tree=${encodeURIComponent(tree)}&depth=${depth}` : '');
  /* Chrome crea un perfil de ~15 MB por ejecucion: se borra al terminar. */
  const profile = join(TMP, 'cprof-one-' + Buffer.from(origin).toString('hex').slice(0, 8) + '-' + process.pid);
  let html;
  try {
    html = execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--no-sandbox',
      `--user-data-dir=${profile}`,
      '--virtual-time-budget=9000', '--dump-dom', url,
    ], { maxBuffer: 32 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    cleanProfile(profile);
  }
  const m = html.match(/<pre id="o">([\s\S]*?)<\/pre>/);
  console.log(`\n=== ${origin}${route} ===`);
  console.log(m ? m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : 'sin salida');
}
