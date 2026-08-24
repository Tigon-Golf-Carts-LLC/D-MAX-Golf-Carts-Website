/**
 * Per-route SEO metadata: the single source of truth for prerendered <head>
 * tags and for sitemap.xml.
 *
 * Keep this in step with the <Route> list in src/App.tsx. A route missing here
 * still works for visitors (the SPA renders it client-side) but ships the
 * generic homepage title, description and canonical -- which is what made
 * Google treat every page as a duplicate of the homepage.
 */

export const SITE = 'https://dmaxgolfcarts.com';
export const PHONE = '+1-844-844-1920';

const models = {
  gt4: {
    name: 'GT4',
    tier: 'Grand Touring',
    seats: 4,
    drive: 'Rear-wheel drive',
    range: '45 mi',
    speed: '25 mph',
    price: '13595',
    blurb:
      'The D-MAX GT4 is a four-seat grand touring electric golf cart: 45 mile range, 25 mph top speed, luxury seating and a 10.1-inch CarPlay touchscreen.',
  },
  gt6: {
    name: 'GT6',
    tier: 'Grand Touring',
    seats: 6,
    drive: 'Rear-wheel drive',
    range: '45 mi',
    speed: '25 mph',
    price: '15595',
    blurb:
      'The D-MAX GT6 seats six in a stretched grand touring cabin: 45 mile range, 25 mph top speed, marine luxury seats, refrigerator and wireless charging.',
  },
  xt4: {
    name: 'XT4',
    tier: 'Xtreme Terrain',
    seats: 4,
    drive: '4x4 all-wheel drive',
    range: '48 mi',
    speed: '25 mph',
    price: '15595',
    blurb:
      'The D-MAX XT4 is a lifted 4x4 four-seat electric golf cart: all-wheel drive, 48 mile range, 25 mph top speed and off-road ready ground clearance.',
  },
  xt6: {
    name: 'XT6',
    tier: 'Xtreme Terrain',
    seats: 6,
    drive: '4x4 all-wheel drive',
    range: '48 mi',
    speed: '25 mph',
    price: '17595',
    blurb:
      'The D-MAX XT6 carries six on 4x4 all-wheel drive: 48 mile range, 25 mph top speed, lifted suspension and a full luxury interior.',
  },
};

/** Product + Breadcrumb structured data for a model page. */
function modelJsonLd(slug) {
  const m = models[slug];
  const url = `${SITE}/models/${slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${url}#product`,
      name: `D-MAX ${m.name}`,
      description: m.blurb,
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
    breadcrumb([
      ['Home', '/'],
      ['Models', '/models'],
      [`D-MAX ${m.name}`, `/models/${slug}`],
    ]),
  ];
}

function breadcrumb(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path === '/' ? '/' : path}`,
    })),
  };
}

const policy = (slug, title, description) => ({
  path: `/policies/${slug}`,
  title: `${title} | D-MAX Golf Carts`,
  description,
  priority: '0.3',
  changefreq: 'yearly',
  jsonLd: [
    breadcrumb([
      ['Home', '/'],
      [title, `/policies/${slug}`],
    ]),
  ],
});

export const ROUTES = [
  {
    path: '/',
    title: 'D-MAX Golf Carts | GT4, GT6, XT4 & XT6 Electric Carts',
    description:
      'Explore D-MAX electric golf carts: GT4, GT6, XT4 and XT6. Compare seating, 4x4 capability, range and pricing, then call 1-844-844-1920.',
    priority: '1.0',
    changefreq: 'weekly',
    // The Organization and WebSite graph already in index.html covers the home
    // page, so only the breadcrumb root is added here.
    jsonLd: [],
  },
  {
    path: '/models',
    title: 'All Models | D-MAX GT4, GT6, XT4 & XT6',
    description:
      'Compare every D-MAX model side by side: four and six seat layouts, rear-wheel and 4x4 all-wheel drive, range, top speed and pricing from $13,595.',
    priority: '0.9',
    changefreq: 'weekly',
    jsonLd: [
      breadcrumb([
        ['Home', '/'],
        ['Models', '/models'],
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'D-MAX golf cart models',
        itemListElement: Object.keys(models).map((slug, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `D-MAX ${models[slug].name}`,
          url: `${SITE}/models/${slug}`,
        })),
      },
    ],
  },
  ...Object.keys(models).map((slug) => {
    const m = models[slug];
    return {
      path: `/models/${slug}`,
      title: `D-MAX ${m.name} | ${m.seats}-Seat ${m.tier} Electric Golf Cart`,
      description: m.blurb,
      image: `/og-${slug}.jpg`,
      imageAlt: `D-MAX ${m.name} electric golf cart`,
      priority: '0.9',
      changefreq: 'weekly',
      jsonLd: modelJsonLd(slug),
    };
  }),
  {
    path: '/capability',
    title: 'Capability | 4x4 All-Wheel Drive D-MAX Golf Carts',
    description:
      'How D-MAX XT models handle rough ground: 4x4 all-wheel drive, lifted suspension, off-road tyres and the clearance to leave the cart path behind.',
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Capability', '/capability']])],
  },
  {
    path: '/engineering',
    title: 'Engineering | 72V Lithium Power & D-MAX Chassis',
    description:
      'Inside the D-MAX platform: a 72V lithium system, independent suspension, electric power steering and the chassis engineering behind every model.',
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Engineering', '/engineering']])],
  },
  {
    path: '/experience',
    title: 'Experience | D-MAX Interior, Sound & Comfort',
    description:
      'The D-MAX cabin: marine-grade luxury seating, a 10.1-inch CarPlay touchscreen, built-in refrigerator, wireless charging and multi-speaker audio.',
    priority: '0.8',
    changefreq: 'monthly',
    jsonLd: [breadcrumb([['Home', '/'], ['Experience', '/experience']])],
  },
  policy(
    'terms',
    'Terms & Conditions',
    'The conditions for using the D-MAX Golf Carts website and requesting product information, including acceptable use and how inquiries are handled.',
  ),
  policy(
    'returns',
    'Return Policy',
    'How D-MAX handles returns: eligibility, timing, condition requirements and fees are confirmed for each purchase before a transaction completes.',
  ),
  policy(
    'privacy',
    'Privacy Policy',
    'How D-MAX Golf Carts uses the information you submit through this website to respond to inquiries and provide requested product information.',
  ),
  policy(
    'delivery',
    'Delivery Policy',
    'D-MAX delivery options, timing, coverage and charges are confirmed per order, because they depend on the vehicle and the destination.',
  ),
  policy(
    'storage',
    'Storage Policy',
    'How storage is arranged for a D-MAX vehicle, covering both customer-held storage and vehicles held by D-MAX under a written arrangement.',
  ),
  policy(
    'publishing',
    'Publishing Policy',
    'How D-MAX publishes product and company information, and the standards it applies to accuracy and attribution of that content.',
  ),
  policy(
    'feedback',
    'Feedback Policy',
    'How to send D-MAX constructive feedback about the website, its vehicles and the customer information experience.',
  ),
  policy(
    'corrections',
    'Corrections Policy',
    'How D-MAX corrects material factual errors in public website content while preserving context about what changed.',
  ),
  policy(
    'diversity',
    'Diversity Policy',
    'The D-MAX commitment to a respectful environment where people are treated fairly and can contribute their work.',
  ),
  policy(
    'ethics',
    'Ethics Policy',
    'The standards D-MAX applies to product information, customer communications and business relationships.',
  ),
  policy(
    'staffing',
    'Staffing Report',
    'D-MAX Golf Carts does not currently publish a public staffing count or workforce report on this website.',
  ),
];
