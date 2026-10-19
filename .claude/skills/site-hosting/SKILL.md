---
name: site-hosting
description: Use when changing how graylayer.io is built, deployed or served (Cloudflare Workers static assets, DNS, headers, redirects, preview builds, custom domains) or when a deploy or Cloudflare build check fails.
---

# site-hosting

For the general Cloudflare playbook (accounts, tokens, wrangler, DNS in general) see claude-config #149; this file is only about this site.

## How the site is served

| Layer | Where | Notes |
|---|---|---|
| Domain registration | Squarespace Domains (ex-Google Domains) | No API or CLI. Only the owner can change it, in the browser. |
| DNS | Cloudflare zone `graylayer.io`, Free plan | Nameservers are Cloudflare's, set at Squarespace. DNSSEC off. No MX records: the domain has no email. |
| Hosting | Cloudflare Worker `graylayer-io`, static assets from `dist/` | Config in `wrangler.jsonc`. Headers in `public/_headers`. |
| Domains | `graylayer.io` and `www.graylayer.io` are Worker custom domains | Added in PR #35, cutover done 2026-10-19 (about 21:10). Cloudflare manages their DNS records and certificates. Also `workers.dev` and preview URLs are on (`workers_dev`, `preview_urls`). |
| Build | Cloudflare Git integration on `graylayer-labs/graylayer.io` | Production (`main`): build `npm run build`, deploy `npx wrangler deploy`. Other branches (Previews Base): build `npm run build`, preview command `npx wrangler preview` (Worker Previews, open beta; one preview per branch). |

GitHub Pages is not fully gone yet: `.github/workflows/deploy.yml` and `public/CNAME` are still on `main` and the workflow runs on every push. Their removal is PR #41 (issue #34); it touches a protected path, so the owner merges it by hand. Do not remove them from a session. (PR #32 was closed in favour of #35, which merged and moved the domains to Cloudflare.) Check what serves the site: `dig +short graylayer.io A` (Cloudflare addresses) and `curl -sI https://graylayer.io | grep -i server` (`cloudflare`). To see which Worker, domains and DNS records are set, read `wrangler.jsonc` and the Cloudflare dashboard (Workers & Pages > graylayer-io > Settings > Domains & Routes; DNS > Records), or `npx wrangler deployments list`.

## Before you change anything

- `npx wrangler whoami` shows the owner's account. If it fails, ask the owner to run `npx wrangler login` in his own terminal. Never ask for or paste API tokens in chat, and never write account IDs, zone IDs or tokens into this repo.
- Reproduce a build locally the way Cloudflare does: fresh clone or worktree, `npm clean-install`, `npm run build`, `npx wrangler deploy --dry-run`. If that passes and Cloudflare's check fails, the cause is a dashboard setting, not the code.
- Serve the built output locally: `npm run preview` (Astro) or `npx wrangler dev` for the Worker behaviour (headers, trailing slashes, 404 page).

## Common tasks

- **Headers or caching:** edit `public/_headers`. Hashed files under `/_astro/` are cached for a year; pages are not. Check with `curl -sI` after deploy.
- **Redirects** for moved pages: `public/_redirects` (path-based only). Host-based redirects need a Cloudflare Redirect Rule in the dashboard.
- **Assets behaviour:** `html_handling: auto-trailing-slash` and `not_found_handling: 404-page` in `wrangler.jsonc` mean `/about` redirects to `/about/` (served from `about/index.html`) and unknown paths return `404.html` with status 404.
- **Custom domains:** a Worker custom domain needs the zone Active and no conflicting DNS record for that hostname; remove old A/CNAME records first or the attach fails.
- **Preview builds:** every non-production branch and PR gets a "Workers Builds" check and a preview URL. Requires the `"previews"` setting described below.

## Gotchas learned during the move (2026-10-19)

- Cloudflare's DNS import adds a `_domainconnect` CNAME from Squarespace; it is safe to delete.
- The nameserver change reached the `.io` registry about 15 minutes after saving in Squarespace. Check the registry directly: `dig +norecurse @$(dig +short NS io. | head -1) graylayer.io NS`.
- Branch builds use the Previews Base command (`npx wrangler preview`), which fails unless `wrangler.jsonc` has a `"previews": {}` block. Test a preview locally with `npx wrangler preview --name <test>`, then remove it with `npx wrangler preview delete --name <test> -y`.
- Cloudflare's "Workers Builds" check is not a required GitHub check; required ones are `checks / checks` and `gate / gate`.
- While GitHub Pages and Cloudflare both served the site, proxying in front of GitHub Pages broke certificate renewal; irrelevant now but explains older notes.
- The Cloudflare check comment prints the account ID on PRs. It is not a secret, but do not copy it into the repo.
- A pending (not Active) zone makes every deploy with custom domains fail.

## Repo and PR rules that bite

- Commit subjects at most 72 characters; PR titles at most 66 (the org gate), so the squash subject fits.
- The gate wants `Closes #N` and at most 400 changed lines (lockfiles excluded). A whole-site change needs the owner's bypass merge.
- Changing `.github/workflows/*` touches a protected path: the owner merges that PR by hand.
- Stacked PRs: merge without `--delete-branch`, or the child PR is closed instead of retargeted. After a squash merge, rebase the child with `git rebase --onto origin/main <old-parent-tip>` and push it as a new branch if a force-push is not allowed.
- Remote writes (push, PR, issues) go through github-manager; commit locally.
