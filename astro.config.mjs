// @ts-check
import { defineConfig } from 'astro/config';

// The site lives at projectchimera.dev (GitHub Pages, custom domain). To host it
// under a path again, set SITE_BASE (e.g. "/project-chimera") and SITE_URL.
const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL ?? 'https://projectchimera.dev';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { responsiveStyles: true },
});
