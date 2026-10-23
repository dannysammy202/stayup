import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { validateCuratedLibrary } from '../scripts/validate-curated-library.mjs';

const report=validateCuratedLibrary();
const manifest=JSON.parse(readFileSync('public/library-data/manifest.json','utf8'));
const html=readFileSync('public/index.html','utf8');

test('all 798 combinations are tracked with 696 eligible and 102 excluded',()=>{
 assert.equal(report.target,139200);
 assert.equal(report.eligible,696);
 assert.equal(report.excluded,102);
 assert.equal(manifest.combinations.length,798);
 assert.equal(manifest.combinations.filter(x=>x.eligible).length,696);
 assert.equal(manifest.combinations.filter(x=>!x.eligible).length,102);
 assert.equal(manifest.combinations.reduce((n,c)=>n+c.target,0),139200);
 assert.equal(manifest.targetPerCombination,200);
});

test('entire published catalogue validates against files and honest review metadata',()=>{
 assert.equal(report.published,manifest.publishedCount);
 assert.equal(report.uniqueIds,report.published);
 assert.equal(report.uniqueText,report.published);
 assert.equal(report.approved,manifest.humanReviewedCount);
 assert.equal(report.awaitingReview,manifest.aiAuthoredScreenedCount);
 assert.equal(report.approved+report.awaitingReview,report.published);
 assert.equal(report.covered,manifest.coverageCount);
 assert.equal(report.remaining,manifest.remainingToTarget);
 assert.equal(report.covered+report.remaining,report.target);
 assert.equal(report.files,manifest.publishedFiles.length);
 assert.equal(report.publishedCombinations,manifest.publishedCollections.length);
 assert.equal(report.fullyPopulated,manifest.combinations.filter(c=>c.eligible&&c.published>=c.target).length);
 assert.ok(report.formats.length>=6);
});

test('app exposes incremental browsing rather than cutting off at 72 prompts',()=>{
 assert.match(html,/return matches;/);
 assert.doesNotMatch(html,/matches\.length<=72/);
 assert.match(html,/data-action="loadMore"/);
 assert.match(html,/state\.feedVisible\+=state\.view==='browse'\?12:48/);
 assert.match(html,/pool\.slice\(0,state\.feedVisible\)/);
 assert.match(html,/loadPublishedLibrary\(\)/);
 assert.match(html,/schedulePublishedForView/);
 assert.match(html,/screened_pending_editorial_review/);
 assert.doesNotMatch(html,/IN REVIEW/);
 assert.match(html,/batch1-editorial/);
 assert.doesNotMatch(html,/Import your 100,000|Preview unreviewed starters|window\.SayMoreLibrary|library-loader\.js/);
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,1);
 assert.doesNotThrow(()=>new vm.Script(scripts[0][1]));
});

test('Iconsax remains the exclusive UI icon system and Gemini stays optional',()=>{
 assert.match(html,/SAYMORE_ICONSAX/);
 assert.match(html,/src="\/iconsax\/part-1\.js"/);
 assert.match(html,/src="\/iconsax\/part-5\.js"/);
 assert.match(html,/src="\/curated-shards\.js"/);
 assert.match(html,/Gemini-powered ideas, only when you ask/);
 assert.match(html,/quiet-ai-toggle/);
 assert.match(html,/aiPrompts/);
 assert.match(html,/aiAngles/);
});


test('preserves all existing 500-entry expanded collections under the new 200-entry initial goal',()=>{
 const old=manifest.combinations.filter(c=>c.legacyExpanded);
 assert.equal(old.length,9);
 assert.ok(old.every(c=>c.target===200&&c.published===500));
 assert.ok(report.published>=4500);
 assert.equal(report.published,manifest.publishedCount);
 assert.ok(report.covered>=1800);
 assert.equal(report.covered,manifest.coverageCount);
 assert.equal(report.remaining,manifest.targetCount-manifest.coverageCount);
});
