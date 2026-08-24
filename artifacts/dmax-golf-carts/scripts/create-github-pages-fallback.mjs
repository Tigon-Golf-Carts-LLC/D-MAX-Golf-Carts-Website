import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve('dist/public');
const indexFile = resolve(outputDir, 'index.html');
const fallbackFile = resolve(outputDir, '404.html');

if (!existsSync(indexFile)) {
  throw new Error(`Static build output not found: ${indexFile}`);
}

copyFileSync(indexFile, fallbackFile);
console.log('Created GitHub Pages SPA fallback: dist/public/404.html');