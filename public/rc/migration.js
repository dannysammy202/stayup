/* Say More RC: non-destructive migration from classic local-only storage.
   Never write, clear or overwrite conversation-companion-proto-v4. */
(function(root){
  'use strict';
  const LEGACY='conversation-companion-proto-v4', PREFIX='saymore-ng-v2-', VERSION='2026-10-safe-v1';
  const read=(store,key)=>{try{return store.getItem(key)}catch{return null}};
  const parse=(raw)=>{try{const v=JSON.parse(raw||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:null}catch{return null}};
  const ids=(items)=>Array.isArray(items)?[...new Set(items.filter(v=>typeof v==='string'&&v.length>0&&v.length<=150))].slice(0,20000):[];
  function inspect(store,validIds){
    const raw=read(store,LEGACY),legacy=parse(raw);
    const valid=new Set(validIds||[]),saved=ids(legacy?.saved),seen=ids(legacy?.seen);
    const archivedSaved=saved.filter(id=>!valid.has(id));
    const archivedHistory=seen.filter(id=>!valid.has(id));
    return {present:!!legacy,saved,seen,matchedSaved:saved.filter(id=>valid.has(id)),matchedHistory:seen.filter(id=>valid.has(id)),archivedSaved,archivedHistory,originalRaw:raw};
  }
  function migrate(store,validIds){
    const result=inspect(store,validIds);
    if(!result.present)return {...result,status:'no-legacy'};
    // Snapshot is a copy; preserve the classic key exactly, even if future formats change.
    try{
      if(read(store,PREFIX+'migration-version')!==VERSION){
        if(read(store,PREFIX+'legacy-backup')===null)store.setItem(PREFIX+'legacy-backup',result.originalRaw);
        for(const [dest,matches] of [['saved',result.matchedSaved],['history',result.matchedHistory]]){
          const prior=ids(JSON.parse(read(store,PREFIX+dest)||'[]'));
          const next=ids([...prior,...matches]);
          store.setItem(PREFIX+dest,JSON.stringify(next.slice(0,1000)));
        }
        store.setItem(PREFIX+'migration-version',VERSION);
      }
    }catch{/* Storage access is optional; classic records remain untouched. */}
    return {...result,status:'preserved'};
  }
  function resetRC(store){
    try{const keys=[];for(let i=0;i<store.length;i++){const k=store.key(i);if(k&&k.startsWith(PREFIX)&&k!==PREFIX+'legacy-backup')keys.push(k)}
      for(const k of keys)store.removeItem(k);return true;
    }catch{return false}
  }
  function exportData(store){
    const snapshot={schema:'saymore-local-data-v1',exportedAt:new Date().toISOString(),current:{},legacy:{}};
    try{for(let i=0;i<store.length;i++){const k=store.key(i);if(k&&k.startsWith(PREFIX))snapshot.current[k]=store.getItem(k)}
      snapshot.legacy[LEGACY]=store.getItem(LEGACY);
    }catch{}return snapshot;
  }
  root.SayMoreMigration=Object.freeze({inspect,migrate,resetRC,exportData,VERSION});
})(typeof window!=='undefined'?window:globalThis);
