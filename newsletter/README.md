# Chimera email updates

Our signup page, subscriber database, confirmation/unsubscribe flow and campaign
ledger. Cloudflare runs the API and a separate private D1 database. Resend carries
the messages. No subscriber list or credentials belong in the website repository.

## Current status

The separate Worker and D1 database are deployed. The Chimera sending domain,
domain-restricted sending key, reply forwarding and signed feedback endpoint are
configured. An owner-only live test reached Gmail, activated only after explicit
confirmation, and unsubscribed successfully. Forwarding also reached Gmail.
The site form is live at `https://projectchimera.dev/subscribe/`. Its native form
submission, received confirmation, activation and unsubscribe were verified.
Three owner-only technical test messages were sent. No newsletter campaign or
scheduled agent run has been sent or installed.

The live feedback endpoint rejected a forged signature and accepted a controlled
signed event and its replay. A genuine provider bounce/complaint has not yet been
generated. Verify that provider path before unattended campaign sending. Local
test delivery is not real delivery; provider acceptance does not prove inbox
placement. Test campaigns must never be sent without the owner's approval.

Private operator credentials and owner-test evidence are stored outside this
repository in `~/Library/Application Support/ChimeraNewsletter/`, with restricted
file permissions. Load `operator.env` privately when using the CLI. Never print
or commit its values. Retain the signing secrets for existing subscriber links.

## What runs where

- `src/pages/subscribe.astro`: the signup page; normal HTML POST, native email
  validation, a honeypot and explicit Chimera-only consent.
- `src/data/newsletter.ts`: the public `/subscribe` API endpoint. No secret.
- `newsletter/src/worker.mjs`: public signup/confirmation/unsubscribe endpoints
  and private bearer-authenticated operator endpoints.
- D1: pending, confirmed and unsubscribed addresses; consent version; immutable
  campaign content and recipient delivery states. Raw IP addresses are not kept.
- `cli.mjs`: prepares public-source drafts and stages/inspects/sends campaigns.
  Drafts and exports live in the operator's private application-data directory.
- Claude: can edit the draft from the selected public sources. It does not need
  subscriber addresses. See `AGENT-BRIEF.md`. No automatic schedule is installed.

## Local checks

```sh
cd newsletter
npm ci
npm test
npm run check
```

Tests use actual SQLite statements and a controlled mail transport, with no real
recipients or network delivery. `check` bundles for Workers without deploying.

## Initial production setup (completed on 2 November 2026)

Use the existing Cloudflare account, with a new `chimera-newsletter` database and
Worker. Do not bind another product's database. Create and deploy resources only
after the owner approves this concrete change.

On this machine, use `--profile chimera-newsletter` for Wrangler resource commands.
That private profile uses the existing Cloudflare login; the unrelated default
profile was left unchanged. It is retained for future service maintenance.

1. `npx wrangler d1 create chimera-newsletter`. Put the returned database ID in
   `wrangler.jsonc`; apply `npx wrangler d1 migrations apply chimera-newsletter --remote`.
2. Set `API_URL` to the Worker's canonical HTTPS URL. Keep `SITE_URL` equal to
   `https://projectchimera.dev`. A different alias must not change email payloads
   that share a Resend idempotency key.
3. Configure a verified Chimera sender in Resend and a sending key for that
   identity. Keep other products' sender identities and keys separate.
4. Set private Worker secrets with `npx wrangler secret put NAME`:
   `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `FROM_EMAIL`, optional `REPLY_TO`, `ADMIN_KEY`, `TOKEN_SECRET`,
   and `MAIL_FOOTER` (the owner-approved sender identity/contact footer).
   `ADMIN_KEY` and `TOKEN_SECRET` must be independent random secrets of at least
   32 characters. Back them up privately before deployment. Retain `TOKEN_SECRET`:
   replacing it invalidates existing confirmation and unsubscribe links.
5. Set a Resend webhook to `/webhooks/resend` for bounced, complained and suppressed
   messages. Its signing secret must match `RESEND_WEBHOOK_SECRET`. Verify a signed
   provider event against a test subscription; forged or stale events must fail.
6. Deploy the Worker, verify the real confirmation flow with an owner-approved
   test address, then set `newsletter.formAction` to its HTTPS `/subscribe` URL.
7. Build and inspect the site, then publish after owner approval. Confirm the
   live form works, including keyboard navigation and narrow mobile widths.

The site remains on GitHub Pages. No website hosting migration or nameserver
change is required. Sender verification may require mail-specific DNS records.
The database is accessible only through the Cloudflare account and the private
operator API, not through the static site.

## Prepare, review and send

Keep these environment variables in the private operator environment:

```text
CHIMERA_NEWSLETTER_URL=https://YOUR-WORKER-URL
CHIMERA_NEWSLETTER_ADMIN_KEY=PRIVATE_SECRET
```

```sh
node cli.mjs prepare --since 2026-11-01
# Edit the generated private draft.json using public-sources.json only.
node cli.mjs stage /PRIVATE/DRAFT/PATH/draft.json
node cli.mjs show CAMPAIGN_ID
# Only after approval of the exact content and recipient count:
node cli.mjs send CAMPAIGN_ID --approve CONTENT_HASH --max-batches 1
```

Each batch handles at most ten recipients; one command permits at most ten
batches. Explicit limits help protect the mail account's quota. No scheduled
newsletter runs, campaign sends or list exports happen during `prepare`.

The content hash prevents sending a different draft accidentally. It is not
proof of a person's approval. The operator must follow the owner's actual send
authorization. Creation freezes the opted-in audience. Every delivery rechecks
the recipient's current subscription state before claiming the message.

Resend idempotency keys protect repeated provider calls within its documented
24-hour window. Our own delivery ledger persists longer. `sending`, `unknown`
and `failed` deliveries are held; commands never automatically requeue them.
If a request or process is interrupted, inspect its campaign before taking any
further action. Do not create a replacement campaign to work around uncertainty.

`sent` in the ledger means accepted by the provider, not delivered to an inbox.
Signed bounce/complaint/suppression events stop further messages to the matching
Chimera subscriber. The first live release still needs that provider integration
and sender/delivery monitoring verified before unattended bulk sending.

## Privacy and limits

Only confirmed subscriptions enter a campaign. GET confirmation/unsubscribe
links show a button rather than changing subscription state, so link scanners
do not activate or cancel subscriptions. Signed one-click unsubscribe POSTs are
supported. The API uses no-store/no-referrer responses and does not log addresses,
tokens, request bodies or credentials.

Public signup is rate-limited per connection in short windows. Request bodies
have a size limit. Addresses are normalized for duplicate prevention. An API
failure leaves the signup incomplete and displays an error rather than claiming
it was completed. A pending database record is not an active subscriber.

Cloudflare and Resend account limits still apply. Do not enable paid plans or
raise spending limits automatically. A separate decision is needed for a
newsletter schedule and whether future sends require per-message review.
