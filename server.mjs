import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import generate from './api/ai/generate.js';
import health from './api/health.js';
try{process.loadEnvFile('.env')}catch{}
const ROOT=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/health')return health(req,res);
  if(url.pathname==='/api/ai/generate')return generate(req,res);
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}
  const rel=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const abs=path.resolve(ROOT,rel);
  if(!abs.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end()}
  if(!(await stat(abs)).isFile()){res.writeHead(404);return res.end()}
  const data=await readFile(abs);res.writeHead(200,{'Content-Type':TYPES[path.extname(abs)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found')}
});
server.listen(Number(process.env.PORT||4173),()=>console.log('Say More listening'));
