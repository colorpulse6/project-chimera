// @ts-check
import { defineConfig } from 'astro/config';

// The site lives at colorpulse6.github.io/project-chimera. Set SITE_BASE="" and
// SITE_URL for a custom domain without touching the pages.
const base = process.env.SITE_BASE ?? '/project-chimera';
const site = process.env.SITE_URL ?? 'https://colorpulse6.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: { responsiveStyles: true },
});
