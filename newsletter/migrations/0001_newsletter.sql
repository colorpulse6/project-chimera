CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  state TEXT NOT NULL CHECK (state IN ('pending', 'active', 'unsubscribed', 'suppressed')),
  confirmation_nonce TEXT NOT NULL,
  confirmation_expires INTEGER NOT NULL,
  last_confirmation INTEGER,
  consent_version TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  confirmed_at INTEGER,
  updated_at INTEGER NOT NULL
);
CREATE INDEX subscribers_state ON subscribers(state, id);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires INTEGER NOT NULL
);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  content_hash TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sources TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE deliveries (
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  subscriber_id TEXT NOT NULL REFERENCES subscribers(id),
  state TEXT NOT NULL CHECK (state IN ('pending', 'sending', 'sent', 'failed', 'unknown', 'skipped')),
  provider_id TEXT,
  attempted_at INTEGER,
  error_code TEXT,
  PRIMARY KEY (campaign_id, subscriber_id)
);

CREATE TABLE provider_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at INTEGER NOT NULL
);
