const CONSENT = 'chimera-updates-v1';
const EMAIL = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
const stmt = (env, sql, ...values) => env.DB.prepare(sql).bind(...values);
const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
export const digest = async (text) => hex(await crypto.subtle.digest('SHA-256', enc.encode(text)));

async function sign(env, text) {
  const key = await crypto.subtle.importKey('raw', enc.encode(env.TOKEN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(text)));
}

async function equal(a, b) {
  const x = await digest(String(a)), y = await digest(String(b));
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

function page(env, title, text, form = '', status = 200) {
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · Chimera</title><style>html{background:#1b1720;color:#e9dcc3;font:18px/1.6 system-ui}main{max-width:34rem;margin:12vh auto;padding:1.5rem}h1{font:2.7rem/1.1 Georgia,serif}a{color:inherit}button{font:inherit;background:#252030;color:inherit;border:1px solid #bfb0cf;padding:.8rem 1.2rem;cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid #d2a866;outline-offset:4px}p{color:#b3a6a6}</style><main><p>Chimera · email updates</p><h1>${escape(title)}</h1><p>${escape(text)}</p>${form}<p><a href="${escape(env.SITE_URL)}/">Return to Chimera</a></p></main></html>`, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" },
  });
}

function tokenForm(path, id, token, label) {
  return `<form method="post" action="${path}"><input type="hidden" name="id" value="${escape(id)}"><input type="hidden" name="token" value="${escape(token)}"><button>${escape(label)}</button></form>`;
}

async function rawBody(request) {
  if (Number(request.headers.get('content-length')) > 24000) throw new Error('body_limit');
  const reader = request.body?.getReader();
  const chunks = [];
  let size = 0;
  if (reader) for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 24000) { await reader.cancel(); throw new Error('body_limit'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const text = new TextDecoder().decode(bytes);
  return text;
}

async function body(request) {
  const text = await rawBody(request);
  if (request.headers.get('content-type')?.includes('application/json')) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new SyntaxError('invalid_request');
    return parsed;
  }
  return Object.fromEntries(new URLSearchParams(text));
}

function mailReady(env) {
  return Boolean(env.RESEND_API_KEY && env.FROM_EMAIL && env.API_URL && env.TOKEN_SECRET?.length >= 32);
}

async function sendMail(env, transport, payload, key) {
  try {
    const response = await transport('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', 'idempotency-key': key },
      body: JSON.stringify({ from: env.FROM_EMAIL, ...(env.REPLY_TO ? { reply_to: env.REPLY_TO } : {}), ...payload }),
      signal: AbortSignal.timeout(15000),
    });
    let result;
    try { result = await response.json(); } catch { return { state: 'unknown', code: 'invalid_provider_response' }; }
    if (response.ok && typeof result.id === 'string') return { state: 'sent', id: result.id };
    return { state: response.status >= 500 ? 'unknown' : 'failed', code: `provider_${response.status}` };
  } catch { return { state: 'unknown', code: 'provider_outcome_unknown' }; }
}

async function subscribe(request, env, transport) {
  const origin = request.headers.get('origin');
  if (origin !== new URL(env.SITE_URL).origin) return page(env, 'Please use the signup page', 'Open the Chimera site to join its email list.', '', 403);
  const data = await body(request);
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || email.length > 254) return page(env, 'Check your email address', 'Please go back and enter a valid email address.', '', 400);
  const accepted = () => page(env, 'Check your inbox', 'If this address can join the list, a confirmation email will arrive shortly. Follow its link to finish signing up.');
  if (data.website) return accepted();
  if (data.consent !== CONSENT) return page(env, 'Please confirm your choice', 'Use the Chimera signup form to request email updates.', '', 400);
  if (!mailReady(env)) return page(env, 'Signups are unavailable for a moment', 'Please try again later. Your subscription has not been completed.', '', 503);
  const time = now();
  const rateKey = await sign(env, `signup-ip:${request.headers.get('cf-connecting-ip') || 'local'}:${Math.floor(time / 900)}`);
  const rate = await stmt(env, 'INSERT INTO rate_limits (key, count, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count', rateKey, time + 1800).first();
  if (rate.count > 5) return page(env, 'Please try again later', 'There have been several signup attempts from this connection. Give it a little time.', '', 429);
  await stmt(env, 'DELETE FROM rate_limits WHERE expires < ?', time).run();
  let row = await stmt(env, 'SELECT * FROM subscribers WHERE email = ?', email).first();
  if (['active', 'suppressed'].includes(row?.state) || (row?.last_confirmation && time - row.last_confirmation < 600)) return accepted();
  if (!row) {
    await stmt(env, `INSERT OR IGNORE INTO subscribers (id,email,state,confirmation_nonce,confirmation_expires,last_confirmation,consent_version,created_at,updated_at)
      VALUES (?,?,'pending',?,?,NULL,?,?,?)`, crypto.randomUUID(), email, crypto.randomUUID(), time + 86400, CONSENT, time, time).run();
    row = await stmt(env, 'SELECT * FROM subscribers WHERE email = ?', email).first();
  }
  if (row.state === 'unsubscribed' || row.confirmation_expires < time) {
    await stmt(env, "UPDATE subscribers SET state='pending',confirmation_nonce=?,confirmation_expires=?,last_confirmation=NULL,consent_version=?,updated_at=? WHERE id=? AND (state='unsubscribed' OR confirmation_expires < ?)", crypto.randomUUID(), time + 86400, CONSENT, time, row.id, time).run();
    row = await stmt(env, 'SELECT * FROM subscribers WHERE id=?', row.id).first();
  }
  if (['active', 'suppressed'].includes(row.state)) return accepted();
  // Reserve this confirmation before contacting the provider. A timeout cannot
  // cause an automatic repeat; a later attempt uses the same nonce and email.
  const claim = await stmt(env, 'UPDATE subscribers SET last_confirmation = ? WHERE id = ? AND confirmation_nonce=? AND state = \'pending\' AND (last_confirmation IS NULL OR last_confirmation <= ?) RETURNING id', time, row.id, row.confirmation_nonce, time - 600).first();
  if (!claim) return accepted();
  const token = await sign(env, `confirm:${row.id}:${row.confirmation_nonce}`);
  const url = new URL('/confirm', env.API_URL);
  url.searchParams.set('id', row.id); url.searchParams.set('token', token);
  const result = await sendMail(env, transport, {
    to: [email], subject: 'Confirm your Chimera email updates',
    tags: [{ name: 'product', value: 'chimera' }, { name: 'subscriber', value: row.id }],
    text: `You asked for occasional Chimera development updates and demo news.\n\nConfirm your subscription:\n${url}\n\nThis link expires in 24 hours. If you did not sign up, ignore this email.`,
    html: `<p>You asked for occasional Chimera development updates and demo news.</p><p><a href="${escape(url)}">Confirm your subscription</a></p><p>This link expires in 24 hours. If you did not sign up, ignore this email.</p>`,
  }, `chimera-confirm/${row.id}/${row.confirmation_nonce}`);
  if (result.state !== 'sent') return page(env, 'We could not confirm delivery', 'Please wait ten minutes and try again. You have not been added to the active mailing list.', '', 503);
  return accepted();
}

async function subscriptionAction(request, env, path) {
  const url = new URL(request.url);
  const data = request.method === 'POST' ? await body(request) : {};
  const id = data.id || url.searchParams.get('id'), token = data.token || url.searchParams.get('token');
  const row = id && await stmt(env, 'SELECT * FROM subscribers WHERE id = ?', id).first();
  const purpose = path === '/confirm' ? `confirm:${id}:${row?.confirmation_nonce}` : `unsubscribe:${id}`;
  if (!row || !token || !await equal(token, await sign(env, purpose))) return page(env, 'This link does not work', 'Please return to Chimera and request a new signup link.', '', 400);
  if (path === '/confirm') {
    if (row.state === 'active') return page(env, 'You are on the list', 'You will hear from Chimera when there is something new to see or play.');
    if (row.state !== 'pending' || row.confirmation_expires < now()) return page(env, 'This confirmation has expired', 'Return to the signup page and request a fresh confirmation email.', '', 410);
    if (request.method === 'GET') return page(env, 'Keep a thread', 'Confirm that you want occasional Chimera development updates and demo news.', tokenForm('/confirm', id, token, 'Confirm my subscription'));
    await stmt(env, "UPDATE subscribers SET state='active',confirmed_at=?,updated_at=? WHERE id=? AND state='pending'", now(), now(), id).run();
    return page(env, 'You are on the list', 'You will hear from Chimera when there is something new to see or play. You can unsubscribe from any update.');
  }
  if (request.method === 'GET') return page(env, 'Leave the loop?', 'You can stop Chimera email updates here.', tokenForm('/unsubscribe', id, token, 'Unsubscribe'));
  await stmt(env, "UPDATE subscribers SET state='unsubscribed',updated_at=? WHERE id=? AND state != 'suppressed'", now(), id).run();
  return page(env, 'You are unsubscribed', 'You will not receive further Chimera email updates.');
}

async function feedback(request, env) {
  if (!env.RESEND_WEBHOOK_SECRET?.startsWith('whsec_')) return json({ error: 'not_configured' }, 503);
  const id = request.headers.get('svix-id'), timestamp = request.headers.get('svix-timestamp'), signatures = request.headers.get('svix-signature') || '';
  if (!id || !/^\d+$/.test(timestamp || '') || Math.abs(now() - Number(timestamp)) > 300) return json({ error: 'invalid_signature' }, 400);
  const text = await rawBody(request);
  const keyBytes = Uint8Array.from(atob(env.RESEND_WEBHOOK_SECRET.slice(6)), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`${id}.${timestamp}.${text}`)));
  const expected = btoa(String.fromCharCode(...signed));
  let valid = false;
  for (const signature of signatures.split(' ')) if (signature.startsWith('v1,') && await equal(signature.slice(3), expected)) valid = true;
  if (!valid) return json({ error: 'invalid_signature' }, 400);
  const event = JSON.parse(text);
  if (!['email.bounced', 'email.complained', 'email.suppressed'].includes(event.type)) return json({ ok: true });
  if (await stmt(env, 'SELECT id FROM provider_events WHERE id=?', id).first()) return json({ ok: true });
  const tags = event.data?.tags;
  if (tags?.product === 'chimera' && typeof tags.subscriber === 'string') {
    const recipient = event.data?.to?.[0];
    if (typeof recipient === 'string') await stmt(env, "UPDATE subscribers SET state='suppressed',updated_at=? WHERE id=? AND email=?", now(), tags.subscriber, recipient.trim().toLowerCase()).run();
  }
  // Updating subscription state is idempotent. Persist the event only afterward,
  // so a database interruption cannot mark unprocessed feedback as complete.
  await stmt(env, 'INSERT OR IGNORE INTO provider_events(id,type,received_at) VALUES(?,?,?)', id, event.type, now()).run();
  return json({ ok: true });
}

async function admin(request, env, transport) {
  if (!env.ADMIN_KEY || env.ADMIN_KEY.length < 32 || !await equal(request.headers.get('authorization'), `Bearer ${env.ADMIN_KEY}`)) return json({ error: 'unauthorized' }, 401);
  const path = new URL(request.url).pathname;
  if (path === '/admin/stats' && request.method === 'GET') return json(await stmt(env, 'SELECT state,COUNT(*) AS count FROM subscribers GROUP BY state').all());
  if (path === '/admin/subscribers' && request.method === 'GET') {
    const url = new URL(request.url), after = url.searchParams.get('after') || '';
    return json(await stmt(env, 'SELECT id,email,state,created_at,confirmed_at,consent_version FROM subscribers WHERE id > ? ORDER BY id LIMIT 100', after).all());
  }
  if (path === '/admin/campaigns' && request.method === 'POST') {
    const data = await body(request);
    if (typeof data.subject !== 'string' || !data.subject.trim() || data.subject.length > 160 || /[\r\n]/.test(data.subject) || typeof data.text !== 'string' || !data.text.trim() || data.text.length > 16000 || !Array.isArray(data.sources) || !data.sources.length || data.sources.length > 30 || data.sources.some((s) => !/^https:\/\/projectchimera\.dev\/updates\/[a-z0-9-]+\/$/.test(s))) return json({ error: 'invalid_campaign' }, 400);
    const canonical = JSON.stringify({ subject: data.subject, text: data.text, sources: data.sources });
    const hash = await digest(canonical), id = crypto.randomUUID();
    await stmt(env, 'INSERT OR IGNORE INTO campaigns(id,content_hash,subject,body,sources,created_at) VALUES(?,?,?,?,?,?)', id, hash, data.subject, data.text, JSON.stringify(data.sources), now()).run();
    const campaign = await stmt(env, 'SELECT * FROM campaigns WHERE content_hash=?', hash).first();
    // Snapshot the opted-in audience only on first creation, never on a repeat.
    if (campaign.id === id) await stmt(env, "INSERT INTO deliveries(campaign_id,subscriber_id,state) SELECT ?,id,'pending' FROM subscribers WHERE state='active'", id).run();
    return json({ id: campaign.id, content_hash: hash, subject: campaign.subject, sources: JSON.parse(campaign.sources), audience: (await stmt(env, 'SELECT COUNT(*) AS count FROM deliveries WHERE campaign_id=?', campaign.id).first()).count });
  }
  const match = path.match(/^\/admin\/campaigns\/([a-f0-9-]+)(\/send)?$/);
  if (!match) return json({ error: 'not_found' }, 404);
  const campaign = await stmt(env, 'SELECT * FROM campaigns WHERE id=?', match[1]).first();
  if (!campaign) return json({ error: 'not_found' }, 404);
  const counts = async () => (await stmt(env, 'SELECT state,COUNT(*) AS count FROM deliveries WHERE campaign_id=? GROUP BY state', campaign.id).all()).results;
  if (request.method === 'GET' && !match[2]) return json({ id: campaign.id, content_hash: campaign.content_hash, subject: campaign.subject, text: campaign.body, sources: JSON.parse(campaign.sources), deliveries: await counts() });
  if (request.method !== 'POST' || !match[2]) return json({ error: 'method_not_allowed' }, 405);
  const approval = await body(request);
  if (approval.approved_content_hash !== campaign.content_hash) return json({ error: 'exact_content_approval_required' }, 409);
  if (!mailReady(env) || !env.MAIL_FOOTER || !env.RESEND_WEBHOOK_SECRET) return json({ error: 'sender_setup_incomplete' }, 503);
  const pending = await stmt(env, "SELECT d.subscriber_id,s.email,s.state FROM deliveries d JOIN subscribers s ON s.id=d.subscriber_id WHERE d.campaign_id=? AND d.state='pending' ORDER BY d.subscriber_id LIMIT 10", campaign.id).all();
  for (const row of pending.results) {
    if (row.state !== 'active') { await stmt(env, "UPDATE deliveries SET state='skipped' WHERE campaign_id=? AND subscriber_id=? AND state='pending'", campaign.id, row.subscriber_id).run(); continue; }
    const claimed = await stmt(env, "UPDATE deliveries SET state='sending',attempted_at=? WHERE campaign_id=? AND subscriber_id=? AND state='pending' AND EXISTS(SELECT 1 FROM subscribers WHERE id=? AND state='active') RETURNING subscriber_id", now(), campaign.id, row.subscriber_id, row.subscriber_id).first();
    if (!claimed) continue;
    const token = await sign(env, `unsubscribe:${row.subscriber_id}`);
    const unsub = new URL('/unsubscribe', env.API_URL); unsub.searchParams.set('id', row.subscriber_id); unsub.searchParams.set('token', token);
    const footer = `${env.MAIL_FOOTER}\nYou subscribed to Chimera updates.\nUnsubscribe: ${unsub}`;
    const htmlBody = escape(campaign.body).replace(/https:\/\/projectchimera\.dev\/[a-zA-Z0-9/_-]*/g, (url) => `<a href="${url}">${url}</a>`).replace(/\n/g, '<br>');
    const result = await sendMail(env, transport, { to: [row.email], subject: campaign.subject, text: `${campaign.body}\n\n${footer}`, html: `<div style="font:16px/1.6 Georgia,serif;max-width:640px">${htmlBody}<hr><p>${escape(env.MAIL_FOOTER)}<br>You subscribed to Chimera updates. <a href="${escape(unsub)}">Unsubscribe</a></p></div>`, tags: [{ name: 'product', value: 'chimera' }, { name: 'subscriber', value: row.subscriber_id }], headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } }, `chimera-update/${campaign.id}/${row.subscriber_id}`);
    await stmt(env, 'UPDATE deliveries SET state=?,provider_id=?,error_code=? WHERE campaign_id=? AND subscriber_id=?', result.state, result.id || null, result.code || null, campaign.id, row.subscriber_id).run();
  }
  return json({ id: campaign.id, deliveries: await counts(), note: 'Unknown or interrupted sends are held for manual reconciliation; they are never automatically retried.' });
}

export async function handle(request, env, transport = fetch) {
  try {
    const path = new URL(request.url).pathname;
    if (path === '/health' && request.method === 'GET') return json({ service: 'chimera-newsletter', configured: mailReady(env) });
    if (!env.DB || !env.SITE_URL || !env.TOKEN_SECRET || env.TOKEN_SECRET.length < 32) return json({ error: 'not_configured' }, 503);
    if (path === '/webhooks/resend' && request.method === 'POST') return await feedback(request, env);
    if (path === '/subscribe' && request.method === 'POST') return await subscribe(request, env, transport);
    if (['/confirm', '/unsubscribe'].includes(path) && ['GET', 'POST'].includes(request.method)) return await subscriptionAction(request, env, path);
    if (path.startsWith('/admin/')) return await admin(request, env, transport);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    if (['body_limit', 'Unexpected'].some((s) => error.message?.startsWith(s)) || error instanceof SyntaxError) return json({ error: 'invalid_request' }, 400);
    // No request bodies, addresses, tokens or credentials are written to logs.
    return json({ error: 'temporarily_unavailable' }, 503);
  }
}

export default { fetch: (request, env) => handle(request, env) };
