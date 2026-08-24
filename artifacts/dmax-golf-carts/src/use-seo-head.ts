import { useEffect } from 'react';
import { useLocation } from 'wouter';

import {
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  NOT_FOUND_META,
  PAGE_META,
  SITE,
} from './seo-meta.mjs';

function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

/**
 * Keep <head> in step with the client router.
 *
 * Each route is prerendered with its own title, description and canonical, but
 * those are only correct for the document the browser loaded. Navigating
 * in-app swaps the rendered page without touching <head>, so the tab title,
 * canonical and share tags kept describing whichever page was loaded first.
 */
export function useSeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location.replace(/\/+$/, '') || '/';
    const meta = PAGE_META[path] ?? NOT_FOUND_META;
    const url = `${SITE}${path === '/' ? '/' : path}`;
    const image = `${SITE}${meta.image ?? DEFAULT_IMAGE}`;
    const imageAlt = meta.imageAlt ?? DEFAULT_IMAGE_ALT;

    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:image:alt"]', imageAlt);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);
    setMeta('meta[name="twitter:image"]', image);
    setMeta('meta[name="twitter:image:alt"]', imageAlt);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [location]);
}
