import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const NAMES = [
  'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'Bars', 'Xmark',
  'ArrowUpRightFromSquare', 'ArrowRight', 'ArrowLeft',
  'Folder', 'Picture', 'FileText', 'GraduationCap', 'BookOpen', 'Globe',
  'MusicNote', 'Cup', 'Medal', 'HeartPulse', 'Person',
  'MapPin', 'CircleXmark', 'CircleInfo', 'Book',
  'Envelope', 'Geo', 'Smartphone', 'Calendar',
];

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const dir = path.resolve('node_modules/@gravity-ui/icons/esm');

const out = {};
const missing = [];
for (const name of NAMES) {
  const file = path.join(dir, `${name}.js`);
  let mod;
  try {
    mod = await import(pathToFileURL(file).href);
  } catch {
    missing.push(name);
    continue;
  }
  const Cmp = mod.default;
  if (typeof Cmp !== 'function') { missing.push(name); continue; }
  out[kebab(name)] = renderToStaticMarkup(Cmp({ width: 16, height: 16 }));
}

writeFileSync('icons.json', JSON.stringify(out, null, 2));
console.log('OK', Object.keys(out).length, 'faltan:', missing.join(',') || 'ninguno');
console.log('folder ->', out.folder);
console.log('cup    ->', out.cup);
