(function () {
  'use strict';
  const DB_NAME = 'saymore-curated-library-v1';
  const DB_VERSION = 1;
  const VALID_TOPICS = new Set(['Relationships','Friendships','Life','Childhood','Family','Money','Culture','Personal Experiences','Future & Ambitions','Random & Hypothetical','Faith & Spirituality','Music','Entertainment','Work & Career','School & Education','Dating','Pop Culture','Would You Rather','Controversial Opinions']);
  const VALID_MOODS = new Set(['Chill','Playful','Curious','Deep','Flirty','Bold']);
  const VALID_AUDIENCES = new Set(['Anyone','Someone New','Friends','Crush / Talking Stage','Partner','Family','Group']);
  const FORMATS = {question:'Question',hot_take:'Hot take',scenario:'Scenario',quick_choice:'Quick choice',casual_observation:'Observation',personal_story:'Story starter'};
  let dbPromise;
  function db() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('This browser does not support local library storage.'));
    if (!dbPromise) dbPromise = new Promise((resolve,reject) => {
      const req = indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded = () => {
        const database = req.result;
        if (!database.objectStoreNames.contains('chunks')) database.createObjectStore('chunks',{keyPath:'index'});
        if (!database.objectStoreNames.contains('meta')) database.createObjectStore('meta');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Unable to open the library.'));
    });
    return dbPromise;
  }
  function transactionResult(tx) {
    return new Promise((resolve,reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Unable to save the library.'));
      tx.onabort = () => reject(tx.error || new Error('Library import was cancelled.'));
    });
  }
  function parseRecord(line) {
    let p;
    try { p = JSON.parse(line); } catch { throw new Error('The library contains invalid JSONL records.'); }
    if (!p || !/^SM-\d{6}$/.test(p.id) || typeof p.text !== 'string' || !p.text.trim() ||
        !VALID_TOPICS.has(p.primary_topic) || !VALID_MOODS.has(p.mood) ||
        !VALID_AUDIENCES.has(p.audience) || !FORMATS[p.format] || p.content_rating !== 'general' ||
        !['approved','generated_pending_editorial_review'].includes(p.editorial_status)) {
      throw new Error('The library contains an invalid record: ' + String(p && p.id));
    }
    const audience = p.audience === 'Someone New' ? 'Someone new' :
      p.audience === 'Crush / Talking Stage' ? 'Crush / Talking stage' : p.audience;
    return {
      id:p.id, topic:p.primary_topic, moods:[p.mood], audiences:[audience],
      format:FORMATS[p.format],text:p.text.trim(),angles:[],adult:false,
      editorialStatus:p.editorial_status,source:'imported-library'
    };
  }
  async function extractText(file) {
    if (/\.jsonl$/i.test(file.name)) return file.text();
    if (!/\.zip$/i.test(file.name)) throw new Error('Select the original Say More ZIP or master_index.jsonl.');
    let zip;
    try {
      // Download only the ZIP reader. Import content stays inside your browser.
      zip = await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js');
    } catch { throw new Error('ZIP import requires an internet connection. Alternatively import master_index.jsonl.'); }
    const raw = new Uint8Array(await file.arrayBuffer());
    const files = await new Promise((resolve,reject) => zip.unzip(raw,{
      filter: entry => /(^|\/)master_index\.jsonl$/.test(entry.name)
    },(error,items) => error ? reject(error) : resolve(items)));
    const data = Object.entries(files).find(([name]) => /(^|\/)master_index\.jsonl$/.test(name));
    if (!data) throw new Error('The ZIP does not contain master_index.jsonl.');
    return new TextDecoder().decode(data[1]);
  }
  async function importFile(file,progress) {
    if (!file) throw new Error('Choose a ZIP or JSONL file.');
    if (typeof progress === 'function') progress('Reading the content archive...');
    const text = await extractText(file);
    const lines = text.split(/\r?\n/);
    const ids = new Set(), records = [], counts = {approved:0,draft:0};
    if (typeof progress === 'function') progress('Validating the conversation starters...');
    for (let i=0;i<lines.length;i++) {
      if (!lines[i].trim()) continue;
      const p = parseRecord(lines[i]);
      if (ids.has(p.id)) throw new Error('Duplicate starter ID: '+p.id);
      ids.add(p.id);
      records.push(p);
      if (p.editorialStatus==='approved') counts.approved++;
      else counts.draft++;
      if (i>0 && i%5000===0) {
        if (typeof progress === 'function') progress('Validated '+records.length.toLocaleString('en-GB')+' starters...');
        await new Promise(r=>setTimeout(r,0));
      }
    }
    if (records.length !== 100000) throw new Error('Expected 100,000 starters. Found '+records.length+'. Nothing was replaced.');
    if (typeof progress === 'function') progress('Saving 100,000 starters on this device...');
    const database = await db();
    const tx = database.transaction(['chunks','meta'],'readwrite');
    const chunks = tx.objectStore('chunks'),meta = tx.objectStore('meta');
    chunks.clear();
    for (let i=0;i<records.length;i+=500) chunks.put({index:i/500,records:records.slice(i,i+500)});
    const info = {count:records.length,approved:counts.approved,draft:counts.draft,importedAt:new Date().toISOString()};
    meta.put(info,'summary');
    await transactionResult(tx);
    return {records,summary:info};
  }
  async function load() {
    const database = await db();
    const tx = database.transaction(['chunks','meta'],'readonly');
    const chunks = tx.objectStore('chunks').getAll();
    const info = tx.objectStore('meta').get('summary');
    const result = await new Promise((resolve,reject) => {
      tx.oncomplete = () => resolve({
        records:(chunks.result||[]).flatMap(item=>item.records),
        summary:info.result||null
      });
      tx.onerror = () => reject(tx.error);
    });
    return result;
  }
  async function clear() {
    const database = await db();
    const tx = database.transaction(['chunks','meta'],'readwrite');
    tx.objectStore('chunks').clear();
    tx.objectStore('meta').clear();
    await transactionResult(tx);
  }
  window.SayMoreLibrary = {importFile,load,clear,parseRecord};
})();