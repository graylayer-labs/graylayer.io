import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://graylayer.io',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  // Static output for GitHub Pages
  output: 'static',
});
