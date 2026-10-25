const CACHE='saymore-rc-20261025-v1';
const FILES=['/rc/','/rc/index.html','/rc/cards.js','/rc/games.js',...Array.from({length:5},(_,i)=>'/iconsax/part-'+(i+1)+'.js')];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('saymore-rc-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin||!u.pathname.startsWith('/rc/'))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){let c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||Response.error())))});
