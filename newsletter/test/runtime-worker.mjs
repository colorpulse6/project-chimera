// Explicit local-only mail stub. The production Worker never imports this file.
import { handle } from '../src/worker.mjs';
const outbox = [];
const mailer = async (url, options) => {
  if (url !== 'https://api.resend.com/emails') throw new Error('unexpected_test_destination');
  outbox.push({ ...JSON.parse(options.body), idempotency_key: options.headers['idempotency-key'] });
  return Response.json({ id: `local-proof-${outbox.length}` });
};
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) return new Response('Local test only', { status: 403 });
    if (url.pathname === '/__test/outbox') return Response.json(outbox);
    return handle(request, env, mailer);
  },
};
