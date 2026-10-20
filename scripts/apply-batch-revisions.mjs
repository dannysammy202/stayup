// Apply logged editorial revisions to Batch 3 source cells.
// Each revision names its cell line, the exact old text and the replacement text, so a stale
// or mistaken revision fails instead of silently changing the wrong line.
// Usage: node scripts/apply-batch3-revisions.mjs content/batch3-direct/revisions/<file>.json
import fs from 'node:fs';
const ROOT=(process.argv[3]||'content/batch3-direct').replace(/\/?$/,'/');
const file=process.argv[2];
const log=JSON.parse(fs.readFileSync(file,'utf8'));
const byFile=new Map();
for(const r of log.revisions){const [cell,line]=r.ref.split(':');(byFile.get(cell)||byFile.set(cell,[]).get(cell)).push({...r,line:+line});}
let applied=0;
for(const [cell,revs] of byFile){
 const path=ROOT+cell+'.txt';
 const lines=fs.readFileSync(path,'utf8').split('\n').filter(l=>l.trim());
 for(const r of revs){
  const cur=lines[r.line-1];if(!cur)throw Error('No line '+r.ref);
  const text=cur.slice(2).trim();
  if(text===r.new.slice(2).trim())continue; // already applied
  if(text!==r.old)throw Error('Stale revision '+r.ref+': found "'+text+'"');
  if(!/^[QSHCT] /.test(r.new))throw Error('Revision needs a format code '+r.ref);
  lines[r.line-1]=r.new;applied++;
 }
 fs.writeFileSync(path,lines.join('\n')+'\n');
}
console.log('applied',applied,'of',log.revisions.length);
