import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  try {
    const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const safePath = normalize(requestPath).replace(/^([.][.][\\/])+/, '');
    const filePath = join(root, safePath === '/' ? 'index.html' : safePath);
    const file = await stat(filePath);
    if (!file.isFile()) throw new Error('not a file');
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mime[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(body);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
    }
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Fangsi dossier listening on http://0.0.0.0:${port}`);
});
