import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [command, ...args] = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
const positional = args[0];
const fail = (message) => { throw new Error(message); };

async function api(path, data) {
  const endpoint = process.env.CHIMERA_NEWSLETTER_URL;
  const key = process.env.CHIMERA_NEWSLETTER_ADMIN_KEY;
  if (!endpoint || !key) fail('Set CHIMERA_NEWSLETTER_URL and CHIMERA_NEWSLETTER_ADMIN_KEY in the private operator environment.');
  const url = new URL(path, endpoint);
  if (url.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(url.hostname)) fail('The newsletter API must use HTTPS.');
  const response = await fetch(url, { method: data ? 'POST' : 'GET', headers: { authorization: `Bearer ${key}`, ...(data ? { 'content-type': 'application/json' } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}), signal: AbortSignal.timeout(180000) });
  const result = await response.json();
  if (!response.ok) fail(`Newsletter API ${response.status}: ${result.error || 'request failed'}. No automatic retry was attempted.`);
  return result;
}

async function prepare() {
  const since = flag('--since');
  if (!since || !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(since) || !Number.isFinite(Date.parse(since))) fail('Use prepare --since YYYY-MM-DD (or an ISO timestamp).');
  const source = new URL('../src/content/updates/', import.meta.url);
  const posts = [];
  for (const file of await readdir(source)) {
    if (!file.endsWith('.md')) continue;
    const text = await readFile(new URL(file, source), 'utf8');
    const front = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!front) continue;
    const date = front[1].match(/^date:\s*(.+)$/m)?.[1]?.trim();
    if (!date || Date.parse(date) <= Date.parse(since)) continue;
    const title = front[1].match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '') || file;
    const summary = front[1].match(/^summary:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '') || '';
    posts.push({ title, summary, date, url: `https://projectchimera.dev/updates/${file.slice(0, -3)}/`, public_markdown: text.slice(front[0].length).trim() });
  }
  posts.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  if (!posts.length) { console.log('No new public updates. No draft or email was created.'); return; }
  if (posts.length > 30) fail('More than 30 updates selected. Narrow --since before drafting.');
  const root = join(homedir(), 'Library', 'Application Support', 'ChimeraNewsletter', 'drafts');
  await mkdir(root, { recursive: true, mode: 0o700 });
  const out = join(root, new Date().toISOString().replace(/[:.]/g, '-'));
  await mkdir(out, { mode: 0o700 });
  const draft = { subject: 'A letter from Chimera', text: posts.map((p) => `${p.title}\n${p.summary}\n${p.url}`).join('\n\n'), sources: posts.map((p) => p.url) };
  await writeFile(join(out, 'draft.json'), JSON.stringify(draft, null, 2) + '\n', { mode: 0o600 });
  await writeFile(join(out, 'public-sources.json'), JSON.stringify({ since, posts }, null, 2) + '\n', { mode: 0o600 });
  console.log(`Prepared ${posts.length} public updates in ${out}. Edit draft.json, review it, then stage it. Nothing was sent.`);
}

try {
  if (command === 'prepare') await prepare();
  else if (command === 'stats') console.log(JSON.stringify(await api('/admin/stats'), null, 2));
  else if (command === 'stage') {
    if (!positional) fail('Use stage /private/path/to/draft.json.');
    const draft = JSON.parse(await readFile(positional, 'utf8'));
    if (/\/Users\/|file:\/\/|(?:API_KEY|Bearer\s+[A-Za-z0-9])/.test(draft.text || '')) fail('The draft contains a private path or credential-like text. Review it before staging.');
    console.log(JSON.stringify(await api('/admin/campaigns', draft), null, 2));
  } else if (command === 'show') {
    if (!positional) fail('Use show CAMPAIGN_ID.');
    console.log(JSON.stringify(await api(`/admin/campaigns/${encodeURIComponent(positional)}`), null, 2));
  } else if (command === 'send') {
    const hash = flag('--approve');
    const batches = Number(flag('--max-batches') || '1');
    if (!positional || !/^[a-f0-9]{64}$/.test(hash || '') || !Number.isInteger(batches) || batches < 1 || batches > 10) fail('Use send CAMPAIGN_ID --approve EXACT_CONTENT_HASH --max-batches 1..10. Each batch sends at most 10 messages.');
    for (let i = 0; i < batches; i++) {
      const result = await api(`/admin/campaigns/${encodeURIComponent(positional)}/send`, { approved_content_hash: hash });
      console.log(JSON.stringify(result, null, 2));
      if (result.deliveries.some((d) => ['unknown', 'sending', 'failed'].includes(d.state))) fail('Delivery needs review. No further batch or retry was attempted.');
      if (!result.deliveries.some((d) => d.state === 'pending')) break;
    }
  } else fail('Commands: prepare --since DATE | stats | stage FILE | show ID | send ID --approve HASH [--max-batches N].');
} catch (error) { console.error(error.message); process.exitCode = 1; }
