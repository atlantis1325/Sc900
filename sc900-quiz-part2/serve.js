import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dist = join(__dirname, 'dist');
const port = process.env.PORT || 3000;

const mime = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json' };

createServer((req, res) => {
  let file = join(dist, req.url === '/' ? 'index.html' : req.url);
  if (!existsSync(file)) file = join(dist, 'index.html');
  const ext = extname(file);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Listening on port ${port}`));
