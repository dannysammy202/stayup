import {readFileSync} from 'node:fs';
import {validateCuratedLibrary} from './validate-curated-library.mjs';
const m=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const summary=validateCuratedLibrary('.');
const full=m.combinations.filter(c=>c.eligible&&c.active===50);
const excluded=m.combinations.filter(c=>!c.eligible);
if(full.length!==696||excluded.length!==102||excluded.some(c=>c.published!==0)||m.activePolicy.activeCount!==34800||m.activePolicy.remainingToTarget!==0||m.activePolicy.archivedCount!==9650||m.publishedCount!==44450||summary.uniqueIds!==44450||summary.uniqueText!==44450)throw new Error('Say More active release gate failed');
console.log(JSON.stringify({active:m.activePolicy.activeCount,eligible:full.length,excluded:excluded.length,archived:m.activePolicy.archivedCount,unreviewed:m.aiAuthoredScreenedCount,unique:summary.uniqueText},null,2));
