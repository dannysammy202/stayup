import {cp,mkdir,rm} from 'node:fs/promises';
import {buildBatch} from './batch1-release.mjs';
// Fail before copying or publishing if any content or review gate is incomplete.
const summary=buildBatch();
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true,force:true});
console.log('Say More complete Batch 1 build:',summary.total,'approved starters.');
