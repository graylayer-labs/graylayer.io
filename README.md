# graylayer.io

Source for [graylayer.io](https://graylayer.io), the Graylayer Labs website. Built with Astro.

## Hosting

The site is moving from GitHub Pages to Cloudflare Workers static assets (#21). Cloudflare's Git integration builds every push: `npm run build`, then `npx wrangler deploy` using [`wrangler.jsonc`](wrangler.jsonc), which serves `dist/`. Pushes to `main` deploy production; other branches and PRs get preview URLs. Response headers live in [`public/_headers`](public/_headers). DNS for graylayer.io is on Cloudflare; the domain stays registered at Squarespace.

Until the cutover in #21 is done, GitHub Pages (`.github/workflows/deploy.yml`, `public/CNAME`) still serves graylayer.io.

## Feed and sitemap

- RSS: `/rss.xml` (full post content, canonical links), built from `src/pages/rss.xml.ts` with the same visibility helper as the pages, so drafts and example posts are left out of production.
- Sitemap: `/sitemap-index.xml` (listed in `public/robots.txt`); the 404 page and example pages are excluded.
- Post pages carry `og:type` article, published/modified time and tag meta. There are no generated OG images yet, so Twitter cards use `summary` until a post or site image is set.

## Run locally

```bash
npm ci
npm run dev      # local server
npm run check    # astro check
npm run build    # production build into dist/
```

## Licence

The code is MIT ([LICENSE](LICENSE)); the site's written content is all rights reserved ([CONTENT-LICENSE](CONTENT-LICENSE)).
