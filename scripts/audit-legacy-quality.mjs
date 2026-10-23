import fs from 'node:fs';
import path from 'node:path';

/**
 * Deterministic triage only. A flag is not proof of bad writing;
 * passing this audit is not proof of editorial quality.
 * Never remove, re-tag as approved, or hide users' saved IDs automatically.
 */
export const normalise = input => String(input||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export const GENERIC_STEMS = [
  /\bwhat is your view on\b/i,
  /\bwhat do people overlook about\b/i,
  /\bthinking about your own experience\b/i,
  /\bduring a conversation with\b/i,
  /\bin a (?:chill|playful|curious|deep|flirty|bold) conversation\b/i,
  /\bclosest real life story\b/i,
  /\bhow would you discuss\b/i
];
export function assess(rows) {
 const byText=new Map();
 const beginnings=new Map();
 const sources={};
 const flagged=[];
 let total=0;
 for(const source of rows){
  const stats={total:0,formats:{},genericStem:0,veryShort:0,missingAngles:0,exactDuplicate:0,repeatedLead:0};
  sources[source.name]=stats;
  for(const entry of source.items){
   stats.total++;total++;
   const text=String(entry.text||'').trim(),clean=normalise(text);
   const id=entry.id||'(missing id)';
   const signals=[];
   stats.formats[entry.format||'(unspecified)']=(stats.formats[entry.format||'(unspecified)']||0)+1;
   if(GENERIC_STEMS.some(re=>re.test(text))){signals.push('generic-stem');stats.genericStem++;}
   if(clean.length<28){signals.push('very-short');stats.veryShort++;}
   if(!Array.isArray(entry.angles)||entry.angles.length===0){signals.push('no-continuations');stats.missingAngles++;}
   const previous=byText.get(clean);
   if(previous){signals.push('exact-duplicate');stats.exactDuplicate++;}
   else if(clean)byText.set(clean,id);
   const lead=clean.split(' ').slice(0,7).join(' ');
   if(lead.split(' ').length===7){const old=beginnings.get(lead)||[];old.push({source:source.name,id});beginnings.set(lead,old);}
   if(signals.length)flagged.push({source:source.name,id,signals});
  }
 }
 // Frequent identical introductions are review candidates, not automatically rejected.
 for(const ids of beginnings.values())if(ids.length>=7){
  for(const {source,id} of ids){sources[source].repeatedLead++;const f=flagged.find(f=>f.source===source&&f.id===id);if(f)f.signals.push('repeated-opening');else flagged.push({source,id,signals:['repeated-opening']});}
 }
 const uniqueFlagged=new Set(flagged.map(f=>f.source+':'+f.id));
 return {method:'heuristic-triage-not-human-review',total,flaggedCount:uniqueFlagged.size,sources,sample:flagged.slice(0,40)};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 const files=['batch1','batch3','batch4'];
 const input=files.map(name=>({name,items:JSON.parse(fs.readFileSync(path.resolve('content/'+name+'.json'),'utf8'))}));
 const report=assess(input);
 if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
 else{
  console.log('Say More legacy content triage (heuristics only, not human-reviewed)');
  console.log('Read '+report.total.toLocaleString()+' records; '+report.flaggedCount.toLocaleString()+' candidate records flagged for review.');
  for(const [batch,stats]of Object.entries(report.sources))console.log(batch+': '+JSON.stringify(stats));
  console.log('Flag examples (ID only): '+JSON.stringify(report.sample.slice(0,12)));
 }
}
