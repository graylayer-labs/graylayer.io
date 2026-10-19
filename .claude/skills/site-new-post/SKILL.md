---
name: site-new-post
description: Use when writing or publishing a blog post (a numbered part of a project) on graylayer.io, including checking its preview and the RSS syndication.
---

# site-new-post

Posts live inside a project: `src/content/posts/<project-slug>/<post-slug>.md`, URL `/projects/<project-slug>/<post-slug>/`. The project must already exist in `src/content/projects/` (see `site-new-project`), otherwise the build fails on the `project` reference.

## Steps

1. **Board item and branch** as in `site-new-project` (issue via github-manager, worktree, `npm ci`).
2. **Create the file** with this frontmatter:

   ```md
   ---
   project: aerial-person-detection   # folder name of the project
   part: 1                            # positive integer; order within the project
   title: "Post title"
   description: "One sentence; used on the page and in link previews and the feed."
   pubDate: 2026-10-20                # YYYY-MM-DD
   updatedDate: 2026-10-25            # optional; adds article:modified_time
   tags: [detection, thermal]         # optional; shown on the post and in the feed
   draft: true                        # true keeps it out of pages, feed and sitemap
   ---

   Body in Markdown. Start at `##` headings; the title is the page `h1`.
   ```

   Keep `draft: true` while writing; set `false` when ready to publish. `part` numbers order the series and drive the previous/next cards; keep them unique per project.
3. **Check.** `npx astro check`, `npm run build`. Drafts are hidden everywhere, including `npm run dev`, so to see one set `draft: false` temporarily and do not commit that by accident.
4. **Preview URL.** After github-manager pushes and opens the draft PR, Cloudflare posts a "Workers Builds" check with a preview URL for the branch. Open `<preview>/projects/<project>/<post>/` and check: title, tags, part nav, code blocks, images.
5. **Check the built HTML** (`npm run build`): in `dist/projects/<project>/<post>/index.html` there is `og:type` `article`, `article:published_time`, `article:tag`, and an absolute canonical link; `dist/rss.xml` has an `<item>` with the same canonical URL and `content:encoded` with the full body.
6. **Syndication** (after the PR is merged and deployed):
   - dev.to: it imports from the RSS feed `https://graylayer.io/rss.xml`; confirm the post appears there with the canonical URL pointing back to graylayer.io. Setting that up is an owner step in his dev.to account; ask him if it has not been done.
   - LinkedIn: no automation. Give the owner the live post URL and a two-line summary to post himself.
7. **Commit**: `feat(content): add <project> part <n>` (subject at most 72 characters), stage by name, hand to github-manager.

## Gotchas

- Images: put files in `public/posts/<project>/` and reference `/posts/<project>/<file>`; there is no image pipeline.
- Do not state results without the run, number and source for them.
- Example posts (`example: true` projects) never appear in production; do not use them as real content.
