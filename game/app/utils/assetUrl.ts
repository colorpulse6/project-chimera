/**
 * Prepend the Next.js basePath to an asset path.
 * In production, assets live under /project-chimera/play/ but raw img.src
 * and CSS url() don't get the basePath automatically — only Next.js
 * components (Image, Link) do.
 */
const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/project-chimera/play" : "";

export function assetUrl(path: string): string {
  return BASE_PATH + path;
}
