import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const site = 'https://paralajecritico.vercel.app';
  
  // 1. Obtener slugs de noticias
  const newsPath = path.resolve('./src/data/news.json');
  const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
  const newsSlugs = Object.keys(newsData);
  
  // 2. Obtener slugs de reseñas
  const reviewsPath = path.resolve('./src/data/reviews.json');
  const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
  const reviewsSlugs = Object.keys(reviewsData);
  
  // 3. Páginas estáticas principales
  const staticPages = [
    '',
    '/news/',
    '/reviews/',
  ];
  
  // Construir el XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(url => `
  <url>
    <loc>${site}${url}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`).join('')}
  ${newsSlugs.map(slug => `
  <url>
    <loc>${site}/news/${slug}/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  ${reviewsSlugs.map(slug => `
  <url>
    <loc>${site}/reviews/${slug}/</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
