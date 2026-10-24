(()=>{'use strict';
const VERSION='2026-10-24-editorial-e1';
const URL='/version.json';
let updating=false,checking=false,visible=false;
const style=document.createElement('style');
style.textContent='#saymore-update-banner{position:fixed;z-index:2147483647;bottom:calc(18px + env(safe-area-inset-bottom,0px));left:16px;right:16px;max-width:440px;margin:auto;padding:16px;border-radius:18px;background:#263b2c;color:#fff;box-shadow:0 8px 30px #0003;font:14px/1.45 system-ui,-apple-system,sans-serif;display:none;align-items:center;gap:12px}#saymore-update-banner strong{display:block;font-size:15px;margin-bottom:3px}#saymore-update-banner button{border:0;border-radius:999px;background:#dcef9b;color:#203224;padding:10px 16px;font:600 14px system-ui,-apple-system,sans-serif;cursor:pointer;flex-shrink:0}';
document.head.appendChild(style);
function banner(){let el=document.getElementById('saymore-update-banner');if(el)return el;el=document.createElement('aside');el.id='saymore-update-banner';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<div><strong>New version available</strong><span>Say More has changed. Refresh to get the latest version.</span></div><button type="button">Refresh</button>';el.querySelector('button').addEventListener('click',refresh);document.body.appendChild(el);return el;}
function show(){if(visible)return;visible=true;banner().style.display='flex';}
async function check(){if(checking||updating)return;checking=true;try{const r=¶»§q«^