export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export declare const SITE: string;
export declare const DEFAULT_IMAGE: string;
export declare const DEFAULT_IMAGE_ALT: string;
export declare const PAGE_META: Record<string, PageMeta>;
export declare const NOT_FOUND_META: PageMeta;
