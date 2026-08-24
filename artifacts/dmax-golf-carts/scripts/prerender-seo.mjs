/**
 * Post-build step: give every route a real HTML file with its own <head>.
 *
 * Why this exists
 * ---------------
 * The site is a client-rendered SPA served from a single index.html, and the
 * app never touches document.head. Every URL therefore shipped the same title,
 * the same description, and -- worst of all -- `<link rel="canonical">`
 * pointing at the homepage. Each of the 20 routes was telling Google "the real
 * version of this page is the homepage", so Search Console consolidates them
 * away and the model pages never get indexed on their own terms.
 *
 * Serving unknown URLs as index.html with a 200 was the second half of the
 * problem: that is the textbook definition of a soft 404.
 *
 * Writing one file per known route fixes both. Real routes become real files
 * (200, correct per-page metadata, no JS required for a crawler to read it),
 * which frees Cloudflare's not_found_handling to return an actual 404 for
 * everything else -- see wrangler.jsonc.
 *
 * Client-side routing is unaffected: every file carries the same bundle, so
 * wouter takes over on load exactly as before.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { ROUTES, SITE } from './seo-routes.mjs';

const OUT = resolve('dist/public');
const shellPath = resolve(OUT, 'index.html');

let shell;
try {
  shell = readFileSync(shellPath, 'utf8');
} catch {
  throw new Error(`Build output not found: ${shellPath}. Run the Vite build first.`);
}

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replace the content="" of a meta tag matched by its name/property. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (!re.test(html)) {
    throw new Error(`Could not find <meta ${attr}="${key}"> in the built index.html`);
  }
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function render(route) {
  const url = `${SITE}${route.path}`;
  const image = `${SITE}${route.image ?? '/og-image.jpg'}`;
  const imageAlt = route.imageAlt ?? 'D-MAX Golf Carts — the XT4 electric golf cart';

  let html = shell;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeText(route.title)}</title>`,
  );
  html = setMeta(html, 'name', 'description', route.description);
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', imageAlt);
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', imageAlt);

  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  if (route.jsonLd?.length) {
    const blocks = route.jsonLd
      .map(
        (obj) =>
          `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)
            .split('\n')
            .map((l) => `      ${l}`)
            .join('\n')}\n    </script>`,
      )
      .join('\n');
    html = html.replace('</head>', `${blocks}\n  </head>`);
  }

  return html;
}

let count = 0;
for (const route of ROUTES) {
  const html = render(route);
  const file =
    route.path === '/'
      ? resolve(OUT, 'index.html')
      : resolve(OUT, `.${route.path}`, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  count += 1;
}

// A genuine 404 body. Cloudflare serves this with a 404 status
// (not_found_handling: "404-page"), so unknown URLs stop reporting as soft 404s.
const notFound = render({
  path: '/404',
  title: 'Page not found | D-MAX Golf Carts',
  description: 'That page does not exist. Browse D-MAX models or call 1-844-844-1920.',
  jsonLd: [],
}).replace(
  '<meta name="robots" content="index, follow" />',
  '<meta name="robots" content="noindex, follow" />',
);
writeFileSync(resolve(OUT, '404.html'), notFound);

// sitemap.xml is generated from the same table so it can never drift from the
// set of pages that actually exist.
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${ROUTES.map((r) => {
  const img = r.path.startsWith('/models/')
    ? `<image:image><image:loc>${SITE}/models/${r.path.split('/').pop()}.jpg</image:loc><image:title>${escapeText(
        r.title,
      )}</image:title></image:image>`
    : '';
  return `  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority>${img}</url>`;
}).join('\n')}
</urlset>
`;
writeFileSync(resolve(OUT, 'sitemap.xml'), sitemap);
// public/page-sitemap.xml points readers at sitemap-pages.xml, so keep that
// copy generated too rather than letting a hand-maintained duplicate drift out
// of sync with the real page list.
writeFileSync(resolve(OUT, 'sitemap-pages.xml'), sitemap);

console.log(
  `prerendered ${count} routes + 404.html, and wrote sitemap.xml with ${ROUTES.length} URLs`,
);
