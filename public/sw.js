/* Say More PWA shell: built-in curated and editorially screened prompts remain available offline. */
const CACHE='saymore-batch1-v20';
const ASSETS=['/','/index.html','/tod-truth-banks.js','/tod-dare-banks.js','/truth-or-dare-data.js','/truth-or-dare.css','/curated-shards.js','/adult-chat-expansion.js','/editorial-prompts.js','/editorial-truth-or-dare.js','/batch1-data.js','/batch1-summary.json','/update-check.js','/version.json','/icon.svg','/manifest.webmanifest',...Array.from({length:5},(_,i)=>'/iconsax/part-'+(i+1)+'.js')];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('saymore-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 // Network-first for pages, loader and manifest: catalogue updates must not be trapped behind an old PWA cache.
 const networkFirst=url.pathname==='/batch1-data.js'||url.pathname==='/batch1-summary.json'||url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/library-data/manifest.json'||url.pathname==='/curated-shards.js'||url.pathname==='/version.json'||url.pathname==='/update-check.js'||url.pathname==='/editorial-prompts.js'||url.pathname==='/editorial-truth-or-dare.js';
 if(networkFirst){
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
   return response;
  }).catch(()=>caches.match(request).then(cached=>cached||Response.error())));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 }).catch(()=>cached||Response.error())));
});
