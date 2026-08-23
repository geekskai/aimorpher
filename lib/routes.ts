export const PRIVATE_ROUTES = [
  'preview',
  'api',
  'upload',
  'pdf',
] as const;

export const RESERVED_USERNAMES = [
  ...PRIVATE_ROUTES,
  'pricing',
  'sample',
  'about',
  'contact',
  'terms',
  'privacy',
  'refund-policy',
  'sitemap.xml',
  'robots.txt',
] as const;
