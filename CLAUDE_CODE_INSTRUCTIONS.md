# Instructions for Claude Code — Push this site to GitHub

## What this is
This folder is a **finished, production-ready static website** for Arthur Renard
(arthur-renard.com). It is plain HTML/CSS/JS — no build step, no framework, no
dependencies to install. It is ready to deploy as-is.

**Do not re-implement or rewrite it.** Your only task is to get it into a GitHub
repository and (optionally) live on GitHub Pages.

## Files in this project
- `index.html` — Home page
- `about.html` — About page
- `work.html` — Work / projects page
- `connect.html` — Connect / contact page
- `styles.css` — shared stylesheet (sage liquid-glass design system)
- `app.js` — shared behavior (nav, scroll-driven motion)
- `image-slot.js` — web component for the drag-and-drop image frames
- `favicon.svg` — site icon
- `images/everyoneai.png` — everyone.AI logo (used on the Work page)
- `.image-slots.state.json` — persisted images the user dropped into slots.
  **Include this file in the commit** or the portrait / project images will be
  blank. It may be dotfile-ignored by default — force-add it (see below).

## Task: initialize and push

1. Confirm with the user the target repo. If they don't have one yet, ask whether
   to create a new repo (e.g. `arthur-renard-site`) under their account, or push
   to an existing one. Use the `gh` CLI if available.

2. From inside this folder:
   ```bash
   git init
   git add .
   git add -f .image-slots.state.json   # ensure the dropped-images sidecar is tracked
   git commit -m "Arthur Renard personal site"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
   If the repo already exists with history, clone it instead, copy these files in,
   then commit and push.

3. **Optional — deploy with GitHub Pages:** in the repo Settings → Pages, set the
   source to the `main` branch (root). `index.html` will serve as the homepage.
   The site is fully static, so no further configuration is needed.
   If using the `gh` CLI:
   ```bash
   gh repo edit --enable-pages   # or configure Pages via the web UI
   ```

## Things to verify after deploy
- All four pages load and the top nav links work between them.
- The everyone.AI logo shows on the Work page (served from `images/everyoneai.png`).
- Any images the user dropped into slots still appear (depends on
  `.image-slots.state.json` being committed).
- The two Work-page images are clickable: the everyone.AI logo links to
  `https://everyone.ai`, and the Microfinance image links to the user's GitHub repo.

## Notes
- There is **nothing to install or build** — do not add a package.json, bundler,
  or framework. Keep it static.
- If the user later wants a custom domain (arthur-renard.com), add a `CNAME` file
  containing the domain and configure DNS — ask them first.
