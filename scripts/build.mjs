import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true, force: true });
console.log('Say More static build complete.');

import { buildContent } from './build-content.mjs';
await buildContent();
