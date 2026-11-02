import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { handle } from '../src/worker.mjs';

function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_newsletter.sql', import.meta.url), 'utf8'));
  const env = {
    DB: { prepare(sql) { return { bind(...values) { return {
      async first() { return db.prepare(sql).get(...values) || null; },
      async all() { return { results: db.prepare(sql).all(...values) }; },
      async run() { return db.prepare(sql).run(...values); },
    }; } }; } },
    SITE_URL: 'https://projectchimera.dev', API_URL: 'https://newsletter.example',
    TOKEN_SECRET: 'test-token-secret-not-a-production-secret-123',
    ADMIN_KEY: 'test-admin-secret-not-a-production-secret-123',
    RESEND_API_KEY: 'fake-test-key', FROM_EMAIL: 'Chimera <updates@example.com>',
    RESEND_WEBHOOK_SECRET: 'whsec_dGVzdC1vbmx5LW5vdC1wcm9kdWN0aW9u',
    MAIL_FOOTER: 'Chimera test sender identity',
  };
  const mails = [];
  const transport = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    const mail = { payload: JSON.parse(options.body), key: options.headers['idempotency-key'] };
    mails.push(mail);
    return Response.json({ id: `test-provider-${mails.length}` });
  };
  const request = (path, data, { admin = false, method = data === undefined ? 'GET' : 'POST', origin = env.SITE_URL, mailer = transport } = {}) => handle(new Request(new URL(path, env.API_URL), {
    method, headers: { ...(data === undefined ? {} : { 'content-type': 'application/json', origin }), ...(admin ? { authorization: `Bearer ${env.ADMIN_KEY}` } : {}) },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  }), env, mailer);
  const signup = (email = 'reader@example.com', options) => request('/subscribe', { email, consent: 'chimera-updates-v1' }, options);
  const confirmURL = () => new URL(mails.at(-1).payload.text.match(/https:\/\/\S+/)[0]);
  const activate = async (email = 'reader@example.com') => {
    assert.equal((await signup(email)).status, 200);
    const url = confirmURL();
    assert.equal((await request('/confirm', Object.fromEntries(url.searchParams))).status, 200);
    return db.prepare('SELECT * FROM subscribers WHERE email=?').get(email);
  };
  const campaign = async () => {
    const response = await request('/admin/campaigns', { subject: 'A new place to walk', text: 'The latest record.\nhttps://projectchimera.dev/updates/a-place-to-walk/', sources: ['https://projectchimera.dev/updates/a-place-to-walk/'] }, { admin: true });
    assert.equal(response.status, 200);
    return response.json();
  };
  const send = (c, hash = c.content_hash, options = {}) => request(`/admin/campaigns/${c.id}/send`, { approved_content_hash: hash }, { admin: true, ...options });
  return { db, env, mails, request, signup, confirmURL, activate, campaign, send, transport };
}

test('signup requires confirmation; a link-scanner GET never activates the address', async () => {
  const f = fixture();
  const response = await f.signup(' Reader@Example.com ');
  assert.equal(response.status, 200);
  assert.doesNotMatch(await response.text(), /reader@example\.com/);
  assert.equal(f.mails.length, 1);
  const url = f.confirmURL();
  assert.equal((await f.request(url.pathname + url.search)).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'pending');
  assert.equal((await f.request('/confirm', { id: url.searchParams.get('id'), token: 'forged' })).status, 400);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'pending');
  assert.equal((await f.request('/confirm', Object.fromEntries(url.searchParams))).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'active');
  await f.signup();
  assert.equal(f.mails.length, 1, 'active subscribers receive no repeated confirmation');
});

test('expired confirmation is rejected; a later signup gets a new token', async () => {
  const f = fixture();
  await f.signup(); const old = f.confirmURL();
  f.db.exec('UPDATE subscribers SET confirmation_expires=0,last_confirmation=0');
  assert.equal((await f.request(old.pathname + old.search)).status, 410);
  await f.signup();
  assert.notEqual(f.confirmURL().searchParams.get('token'), old.searchParams.get('token'));
  assert.equal((await f.request('/confirm', Object.fromEntries(old.searchParams))).status, 400);
});

test('origin, consent, validation, honeypot and attempt limit protect the public endpoint', async () => {
  const f = fixture();
  assert.equal((await f.signup('reader@example.com', { origin: 'https://unrelated.example' })).status, 403);
  assert.equal((await f.signup('bad\r\naddress')).status, 400);
  assert.equal((await f.request('/subscribe', { email: 'reader@example.com' })).status, 400);
  assert.equal((await f.request('/subscribe', { email: 'reader@example.com', website: 'spam' })).status, 200);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n, 0);
  assert.equal(f.mails.length, 0);
  for (let i = 0; i < 5; i++) assert.equal((await f.signup(`reader${i}@example.com`)).status, 200);
  assert.equal((await f.signup('sixth@example.com')).status, 429);
});

test('incomplete configuration and oversized requests cannot collect or send', async () => {
  const f = fixture();
  delete f.env.RESEND_API_KEY;
  assert.equal((await f.signup()).status, 503);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n, 0);
  delete f.env.TOKEN_SECRET;
  assert.equal((await f.request('/confirm?id=x&token=x')).status, 503);
  const g = fixture();
  assert.equal((await g.request('/subscribe', { email: 'x'.repeat(25000) })).status, 400);
  assert.equal(g.mails.length, 0);
});

test('a confirmation timeout stays pending and is not retried immediately', async () => {
  const f = fixture(); let attempts = 0;
  const failed = async () => { attempts++; throw new Error('timeout after remote acceptance'); };
  assert.equal((await f.signup('reader@example.com', { mailer: failed })).status, 503);
  assert.equal((await f.signup('reader@example.com', { mailer: failed })).status, 200);
  assert.equal(attempts, 1);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'pending');
});

test('confirmation retry within its lifetime keeps the exact provider idempotency payload', async () => {
  const f = fixture(); await f.signup();
  const first = structuredClone(f.mails[0]);
  f.db.exec('UPDATE subscribers SET last_confirmation=0');
  await f.signup();
  assert.deepEqual(f.mails[1], first);
});

test('simultaneous signups do not replace a live confirmation token', async () => {
  const f = fixture();
  const responses = await Promise.all([f.signup(), f.signup()]);
  assert.ok(responses.every((r) => r.status === 200));
  assert.equal(f.mails.length, 1);
  assert.equal((await f.request('/confirm', Object.fromEntries(f.confirmURL().searchParams))).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'active');
});

test('private endpoints reject missing credentials and campaigns cannot include pending subscribers', async () => {
  const f = fixture(); await f.signup();
  assert.equal((await f.request('/admin/subscribers')).status, 401);
  const c = await f.campaign();
  assert.equal(c.audience, 0);
  await f.activate('other@example.com');
  assert.equal((await f.campaign()).audience, 0, 'repeat creation keeps the original audience snapshot');
});

test('sending needs exact content approval and a complete sender identity', async () => {
  const f = fixture(); await f.activate(); const c = await f.campaign();
  const count = f.mails.length;
  assert.equal((await f.send(c, 'unreviewed')).status, 409);
  delete f.env.MAIL_FOOTER;
  assert.equal((await f.send(c)).status, 503);
  assert.equal(f.mails.length, count);
});

test('one approved email per recipient, duplicate calls do not resend, one-click unsubscribe works', async () => {
  const f = fixture(); const reader = await f.activate(); const c = await f.campaign();
  assert.equal(c.audience, 1);
  const count = f.mails.length;
  await Promise.all([f.send(c), f.send(c)]);
  await f.send(c);
  assert.equal(f.mails.length, count + 1);
  const sent = f.mails.at(-1);
  assert.deepEqual(sent.payload.to, ['reader@example.com']);
  assert.equal(sent.payload.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  const unsub = new URL(sent.payload.headers['List-Unsubscribe'].slice(1, -1));
  assert.equal((await f.request(unsub.pathname + unsub.search)).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers WHERE id=?').get(reader.id).state, 'active');
  assert.equal((await f.request(unsub.pathname + unsub.search, { 'List-Unsubscribe': 'One-Click' })).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers WHERE id=?').get(reader.id).state, 'unsubscribed');
});

test('unsubscribe after audience snapshot is honored before sending', async () => {
  const f = fixture(); const reader = await f.activate(); const c = await f.campaign();
  f.db.prepare("UPDATE subscribers SET state='unsubscribed' WHERE id=?").run(reader.id);
  const count = f.mails.length;
  const result = await (await f.send(c)).json();
  assert.deepEqual(result.deliveries, [{ state: 'skipped', count: 1 }]);
  assert.equal(f.mails.length, count);
});

test('ambiguous and interrupted deliveries are held, never automatically retried', async () => {
  const f = fixture(); await f.activate(); const c = await f.campaign();
  let attempts = 0;
  const failed = async () => { attempts++; throw new Error('remote result unknown'); };
  await f.send(c, c.content_hash, { mailer: failed });
  await f.send(c, c.content_hash, { mailer: failed });
  assert.equal(attempts, 1);
  assert.equal(f.db.prepare('SELECT state FROM deliveries').get().state, 'unknown');
  f.db.exec("UPDATE deliveries SET state='sending'");
  await f.send(c, c.content_hash, { mailer: failed });
  assert.equal(attempts, 1);
});

test('unsupported or malformed requests do not expose application data', async () => {
  const f = fixture();
  const bad = new Request('https://newsletter.example/subscribe', { method: 'POST', body: '{bad', headers: { origin: f.env.SITE_URL, 'content-type': 'application/json' } });
  assert.equal((await handle(bad, f.env, f.transport)).status, 400);
  assert.equal((await f.request('/subscribe')).status, 404);
  assert.equal((await f.request('/admin/campaigns', { subject: 'Spoiler', text: 'Private material', sources: ['file:///private/story'] }, { admin: true })).status, 400);
});

test('only signed current provider feedback suppresses the matching Chimera subscriber', async () => {
  const f = fixture(); const reader = await f.activate();
  const payload = JSON.stringify({ type: 'email.complained', data: { to: [reader.email], tags: { product: 'chimera', subscriber: reader.id } } });
  const id = 'msg_fixture', timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac('sha256', Buffer.from(f.env.RESEND_WEBHOOK_SECRET.slice(6), 'base64')).update(`${id}.${timestamp}.${payload}`).digest('base64');
  const request = (sig, time = timestamp, body = payload) => new Request('https://newsletter.example/webhooks/resend', { method: 'POST', headers: { 'svix-id': id, 'svix-timestamp': time, 'svix-signature': sig }, body });
  assert.equal((await handle(request('v1,forged'), f.env)).status, 400);
  assert.equal((await handle(request(`v1,${signature}`, '1'), f.env)).status, 400);
  assert.equal((await handle(request(`v1,${signature}`, timestamp, payload + ' '), f.env)).status, 400);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'active');
  assert.equal((await handle(request(`v1,old v1,${signature}`), f.env)).status, 200);
  assert.equal((await handle(request(`v1,${signature}`), f.env)).status, 200);
  assert.equal(f.db.prepare('SELECT state FROM subscribers').get().state, 'suppressed');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM provider_events').get().n, 1);
  const count = f.mails.length;
  await f.signup();
  assert.equal(f.mails.length, count, 'complaints cannot be bypassed by another public signup');
});
