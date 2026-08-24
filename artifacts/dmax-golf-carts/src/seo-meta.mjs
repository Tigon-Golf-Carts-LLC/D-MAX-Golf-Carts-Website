/**
 * Per-page title / description / social image, keyed by route path.
 *
 * Shared deliberately: scripts/seo-routes.mjs builds the prerendered <head>
 * and sitemap from this, and src/use-seo-head.ts applies the same values when
 * the client router changes pages. Keeping one table means a prerendered page
 * and its client-navigated equivalent can never disagree.
 *
 * Plain .mjs (typed by seo-meta.d.mts) so Node can import it directly from the
 * build script without a compile step.
 */

export const SITE = 'https://dmaxgolfcarts.com';

export const DEFAULT_IMAGE = '/og-image.jpg';
export const DEFAULT_IMAGE_ALT = 'D-MAX Golf Carts — the XT4 electric golf cart';

export const PAGE_META = {
  '/': {
    title: 'D-MAX Golf Carts | GT4, GT6, XT4 & XT6 Electric Carts',
    description:
      'Explore D-MAX electric golf carts: GT4, GT6, XT4 and XT6. Compare seating, 4x4 capability, range and pricing, then call 1-844-844-1920.',
  },
  '/models': {
    title: 'All Models | D-MAX GT4, GT6, XT4 & XT6',
    description:
      'Compare every D-MAX model side by side: four and six seat layouts, rear-wheel and 4x4 all-wheel drive, range, top speed and pricing from $13,595.',
  },
  '/models/gt4': {
    title: 'D-MAX GT4 | 4-Seat Grand Touring Electric Golf Cart',
    description:
      'The D-MAX GT4 is a four-seat grand touring electric golf cart: 45 mile range, 25 mph top speed, luxury seating and a 10.1-inch CarPlay touchscreen.',
    image: '/og-gt4.jpg',
    imageAlt: 'D-MAX GT4 electric golf cart',
  },
  '/models/gt6': {
    title: 'D-MAX GT6 | 6-Seat Grand Touring Electric Golf Cart',
    description:
      'The D-MAX GT6 seats six in a stretched grand touring cabin: 45 mile range, 25 mph top speed, marine luxury seats, refrigerator and wireless charging.',
    image: '/og-gt6.jpg',
    imageAlt: 'D-MAX GT6 electric golf cart',
  },
  '/models/xt4': {
    title: 'D-MAX XT4 | 4-Seat Xtreme Terrain Electric Golf Cart',
    description:
      'The D-MAX XT4 is a lifted 4x4 four-seat electric golf cart: all-wheel drive, 48 mile range, 25 mph top speed and off-road ready ground clearance.',
    image: '/og-xt4.jpg',
    imageAlt: 'D-MAX XT4 electric golf cart',
  },
  '/models/xt6': {
    title: 'D-MAX XT6 | 6-Seat Xtreme Terrain Electric Golf Cart',
    description:
      'The D-MAX XT6 carries six on 4x4 all-wheel drive: 48 mile range, 25 mph top speed, lifted suspension and a full luxury interior.',
    image: '/og-xt6.jpg',
    imageAlt: 'D-MAX XT6 electric golf cart',
  },
  '/capability': {
    title: 'Capability | 4x4 All-Wheel Drive D-MAX Golf Carts',
    description:
      'How D-MAX XT models handle rough ground: 4x4 all-wheel drive, lifted suspension, off-road tyres and the clearance to leave the cart path behind.',
  },
  '/engineering': {
    title: 'Engineering | 72V Lithium Power & D-MAX Chassis',
    description:
      'Inside the D-MAX platform: a 72V lithium system, independent suspension, electric power steering and the chassis engineering behind every model.',
  },
  '/experience': {
    title: 'Experience | D-MAX Interior, Sound & Comfort',
    description:
      'The D-MAX cabin: marine-grade luxury seating, a 10.1-inch CarPlay touchscreen, built-in refrigerator, wireless charging and multi-speaker audio.',
  },
  '/policies/terms': {
    title: 'Terms & Conditions | D-MAX Golf Carts',
    description:
      'The conditions for using the D-MAX Golf Carts website and requesting product information, including acceptable use and how inquiries are handled.',
  },
  '/policies/returns': {
    title: 'Return Policy | D-MAX Golf Carts',
    description:
      'How D-MAX handles returns: eligibility, timing, condition requirements and fees are confirmed for each purchase before a transaction completes.',
  },
  '/policies/privacy': {
    title: 'Privacy Policy | D-MAX Golf Carts',
    description:
      'How D-MAX Golf Carts uses the information you submit through this website to respond to inquiries and provide requested product information.',
  },
  '/policies/delivery': {
    title: 'Delivery Policy | D-MAX Golf Carts',
    description:
      'D-MAX delivery options, timing, coverage and charges are confirmed per order, because they depend on the vehicle and the destination.',
  },
  '/policies/storage': {
    title: 'Storage Policy | D-MAX Golf Carts',
    description:
      'How storage is arranged for a D-MAX vehicle, covering both customer-held storage and vehicles held by D-MAX under a written arrangement.',
  },
  '/policies/publishing': {
    title: 'Publishing Policy | D-MAX Golf Carts',
    description:
      'How D-MAX publishes product and company information, and the standards it applies to accuracy and attribution of that content.',
  },
  '/policies/feedback': {
    title: 'Feedback Policy | D-MAX Golf Carts',
    description:
      'How to send D-MAX constructive feedback about the website, its vehicles and the customer information experience.',
  },
  '/policies/corrections': {
    title: 'Corrections Policy | D-MAX Golf Carts',
    description:
      'How D-MAX corrects material factual errors in public website content while preserving context about what changed.',
  },
  '/policies/diversity': {
    title: 'Diversity Policy | D-MAX Golf Carts',
    description:
      'The D-MAX commitment to a respectful environment where people are treated fairly and can contribute their work.',
  },
  '/policies/ethics': {
    title: 'Ethics Policy | D-MAX Golf Carts',
    description:
      'The standards D-MAX applies to product information, customer communications and business relationships.',
  },
  '/policies/staffing': {
    title: 'Staffing Report | D-MAX Golf Carts',
    description:
      'D-MAX Golf Carts does not currently publish a public staffing count or workforce report on this website.',
  },
};

/** Shown when the client router lands on a path with no entry above. */
export const NOT_FOUND_META = {
  title: 'Page not found | D-MAX Golf Carts',
  description: 'That page does not exist. Browse D-MAX models or call 1-844-844-1920.',
};
