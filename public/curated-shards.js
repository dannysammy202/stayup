/*
 * Say More built-in collection selector.
 * Catalogue and shards are shipped with the application. No upload or Gemini request.
 * Keep this module free of DOM or storage dependencies so it is independently testable.
 */
(function (root) {
  'use strict';
  const VALID = /^[a-z0-9/_-]+\.json$/i;
  function assertManifest(manifest) {
    if (!manifest || manifest.version !== 2 || manifest.targetPerCombination !== 200 ||
        manifest.eligibleCombinations !== 696 || manifest.excludedCombinations !== 102 ||
        manifest.targetCount < 139200 || !Array.isArray(manifest.publishedCollections) ||
        !Array.isArray(manifest.publishedFiles) || !Array.isArray(manifest.combinations)) {
      throw new Error('Built-in library manifest does not match the approved scope.');
    }
    if (manifest.combinations.length !== 798) throw new Error('Incorrect combination count.');
    const eligible = manifest.combinations.filter(x => x.eligible);
    if (eligible.length !== 696 || eligible.some(x => !Number.isInteger(x.target) || x.target < 200 || x.target > 500 || x.published > (x.legacyExpanded === true ? 500 : x.target)) ||
        eligible.reduce((sum,x) => sum + x.target, 0) !== manifest.targetCount ||
        manifest.combinations.some(x => !x.eligible && (x.target !== 0 || x.published > 0))) {
      throw new Error('Invalid eligible/excluded combination allocation.');
    }
    const paths = new Set();
    let total = 0;
    for (const c of manifest.publishedCollections) {
      if (!c || !Array.isArray(c.shards) || !Number.isInteger(c.loadedCount) || c.loadedCount < 1) {
        throw new Error('Invalid published collection metadata.');
      }
      const slot = manifest.combinations.find(x => x.topic === c.topic && x.mood === c.mood && x.audience === c.audience);
      if (!slot || !slot.eligible || slot.published !== c.loadedCount || c.loadedCount > 500) {
        throw new Error('Published content does not match an eligible combination.');
      }
      for (const path of c.shards) {
        if (typeof path !== 'string' || !VALID.test(path) || paths.has(path)) {
          throw new Error('Duplicate or unsafe published content path.');
        }
        paths.add(path);
      }
      total += c.loadedCount;
    }
    if (total !== manifest.publishedCount || paths.size !== manifest.publishedFiles.length ||
        manifest.publishedFiles.some(path => !paths.has(path)) ||
        manifest.humanReviewedCount + manifest.aiAuthoredScreenedCount !== total ||
        manifest.coverageCount !== manifest.combinations.reduce((sum,x) => sum + Math.min(x.published,x.target),0) ||
        manifest.remainingToTarget !== manifest.targetCount - manifest.coverageCount) {
      throw new Error('Published collection index and content totals differ.');
    }
    const activePolicy=manifest.activePolicy;
    if(!activePolicy || activePolicy.version!==1 ||
       activePolicy.targetPerCombination!==50 || activePolicy.targetCount!==34800 ||
       activePolicy.eligibleCombinations!==696 || activePolicy.excludedCombinations!==102 ||
       activePolicy.activeCount+activePolicy.archivedCount!==manifest.publishedCount ||
       activePolicy.remainingToTarget!==activePolicy.targetCount-activePolicy.activeCount ||
       activePolicy.activeCount!==manifest.combinations.reduce((n,c)=>n+(c.eligible?Math.min(50,c.published):0),0)) {
      throw new Error('Invalid 50-starter active catalogue policy.');
    }
    const activeIds=new Set();
    for(const c of manifest.publishedCollections){
      if(!Array.isArray(c.activeIds)||!Array.isArray(c.activeShards)||
         c.activeCount!==Math.min(50,c.loadedCount)||
         c.activeIds.length!==c.activeCount||c.archivedCount!==c.loadedCount-c.activeCount||
         c.activeShards.length<1||c.activeShards.some(path=>!c.shards.includes(path))) {
        throw new Error('Invalid active collection membership.');
      }
      for(const id of c.activeIds){
        if(!/^SM-\d{6}$/.test(id)||activeIds.has(id))throw new Error('Duplicate or invalid active ID.');
        activeIds.add(id);
      }
    }
    if(activeIds.size!==activePolicy.activeCount)throw new Error('Active catalogue count mismatch.');
    return true;
  }
  function matches(collection, selection) {
    return collection.audience === selection.audience &&
      (selection.topic === 'All topics' || collection.topic === selection.topic) &&
      (selection.mood === 'All moods' || collection.mood === selection.mood);
  }
  function pathsForSelection(manifest, selection, loadedPaths, limit = 8) {
    if (!manifest || !Array.isArray(manifest.publishedCollections)) return [];
    const loaded = loadedPaths instanceof Set ? loadedPaths : new Set(loadedPaths || []);
    const cols = manifest.publishedCollections.filter(c => matches(c, selection));
    // Round-robin across topics first so broad browsing does not load one topic only.
    const result = [];
    const longest = Math.max(0, ...cols.map(c => c.shards.length));
    for (let level = 0; level < longest && result.length < limit; level++) {
      for (const c of cols) {
        const path = c.shards[level];
        if (path && !loaded.has(path)) {
          result.push(path);
          if (result.length === limit) break;
        }
      }
    }
    return result;
  }
  function activePathsForSelection(manifest,selection,loadedPaths,limit=8){
    if(!manifest || !Array.isArray(manifest.publishedCollections))return [];
    const activeIndex={publishedCollections:manifest.publishedCollections.map(c=>({
      ...c,shards:c.activeShards||[]
    }))};
    return pathsForSelection(activeIndex,selection,loadedPaths,limit);
  }
  function pathsForIds(manifest, ids, loadedPaths, limit = 8) {
    if (!manifest || !Array.isArray(manifest.publishedFiles)) return [];
    const needs = new Set((ids || []).map(id => /^SM-(\d{6})$/.exec(id)?.[1]).filter(Boolean).map(Number));
    if (!needs.size) return [];
    const loaded = loadedPaths instanceof Set ? loadedPaths : new Set(loadedPaths || []);
    const paths = [];
    for (const path of manifest.publishedFiles) {
      if (loaded.has(path)) continue;
      const match = /-(\d+)-(\d+)\.json$/i.exec(path);
      const contains = match ? [...needs].some(id => id >= Number(match[1]) && id <= Number(match[2]))
        : path === 'approved.json' && [...needs].some(id => id >= 1 && id <= 100);
      if (contains) paths.push(path);
      if (paths.length === limit) break;
    }
    return paths;
  }
  root.SayMoreCuratedShards = Object.freeze({assertManifest, pathsForSelection, activePathsForSelection, pathsForIds});
})(typeof window !== 'undefined' ? window : globalThis);
