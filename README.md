# Chimera, where the game stands

The status site for Chimera, a role-playing game being built in Unreal Engine 5.
Live at https://colorpulse6.github.io/project-chimera/ (deployed from `main` by
GitHub Actions). Built with Astro; no server, no database.

## Post an update

1. Add a markdown file to `src/content/updates/`, named `YYYY-MM-DD-slug.md`.
2. Front matter:

   ```yaml
   ---
   title: Five drawn figures, a street, and a packaged build
   date: 2026-10-22
   summary: One or two sentences shown in lists.
   cover: ../../assets/media/street-arrival.jpg   # optional, 16:9 reads best
   coverAlt: What the cover shows.
   tags: [build, characters]
   ---
   ```

3. Write the body in markdown. Images: `![alt](../../assets/media/name.jpg)`.
   Images under `src/assets/media/` are resized and converted at build time.
4. Commit and push to `main`. The site rebuilds in about a minute.

## Screenshots and clips

- Stills from the review rig go through `tools/prep_media.py` (run it with the
  `chimera-ml` venv, which has Pillow). It resizes and crops from
  `fresh-game/review/...` into `src/assets/media/`. Add a line there for a new
  frame rather than copying 3 MB PNGs by hand.
- GIFs and short videos go in `public/media/` and are referenced with a string
  path, which the `Frame` component plays inline and muted:

  ```astro
  <Frame src="media/kai-run.mp4" alt="Kai running across the courtyard." caption="Run cycle." />
  ```

  In markdown, use `<video src="/project-chimera/media/kai-run.mp4" autoplay muted loop playsinline></video>`
  or a plain `![alt](/project-chimera/media/kai-walk.gif)`. Prefer mp4 or webm
  over gif: a quarter of the size for the same loop.

## Pages and data

- `src/pages/` has one file per page. The home page's status ledger is written
  by hand there; update it when the ledger changes.
- `src/data/characters.ts`, `places.ts`, `roadmap.ts` feed the Characters,
  World and Roadmap pages. Each entry has a `status` of `built`, `now` or `next`.
- `src/styles/global.css` holds the palette and type. The colours come from the
  look contract in `fresh-game/LOOK-CONTRACT.md`.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321/project-chimera/
npm run build     # writes dist/
```

Node 22 or newer. To host at a custom domain, set `SITE_BASE=""` and
`SITE_URL=https://example.com` when building.

The browser game that lived here before is tagged `legacy-browser-game` in git.

## Clips

Gameplay recordings go in `public/media/` as mp4 (H.264, no audio). To trim and cut loops from a screen recording:

```sh
ffmpeg -ss 2.4 -to 41.0 -i recording.mov -an -vf "fps=30,scale=1280:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/media/clip.mp4
ffmpeg -ss 19.5 -to 25.0 -i recording.mov -an -vf "fps=30,scale=960:-2" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart public/media/loop-street.mp4
```

Loops autoplay muted through the `Frame` component (`<Frame src="media/loop-street.mp4" poster="media/poster.jpg" />`). Longer clips use a plain `<video controls>` so the reader chooses to play them.
