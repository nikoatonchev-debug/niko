// Lokaler Server für die Video-Aufnahme: liefert schuelerfirma/ aus und passt NUR für den Emulator die CSP an.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../../schuelerfirma');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const VROOT = __dirname;
  const isV = p.startsWith('/__video/');
  const f = isV ? path.join(VROOT, p.slice('/__video/'.length)) : path.join(ROOT, p);
  if (!(isV ? f.startsWith(VROOT) : f.startsWith(ROOT)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  let body = fs.readFileSync(f);
  const ext = path.extname(f);
  if (ext === '.html') {
    body = Buffer.from(body.toString('utf8')
      .replace("connect-src 'self'", "connect-src 'self' http://127.0.0.1:8080 http://127.0.0.1:9099")
      .replace('; upgrade-insecure-requests', ''));
  }
  const type = MIME[ext] || (ext === '.webm' ? 'video/webm' : ext === '.mp4' ? 'video/mp4' : 'application/octet-stream');
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (m) {
    const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], body.length - 1) : body.length - 1;
    res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1, 'Cache-Control': 'no-store' });
    return res.end(body.subarray(start, end + 1));
  }
  res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
  res.end(body);
}).listen(8935, '127.0.0.1', () => console.log('testserver on 8935'));
