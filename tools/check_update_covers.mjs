import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = process.argv[2] ? resolve(process.argv[2]) : resolve(root, 'src/content/updates');
// Compare the 16:9 compositions readers see in the updates list. Small lighting
// or character changes do not make a fresh cover of the same camera position.
const similarityLimit = 0.11;
const covers = [];
const errors = [];

for (const name of (await readdir(postsDir)).filter((name) => name.endsWith('.md')).sort()) {
  const text = await readFile(resolve(postsDir, name), 'utf8');
  const [, frontmatter, body = ''] = text.split(/^---\s*$/m);
  const value = frontmatter?.match(/^cover:\s*(.+)$/m)?.[1]?.trim();
  if (!value) continue;
  const image = resolve(postsDir, value.replace(/^(['"])(.*)\1$/, '$2'));
  const bytes = await readFile(image);
  const digest = createHash('sha256').update(bytes).digest('hex');
  const pixels = await sharp(bytes).resize(64, 36, { fit: 'cover' }).removeAlpha().toColourspace('srgb').raw().toBuffer();
  covers.push({ name, digest, pixels });

  const inline = [...body.matchAll(/!\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)]
    .map((match) => match[1]).filter((source) => !/^(?:[a-z]+:|\/)/i.test(source));
  const seen = new Set([digest]);
  for (const source of inline.map((source) => resolve(postsDir, source))) {
    const inlineDigest = createHash('sha256').update(await readFile(source)).digest('hex');
    if (inlineDigest === digest) errors.push(`${name}: cover is repeated in the article body`);
    else if (seen.has(inlineDigest)) errors.push(`${name}: image is repeated in the article body`);
    seen.add(inlineDigest);
  }
}

for (let i = 0; i < covers.length; i++) {
  for (let j = i + 1; j < covers.length; j++) {
    const a = covers[i], b = covers[j];
    let difference = 0;
    for (let k = 0; k < a.pixels.length; k++) difference += Math.abs(a.pixels[k] - b.pixels[k]);
    const distance = difference / a.pixels.length / 255;
    if (a.digest === b.digest || distance < similarityLimit) {
      errors.push(`${a.name} and ${b.name}: ${a.digest === b.digest ? 'duplicate' : 'near-duplicate'} covers`);
    }
  }
}

if (errors.length) {
  console.error(`Update cover review failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Update covers: ${covers.length} checked; no duplicate or near-duplicate covers, and no repeated local images within articles.`);
}
