import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://graylayer.io',
  integrations: [
    // Example content (SHOW_EXAMPLES builds) and the 404 page never go in the sitemap.
    sitemap({ filter: (page) => !/\/404\/?$/.test(page) && !page.includes('/example-') }),
  ],
  output: 'static',
});
