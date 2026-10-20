import {cp,mkdir,rm} from 'node:fs/promises';
import {buildBatch} from './batch1-release.mjs';
import {buildBatch3} from './batch3-release.mjs';
// Fail before copying or publishing if any content or review gate is incomplete.
const summary=buildBatch();
const summary3=buildBatch3();
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true,force:true});
console.log('Say More complete Batch 1 build:',summary.total,'approved starters.');
console.log('Say More complete Batch 3 build:',summary3.total,'starters (AI author self-review; independent review pending).');
