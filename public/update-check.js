(()=>{'use strict';
const VERSION='2026-10-20-batch3-nigerian-voice';
const URL='/version.json';
let updating=false,checking=false,visible=false;
const style=document.createElement('style');
style.textContent='#saymore-update-banner{position:fixed;z-index:2147483647;bottom:calc(18px + env(safe-area-inset-bottom,0px));left:16px;right:16px;max-width:440px;margin:auto;padding:16px;border-radius:18px;background:#263b2c;color:#fff;box-shadow:0 8px 30px #0003;font:14px/1.45 system-ui,-apple-system,sans-serif;display:none;align-items:center;gap:12px}#saymore-update-banner strong{display:block;font-size:15px;margin-bottom:3px}#saymore-update-banner button{border:0;border-radius:999px;background:#dcef9b;color:#203224;padding:10px 16px;font:600 14px system-ui,-apple-system,sans-serif;cursor:pointer;flex-shrink:0}';
document.head.appendChild(style);
function banner(){let el=document.getElementById('saymore-update-banner');if(el)return el;el=document.createElement('aside');el.id='saymore-update-banner';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<div><strong>New version available</strong><span>Say More has changed. Refresh to get the latest version.</span></div><button type="button">Refresh</button>';el.querySelector('button').addEventListener('click',refresh);document.body.appendChild(el);return el;}
function show(){if(visible)return;visible=true;banner().style.display='flex';}
async function check(){if(checking||updating)return;checking=true;try{const r=await fetch(URL+'?t='+Date.now(),{cache:'no-store'});if(r.ok){const d=await r.json();if(d.version&&d.version!==VERSION)show();}}catch(e){}finally{checking=false;}}
async function refresh(){if(updating)return;updating=true;const btn=banner().querySelector('button');btn.disabled=true;btn.textContent='Refreshing…';try{if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.update();}location.replace('/?updated='+Date.now());}catch(e){location.reload();}}
function init(){banner();check();setInterval(check,30000);window.addEventListener('focus',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});window.addEventListener('online',check);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
