/**
 * Build-time route table: crawl metadata plus the structured data for each
 * page.
 *
 * Titles, descriptions and social images are NOT defined here -- they come from
 * src/seo-meta.mjs, which the running app also imports so client-side
 * navigation applies the same values. Keeping one table means a prerendered
 * page and its client-navigated equivalent cannot disagree.
 *
 * Keep this in step with the <Route> list in src/App.tsx. A route missing here
 * still works for visitors, but is left out of the sitemap and ships the
 * homepage's canonical, which is what kept pages out of Google's index.
 */

import { PAGE_META, SITE } from '../src/seo-meta.mjs';

export { SITE };

/** Physical model specs used only for Product structured data. */
const modelSpecs = {
  gt4: { name: 'GT4', seats: 4, drive: 'Rear-wheel drive', range: '45 mi', speed: '25 mph', price: '13595' },
  gt6: { name: 'GT6', seats: 6, drive: 'Rear-wheel drive', range: '45 mi', speed: '25 mph', price: '15595' },
  xt4: { name: 'XT4', seats: 4, drive: '4x4 all-wheel drive', range: '48 mi', speed: '25 mph', price: '15595' },
  xt6: { name: 'XT6', seats: 6, drive: '4x4 all-wheel drive', range: '48 mi', speed: '25 mph', price: '17595' },
};

function breadcrumb(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}

function modelJsonLd(slug) {
  const m = modelSpecs[slug];
  const url = `${SITE}/models/${slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${url}#product`,
      name: `D-MAX ${m.name}`,
      description: PAGE_META[`/models/${slug}`].description,
      url,
      image: [`${SITE}/models/${slug}.jpg`],
      brand: { '@type': 'Brand', name: 'D-MAX' },
      category: 'Electric golf cart',
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Seating capacity', value: `${m.seats}` },
        { '@type': 'PropertyValue', name: 'Drivetrain', value: m.drive },
        { '@type': 'PropertyValue', name: 'Estimated range', value: m.range },
        { '@type': 'PropertyValue', name: 'Top speed', value: m.speed },
      ],
      offers: {
        '@type': 'Offer',
        url,
        price: m.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${SITE}/#organization` },
      },
    },
    breadcrumb([['Home', '/'], ['Models', '/models'], [`D-MAX ${m.name}`, `/models/${slug}`]]),
  ];
}

/** Crawl hints and structured data, keyed by the same paths as PAGE_META. */
const crawl = {
  // The Organization and WebSite graph already in index.html covers the home page.
  '/': { priority: '1.0', changefreq: 'weekly', jsonLd: [] },
  '/models': {
    priority: '0.9',
    changefreq: 'weekly',
    jsonLd: [
      breadcrumb([['Home', '/'], ['Models', '/models']]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'D-MAX golf cart models',
        itemListElement: Object.keys(modelSpecs).map((slug, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `D-MAX ${modelSpecs[slug].name}`,
          url: `${SITE}/models/${slug}`,
        })),
      },
    ],
  },
  '/capability': {
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Capability', '/capability']])],
  },
  '/engineering': {
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Engineering', '/engineering']])],
  },
  '/experience': {
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Experience', '/experience']])],
  },
};

for (const slug of Object.keys(modelSpecs)) {
  crawl[`/models/${slug}`] = {
    priority: '0.9',
    changefreq: 'weekly',
    jsonLd: modelJsonLd(slug),
  };
}

export const ROUTES = Object.entries(PAGE_META).map(([path, meta]) => {
  // Policy pages all behave the same way, so they fall through to this default
  // rather than each needing an entry above.
  const hints = crawl[path] ?? {
    priority: '0.3',
    changefreq: 'yearly',
    jsonLd: [
      breadcrumb([['Home', '/'], [meta.title.replace(/ \| D-MAX Golf Carts$/, ''), path]]),
    ],
  };
  return { path, ...meta, ...hints };
});

// Fail the build rather than silently shipping a page with no crawl hints.
const missing = ROUTES.filter((r) => !r.priority || !r.changefreq);
if (missing.length) {
  throw new Error(`Routes missing crawl hints: ${missing.map((r) => r.path).join(', ')}`);
}
