# graylayer.io

Source for [graylayer.io](https://graylayer.io), the Graylayer Labs website. Built with Astro.

## Hosting

The site is served by Cloudflare Workers static assets on graylayer.io and www.graylayer.io (custom domains in `wrangler.jsonc`). Cloudflare's Git integration builds every push: `npm run build`, then `npx wrangler deploy` using [`wrangler.jsonc`](wrangler.jsonc), which serves `dist/`. Pushes to `main` deploy production; other branches and PRs get preview URLs. Response headers live in [`public/_headers`](public/_headers). DNS for graylayer.io is on Cloudflare; the domain stays registered at Squarespace.

## Run locally

```bash
npm ci
npm run dev      # local server
npm run check    # astro check
npm run build    # production build into dist/
```

## Licence

The code is MIT ([LICENSE](LICENSE)); the site's written content is all rights reserved ([CONTENT-LICENSE](CONTENT-LICENSE)).
