/* Say More PWA shell: built-in curated and editorially screened prompts remain available offline. */
const CACHE='saymore-editorial-continued-v37';
const ASSETS=['/','/index.html','/tod-truth-banks.js','/tod-dare-banks.js','/truth-or-dare-data.js','/truth-or-dare.css','/conversation-ui-v2.css','/curated-shards.js','/adult-chat-expansion.js','/editorial-prompts.js','/editorial-truth-or-dare.js','/conversation-experiences.js','/conversation-expansion.js','/conversation-next-starters.js','/conversation-next-games.js','/conversation-moments.js','/play-moments.js','/editorial-d1.js','/editorial-d2.js','/games-d1.js','/games-d2.js','/editorial-e1.js','/games-e1.js','/conversation-bridges.js','/batch1-data.js','/batch1-summary.json','/batch3-data.js','/batch3-summary.json','/batch4-data.js','/batch4-summary.json','/update-check.js','/version.json','/icon.svg','/manifest.webmanifest',...Array.from({length:5},(_,i)=>'/iconsax/part-'+(i+1)+'.js')];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('saymore-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||url.pathna¶»§q«^