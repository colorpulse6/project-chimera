// Operator-only preview. No subscriber lookup, campaign API, or list send exists here.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { normalizeIssue, renderIssue } from './src/email.mjs';

export const OWNER_PREVIEW_ADDRESS = 'colorpulse@gmail.com';
export function previewRecipient(value) {
  if (value !== OWNER_PREVIEW_ADDRESS) throw new Error('Previews are restricted to the owner address. No email was sent.');
  return value;
}
export function previewPayload(draft, env, to) {
  previewRecipient(to);
  if (typeof draft.subject !== 'string' || !draft.subject.trim() || draft.subject.length > 150 || /[\r\n]/.test(draft.subject)) throw new Error('Invalid preview subject.');
  const issue = normalizeIssue(draft.issue, draft.sources);
  const url = new URL(env.CHIMERA_NEWSLETTER_PREVIEW_UNSUBSCRIBE_URL);
  if (url.origin !== 'https://chimera-newsletter.colorpulse.workers.dev' || url.pathname !== '/unsubscribe' || !url.searchParams.get('id') || !url.searchParams.get('token')) throw new Error('Preview needs the owner-only signed unsubscribe link.');
  if (!env.FROM_EMAIL || !env.MAIL_FOOTER) throw new Error('Preview sender details are missing.');
  return { from: env.FROM_EMAIL, reply_to: env.REPLY_TO || 'updates@projectchimera.dev', to: [to], subject: `[PREVIEW] ${draft.subject}`, ...renderIssue(issue, { unsubscribeURL: url.href, senderFooter: env.MAIL_FOOTER, preview: true }) };
}

export async function sendOwnerPreview(draft, env, to, { transport = fetch, root = join(homedir(), 'Library', 'Application Support', 'ChimeraNewsletter', 'previews') } = {}) {
  const payload = previewPayload(draft, env, to);
  if (!env.RESEND_API_KEY) throw new Error('The private preview sending key is missing.');
  const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  await mkdir(root, { recursive: true, mode: 0o700 });
  const file = join(root, hash + '.json');
  // Exclusive claim is our durable no-repeat guard, including unknown outcomes.
  await writeFile(file, JSON.stringify({ state: 'sending', subject: payload.subject, started: new Date().toISOString() }), { flag: 'wx', mode: 0o600 }).catch(() => { throw new Error('This exact preview was already attempted. Inspect its private receipt; no retry was made.'); });
  await writeFile(join(root, hash + '.html'), payload.html, { mode: 0o600 });
  await writeFile(join(root, hash + '.txt'), payload.text, { mode: 0o600 });
  let receipt;
  try {
    const response = await transport('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', 'idempotency-key': `chimera-owner-preview/${hash}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    receipt = response.ok && typeof result.id === 'string' ? { state: 'accepted', provider_id: result.id } : { state: response.status >= 500 ? 'unknown' : 'failed', code: `provider_${response.status}` };
  } catch { receipt = { state: 'unknown', code: 'provider_outcome_unknown' }; }
  await writeFile(file, JSON.stringify({ ...receipt, subject: payload.subject, finished: new Date().toISOString() }, null, 2), { mode: 0o600 });
  if (receipt.state !== 'accepted') throw new Error('Preview delivery needs reconciliation. No automatic retry was made.');
  return { ...receipt, subject: payload.subject, recipient: OWNER_PREVIEW_ADDRESS, receipt: file };
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  try {
    const [file, flag, recipient] = process.argv.slice(2);
    if (!file || flag !== '--to') throw new Error('Use node preview.mjs PRIVATE_DRAFT.json --to colorpulse@gmail.com.');
    console.log(JSON.stringify(await sendOwnerPreview(JSON.parse(await readFile(file, 'utf8')), process.env, recipient)));
  } catch (error) { console.error(error.code === 'EEXIST' ? 'Preview already attempted; no retry made.' : error.message); process.exitCode = 1; }
}
