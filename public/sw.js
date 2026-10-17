/* Say More PWA shell: built-in curated and editorially screened prompts remain available offline. */
const CACHE='saymore-curated-v13';
const ASSETS=['/','/index.html','/tod-truth-banks.js','/tod-dare-banks.js','/truth-or-dare-data.js','/truth-or-dare.css','/curated-shards.js','/adult-chat-expansion.js','/icon.svg','/manifest.webmanifest','/library-data/manifest.json','/library-data/approved.json','/library-data/relationships-chill-anyone-101-200.json','/library-data/relationships-chill-anyone-201-300.json','/library-data/relationships-chill-anyone-301-400.json','/library-data/relationships-chill-anyone-401-500.json','/library-data/relationships-chill-someone-new-501-600.json','/library-data/relationships-chill-someone-new-601-700.json','/library-data/relationships-chill-someone-new-701-790.json','/library-data/relationships-chill-someone-new-791-900.json','/library-data/relationships-chill-someone-new-901-1000.json',...Array.from({length:5},(_,i)=>'/iconsax/part-'+(i+1)+'.js')];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('saymore-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 // Network-first for pages, loader and manifest: catalogue updates must not be trapped behind an old PWA cache.
 const networkFirst=url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/library-data/manifest.json'||url.pathname==='/curated-shards.js';
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
