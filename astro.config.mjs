import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

import sitemap from '@astrojs/sitemap';

// Plugin personalizado para guardar datos localmente sin necesitar backend
function localAdminApi() {
  return {
    name: 'local-admin-api',
    /** @param {import('vite').ViteDevServer} server */
    configureServer(server) {
      server.middlewares.use((/** @type {any} */ req, /** @type {any} */ res, /** @type {any} */ next) => {
        if (req.url === '/api/save-review' && req.method === 'POST') {
          let body = '';
          req.on('data', (/** @type {any} */ chunk) => body += chunk.toString());
          req.on('end', () => {
            try {
              const newReview = JSON.parse(body);
              const dataPath = path.resolve('./src/data/reviews.json');
              const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
              
              const slug = newReview.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              
              currentData[slug] = newReview;
              fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 4));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, slug }));
            } catch (error) {
              const err = /** @type {Error} */ (error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/save-news' && req.method === 'POST') {
          let body = '';
          req.on('data', (/** @type {any} */ chunk) => body += chunk.toString());
          req.on('end', () => {
            try {
              const newNews = JSON.parse(body);
              const dataPath = path.resolve('./src/data/news.json');
              
              /** @type {Record<string, any>} */
              let currentData = {};
              if (fs.existsSync(dataPath)) {
                  currentData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
              }
              
              const slug = newNews.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              
              currentData[slug] = newNews;
              fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 4));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, slug }));
            } catch (error) {
              const err = /** @type {Error} */ (error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://paralajecritico.vercel.app',
  vite: {
    plugins: [
        tailwindcss(),
        localAdminApi()
    ]
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin')
    })
  ]
});