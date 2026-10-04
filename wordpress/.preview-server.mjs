/* Servidor estatico minimo para wordpress/.preview (solo verificacion local). */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '.preview');
const PORT = Number(process.env.PORT || 8099);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(ROOT, pathname);

  if (!pathname.endsWith('/')) {
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  } else {
    file = path.join(file, 'index.html');
  }

  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 ' + pathname);
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`preview en http://localhost:${PORT}/`));
