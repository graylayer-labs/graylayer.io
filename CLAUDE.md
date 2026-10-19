# graylayer.io

Astro 7 static site for Graylayer Labs, served by a Cloudflare Worker (static assets from `dist/`). Source of truth for hosting: `.claude/skills/site-hosting/SKILL.md`.

## Commands

```bash
npm ci
npm run dev            # local server; example content visible
npx astro check        # types and content schema
npm run build          # into dist/; also run SHOW_EXAMPLES=true npm run build to see example content
```

Run `npx astro check` and `npm run build` before every commit.

## Routes

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/projects/`, `/projects/<slug>/` | `src/pages/projects/index.astro`, `src/pages/projects/[project]/index.astro` |
| `/projects/<slug>/<post>/` | `src/pages/projects/[project]/[post].astro` |
| `/writing/` | `src/pages/writing.astro` |
| `/about/` | `src/pages/about.astro` |
| `/rss.xml`, `/sitemap-index.xml` | `src/pages/rss.xml.ts`, `@astrojs/sitemap` (`astro.config.mjs`) |

## Content model

Schemas are in `src/content.config.ts`.

- Projects: `src/content/projects/<slug>/index.md`.
- Posts: `src/content/posts/<project-slug>/<post-slug>.md` (frontmatter `project`, `part`, `pubDate`, `draft`, `tags`).
- About: `src/content/about.md`.
- Always read projects and posts through `getProjects()` / `getPosts()` in `src/lib/site.ts`. They hide drafts and `example: true` content in production; pages, feed and sitemap all rely on that.

## Skills

- `site-new-project`: add a project.
- `site-new-post`: write and publish a post, check preview and syndication.
- `site-add-demo`: embed a video, Hugging Face Space, iframe or widget.
- `site-update-about`: edit the About page (and the personal-info limit).
- `site-hosting`: Cloudflare build, deploy, DNS, headers, PR rules.

## Rules

- Conventional Commits, subjects at most 72 characters; PR titles at most 66; PR body `Closes #N`.
- Commit locally; pushes, PRs and issues go through github-manager.
- Do not put account IDs, zone IDs or tokens in the repo.
