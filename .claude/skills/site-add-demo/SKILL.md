---
name: site-add-demo
description: Use when adding a demo (video, Hugging Face Space, iframe or interactive widget) to a graylayer.io project page.
---

# site-add-demo

Demos are entries in the project's frontmatter `demos` list (`src/content/projects/<slug>/index.md`). The project page renders each with `src/components/Demo.astro` under a "Demo" heading and shows a "Try the demo" button when the list is non-empty.

## Steps

1. Branch and board item as in `site-new-project`.
2. Add to the frontmatter:

   ```yaml
   demos:
     - kind: hf-space          # video | hf-space | iframe | widget
       src: https://<owner>-<space>.hf.space
       caption: "What the viewer is looking at"
   ```

   - `video`: `src` is rendered as `<video controls>`. Host the file at `public/demos/<slug>/<name>.mp4` (`src: /demos/<slug>/<name>.mp4`; keep it small, a few MB, H.264) or use an absolute URL.
   - `hf-space`: use the direct embed URL `https://<user>-<space>.hf.space`, not the `huggingface.co/spaces/...` page URL (that refuses to be framed).
   - `iframe`: any embeddable HTTPS page that allows framing. Pages of this site itself cannot be framed because `public/_headers` sends `X-Frame-Options: DENY`; changing that is a hosting change (see `site-hosting`).
   - `widget`: an interactive page you build yourself. Put it as a static page under `public/demos/<slug>/index.html` and use `kind: widget`, `src: /demos/<slug>/`.
   - An empty `src: ""` renders a labelled placeholder (used by example content). Do not leave an empty src on real content.
3. Check: `npx astro check`, `npm run build`, then `npm run dev` and open `/projects/<slug>/#demo`. Confirm it loads, is not blank, and works at phone width.
4. Commit `feat(content): add <kind> demo to <slug>`, hand to github-manager.

## Gotchas

- Third-party embeds load content from that origin; only embed things the owner controls or has agreed to.
- Large media in the repo slows every clone; if a file is over about 10 MB, host it elsewhere and use the URL.
