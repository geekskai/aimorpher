import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/seo';
import { getLivePrimaryProfileUsernames } from '@/lib/server/sitemap';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const usernames = await getLivePrimaryProfileUsernames();
    return buildSitemapEntries(usernames);
  } catch (error) {
    console.error('Failed to add live profiles to sitemap:', error);
    return buildSitemapEntries([]);
  }
}
