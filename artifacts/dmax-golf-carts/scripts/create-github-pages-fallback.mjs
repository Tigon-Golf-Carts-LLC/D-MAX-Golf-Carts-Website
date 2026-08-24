import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve('dist/public');
const indexFile = resolve(outputDir, 'index.html');
const fallbackFile = resolve(outputDir, '404.html');

if (!existsSync(indexFile)) {
  throw new Error(`Static build output not found: ${indexFile}`);
}

// scripts/prerender-seo.mjs already writes a real 404 page, and it works as the
// GitHub Pages SPA fallback too: it carries the same bundle, so wouter reads
// the real URL and renders the right route. Copying index.html over it would
// replace a noindex "page not found" with a duplicate of the homepage, carrying
// the homepage's canonical.
if (existsSync(fallbackFile)) {
  console.log('Kept prerendered SPA fallback: dist/public/404.html');
} else {
  copyFileSync(indexFile, fallbackFile);
  console.log('Created GitHub Pages SPA fallback: dist/public/404.html');
}
