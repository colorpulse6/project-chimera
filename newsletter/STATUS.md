# Email signup status · 2 November 2026

WRITTEN: `/subscribe/`, navigation/footer links, our private-list Worker and D1
schema, confirmation/unsubscribe flow, signed provider feedback, campaign ledger,
bounded sending CLI and Claude draft instructions.

VERIFIED locally: site build (36 pages), 14 behavioral checks, Workers bundle,
actual local Worker + D1 flow through signup, confirmation, one send, repeat-send
prevention and unsubscribe. The mail transport in the runtime proof is a local
stub. These local checks are separate from the live checks below.

Nic chose drafts for review first. No scheduled runs or unattended sending are
authorized. Intended sender: `updates@projectchimera.dev`, with replies forwarded
to the owner's existing inbox. The alias was saved and a message addressed to
`updates@projectchimera.dev` reached the owner's Gmail inbox through Namecheap.

DEPLOYED: `https://chimera-newsletter.colorpulse.workers.dev`, separate D1
`chimera-newsletter` (`eadbedae-be65-466a-97ce-dbf550fa3301`), verified Resend
domain, Chimera-only sending key and failure-feedback webhook. Secrets are stored
privately outside the repository and in Worker secrets, never in site code.

VERIFIED live: owner confirmation reached Gmail INBOX with SPF/DKIM passing;
GET confirmation left the record pending, explicit POST made it active; GET
unsubscribe left it active, explicit POST made it unsubscribed. The owner test
address is left unsubscribed. Two technical test emails were sent, no campaigns.
The real feedback endpoint rejected a forged signature and accepted an operator-
signed controlled event plus replay. No genuine provider bounce/complaint was
generated; that provider path remains unverified before unattended bulk sending.

The form endpoint is enabled locally. The final site build passes (36 pages).
Desktop and 390/320-pixel mobile layouts were inspected. Keyboard navigation
from the email input reaches submit, and the browser blocks a malformed address
before submission. Mobile emulation is off and the prior browser zoom restored.
Code remains isolated from the automatic site publisher. Nothing for this
feature is merged or published yet.

Required next work:

1. Obtain site publication approval, integrate with current site updates, publish
   and verify the live page and native form submission.
2. Before any unattended bulk sending, verify genuine provider failure feedback.
   No unattended sending is authorized; Claude remains drafts-for-review only.

The local preview and feature worktree are retained while setup and review are
pending. The main site checkout is clean and its normal build was restored.
