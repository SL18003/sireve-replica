/* Busca una regla en el CSS de un paquete y la imprime. Uso:
     node grep-css.mjs <carpeta> <selector-regex> [filtro-texto]
   Se usa para comparar con las reglas de Gravity UI que la replica emula. */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const dir = process.argv[2];
const selRe = new RegExp(process.argv[3] || '.');
const filter = process.argv[4] || '';

const files = [];
const walk = (d) => {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (extname(p) === '.css') files.push(p);
  }
};
walk(dir);

for (const f of files) {
  let text;
  try { text = readFileSync(f, 'utf8'); } catch { continue; }
  if (!text) continue;
  for (const m of text.matchAll(new RegExp(`(?:^|[}\\s,])${selRe.source}[^{}]*\\{[^}]*\\}`, 'g'))) {
    const rule = m[0].replace(/\s+/g, ' ').trim();
    if (filter && !rule.includes(filter)) continue;
    console.log(`${f.replace(/.*node_modules./, '')}\n    ${rule}\n`);
  }
}
