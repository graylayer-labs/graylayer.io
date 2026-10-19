---
name: site-update-about
description: Use when editing the About page of graylayer.io (bio prose, skills, links), which lives in src/content/about.md.
---

# site-update-about

The About page is `src/content/about.md`: frontmatter for structured fields, Markdown body for the prose bio.

## Fields

```md
---
name: Eoin Mc Allister
title: Applied Machine Learning Engineer
location: Dublin, Ireland
skills:
  - label: Modelling
    items: [PyTorch, XGBoost]
links:
  - { label: GitHub, url: "https://github.com/graylayer-labs" }
---

Bio prose in Markdown.
```

All of `name`, `title`, `location`, `skills` and `links` are required (schema in `src/content.config.ts`). The footer picks the `GitHub` and `LinkedIn` labels from `links`, so keep those labels exact.

## Steps

1. Branch and board item as in `site-new-project`.
2. Edit `src/content/about.md`. Only state what the owner gave you; do not invent roles, dates or numbers.
3. `npx astro check`, `npm run build`, view `/about/` with `npm run dev` and the footer on any page.
4. Commit `docs(about): <what changed>`, hand to github-manager.

## What goes on the page

Prose, skills and profile links only. github-manager's pre-push check blocks other personal details (eoin-james/claude-config#148 tracks that check), so do not add them to a branch you push.