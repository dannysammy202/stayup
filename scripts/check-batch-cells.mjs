// Quick authoring check for batch source cells: counts, format codes, length and exact duplicates.
// Usage: node scripts/check-batch-cells.mjs content/batch3-direct
import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2]||'content/batch3-direct';
const CODES=new Set(['Q','S','H','C','T']);
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const seen=new Map();let bad=0;
for(const dir of fs.readdirSync(root).sort()){
 const full=path.join(root,dir);if(!fs.statSync(full).isDirectory())continue;
 for(const f of fs.readdirSync(full).filter(f=>f.endsWith('.txt')).sort()){
  const lines=fs.readFileSync(path.join(full,f),'utf8').split('\n').filter(l=>l.trim());
  const issues=[];if(lines.length!==100)issues.push(lines.length+'/100');
  for(const l of lines){const code=l.slice(0,1),text=l.slice(2).trim();
   if(!CODES.has(code)||l[1]!==' ')issues.push('code: '+l);
   if(text.length<18||text.length>240)issues.push('length: '+text);
   if(/—/.test(text))issues.push('em dash: '+text);
   const n=norm(text);if(seen.has(n))issues.push('duplicate of '+seen.get(n)+': '+text);else seen.set(n,dir+'/'+f);}
  if(issues.length){bad++;console.log(dir+'/'+f,issues.slice(0,10));}else console.log(dir+'/'+f,'ok');
 }}
console.log('total unique',seen.size);process.exit(bad?1:0);
