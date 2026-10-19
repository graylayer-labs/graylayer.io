---
name: site-new-project
description: Use when adding a project to graylayer.io (a new entry under Projects, with its accent colour, cover, links and board item).
---

# site-new-project

A project is one folder: `src/content/projects/<slug>/index.md`. The folder name is the URL (`/projects/<slug>/`). The schema is in `src/content.config.ts`; a build fails if a field is wrong.

## Steps

1. **Board item.** Every non-trivial change starts from a task on the "Graylayer website" board. Ask github-manager (`/github`) to find or create the issue; branch `feat/<issue>-<slug>`. Work in a worktree under `~/Projects/graylayer.io.worktrees/`, then `npm ci`.
2. **Pick the slug.** Lowercase, hyphens, no spaces. Never start it with `example-` (that prefix marks demo content).
3. **Create `src/content/projects/<slug>/index.md`:**

   ```md
   ---
   title: Project name
   summary: One or two sentences for the card and the page hero.
   status: active            # active | finished
   category: research        # research | engineering
   accent: "#0d9488"         # #rrggbb, quoted; colours the page and card
   since: "2026"             # optional, free text
   featured: false           # true puts it on the home page
   stack: [python, pytorch]  # optional
   links:                    # all optional; omit what does not exist
     repo: https://github.com/graylayer-labs/<repo>
     paper: https://...
     dataset: https://...
     weights: https://...
   metrics:                  # optional: label + value tiles
     - { label: mAP, value: "0.81" }
   timeline:                 # optional
     - { date: "Oct 2026", label: Baseline trained }
   ---

   Overview in Markdown (optional). Shown under the hero.
   ```

   Only `title`, `summary`, `status`, `category` and `accent` are required. Quote hex colours and numeric-looking values. Do not invent metrics: use only numbers the owner has given or a repo/run shows. Demos: see `site-add-demo`.
4. **Cover (optional).** Put the image at `public/covers/<slug>.jpg` (create `public/covers/` if missing; landscape, about 1200x630, under 300 KB) and set `cover: /covers/<slug>.jpg` in the frontmatter. Without `cover` the card shows a plain accent panel.
5. **Check.** `npx astro check` then `npm run build`. Preview with `npm run dev` and open `/projects/<slug>/` and `/projects/` (and `/` if featured). Both commands must be clean.
6. **Commit** (Conventional Commits, subject at most 72 characters, stage files by name): `feat(content): add <slug> project`. Hand the branch to github-manager for push and a draft PR with `Closes #N`.

## Gotchas

- Dummy or test projects: set `example: true` (hidden from production builds, shown in dev and with `SHOW_EXAMPLES=true npm run build`) and do not merge them.
- Posts belong to a project by folder name; add them with `site-new-post`.
- The org gate wants a PR title of at most 66 characters and `Closes #N`.
