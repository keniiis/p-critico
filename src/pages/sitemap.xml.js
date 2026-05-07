import newsData from '../data/news.json';
import reviewsData from '../data/reviews.json';

export async function GET() {
  const site = 'https://paralajecritico.vercel.app';
  
  // 1. Obtener slugs de noticias y reseñas de los imports (más seguro en Vercel)
  const newsSlugs = Object.keys(newsData);
  const reviewsSlugs = Object.keys(reviewsData);
  
  // 2. Páginas estáticas principales (aseguramos trailing slash)
  const staticPages = [
    '/',
    '/news/',
    '/reviews/',
  ];
  
  // Construir el XML de forma limpia
  const urls = [
    ...staticPages.map(path => `${site}${path}`),
    ...newsSlugs.map(slug => `${site}/news/${slug}/`),
    ...reviewsSlugs.map(slug => `${site}/reviews/${slug}/`)
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === site + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
