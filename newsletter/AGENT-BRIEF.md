# Chimera email writer

Purpose: turn newly published Chimera site updates into an occasional, readable
email. Use Claude if that is the owner's selected agent. This brief does not
create an agent, schedule a run or authorize a send.

1. Run `node newsletter/cli.mjs prepare --since LAST_COVERED_TIMESTAMP` from the
   site checkout. If there are no new public posts, stop without creating mail.
2. Read the generated private `public-sources.json`. Use only those public
   updates, their linked site pages and already-published images. Do not read
   internal game reports, story spoilers, subscriber records or credentials.
3. Rewrite the private `draft.json` subject and text. Keep its source URLs.
   Use short, concrete sentences. Group changes into a few useful developments.
   Preserve the difference between an internal build and a public downloadable
   demo; between a packaged feature and Nic's acceptance; between measured and
   unmeasured results. Do not invent numbers, promises, lore or release dates.
4. Keep the email useful to someone following the game: what changed, one or two
   links to see it, and what they can currently play. Do not copy raw diagnostics,
   local file paths or an entire chronological work log into the email.
5. Show the exact draft and selected posts to the owner. Do not stage or send
   unless the current task or an explicit standing policy authorizes that step.
6. An authorized operator stages the reviewed draft, inspects the returned
   content hash and frozen audience count, then uses the bounded send command.
   Treat failed, interrupted and unknown outcomes as a stop, not permission to
   retry. Never bypass the campaign ledger or send from personal Gmail.

Report prepared/staged/accepted-by-provider/confirmed-delivered separately. Do
not claim successful exits, a provider ID or a database row prove inbox delivery.
Retain the last covered timestamp only after the intended send is resolved.
