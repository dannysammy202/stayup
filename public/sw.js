/* Say More Nigerian-first public PWA. Root launch, network-first shell and static card catalogue offline. */
const CACHE='saymore-nigerian-first-20261027-games500-v1-no-more-gist-v1-howtosay-v1';
const ASSETS=['/','/index.html','/manifest.webmanifest','/icon.svg',
 '/rc/cards.js','/rc/gist-bringer.js','/rc/gist-bringer-expansion-1.js','/rc/gist-bringer-expansion-2.js','/rc/gist-bringer-expansion-3.js','/rc/games.js','/rc/game-overrides.js','/rc/game-overrides-remaining.js','/rc/game-500-truth.js','/rc/game-500-dare.js','/rc/game-500-wyr.js','/rc/game-500-never.js','/rc/game-500-hot.js','/rc/game-500-thisthat.js','/rc/game-500-story.js','/rc/how-to-say-it.js','/rc/migration.js',
 ...Array.from({length:5},(_,i)=>'/iconsax/part-'+(i+1)+'.js')];
self.addEventListener('install',e=>e.waitUntil(
 caches.open(CACHE).then(async c=>{
  for(const file of ASSETS){await c.add(file)}
 }).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('saymore-')&&k!==CACHE&&!k.startsWith('saymore-rc-')).map(k=>caches.delete(k))))
 .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 const isEntry=url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/manifest.webmanifest';
 const isData=url.pathname.startsWith('/rc/')||url.pathname.startsWith('/iconsax/');
 if(!isEntry&&!isData)return;
 e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{
  if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}
  return r;
 }).catch(async()=>await caches.match(req)||((url.pathname==='/'||url.pathname==='/index.html')?await caches.match('/index.html'):null)||Response.error()));
});
