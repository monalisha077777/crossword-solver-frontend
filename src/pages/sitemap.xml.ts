import { CROSSWORD_SOURCES } from '../lib/api';

const SITE_URL = 'https://crosswordsolver.dev';

const pages = [
  '/',
  '/archive',
  '/crossword-solver',
  ...CROSSWORD_SOURCES.map((source) => source.todayPath),
];

export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`)
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
