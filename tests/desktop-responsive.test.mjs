import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync('public/index.html','utf8');
const css=readFileSync('public/desktop-layout.css','utf8');
const server=readFileSync('server.mjs','utf8');
const sw=readFileSync('public/sw.js','utf8');

test('desktop layout is a separate stylesheet with tablet and laptop breakpoints',()=>{
  assert.match(html,/href="\/desktop-layout\.css"/);
  assert.match(css,/#desktop-nav\{display:none\}/);
  assert.match(css,/@media \(min-width:620px\)/);
  assert.match(css,/@media \(min-width:1024px\)/);
  assert.match(css,/@media \(min-width:1440px\)/);
  assert.match(css,/#app-shell\{display:grid/);
  assert.match(css,/grid-template-columns:248px minmax\(0,1fr\)/);
});

test('desktop navigation shares existing routes and updates current page',()=>{
  for(const page of ['discover','games','saved','history','settings']){
    assert.match(html,new RegExp('id="desktop-nav"[\\s\\S]*data-page="'+page+'"'));
  }
  assert.match(html,/document\.querySelectorAll\('#desktop-nav \[data-page\]'\)/);
  assert.match(html,/\$\('#app-shell'\)\.addEventListener\('click'/);
  assert.match(html,/button\.setAttribute\('aria-current','page'\)/);
});

test('offline cache and local server serve the desktop stylesheet correctly',()=>{
  assert.match(sw,/\/desktop-layout\.css/);
  assert.match(server,/\.css':\s*'text\/css; charset=utf-8'/);
});

test('tablet portrait and touch landscape retain touch-friendly navigation and card grids',()=>{
  assert.match(css, /balanced grids and touch targets in portrait and landscape/);
  assert.match(css, /\(max-width:1023px\)/);
  assert.match(css, /\(any-pointer:coarse\)/);
  assert.match(css, /#desktop-nav \{ display:none; \}/);
  assert.match(css, /\.bottomnav \{ display:grid; \}/);
  assert.match(css, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /min-height:44px/);
  const browserQA=readFileSync('scripts/desktop-browser-qa.mjs','utf8');
  for(const size of ['768','820','912','1024','1180','1366']){
    assert.match(browserQA,new RegExp('width:'+size+',height:'));
  }
  assert.match(browserQA,/hasTouch:touch/);
  assert.match(browserQA,/matchMedia\('\(any-pointer: coarse\)'\)/);
});
