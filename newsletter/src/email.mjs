// Email-safe presentation: inline styles, fluid tables, system fonts, no scripts.
// Issue content is structured and frozen in the existing campaign approval hash.
const SITE = 'https://projectchimera.dev';
const MARK = `${SITE}/media/newsletter/chimera-mark.png`;
const esc = (v) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (v, max) => {
  if (typeof v !== 'string' || !v.trim() || v.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]|\/Users\/|file:\/\//.test(v)) throw new Error('invalid_issue');
  return v.trim();
};
function siteURL(v, image = false) {
  const u = new URL(v);
  if (u.origin !== SITE || u.username || u.password || u.search || u.hash || (image && (!/^\/(?:media\/newsletter|_astro)\//.test(u.pathname) || !/\.(?:png|jpe?g|webp)$/i.test(u.pathname)))) throw new Error('invalid_issue');
  return u.href;
}
function shot(v, sources) {
  if (!v || !sources.includes(v.href)) throw new Error('invalid_issue');
  return { src: siteURL(v.src, true), alt: text(v.alt, 400), caption: text(v.caption, 400), href: siteURL(v.href) };
}
export function normalizeIssue(issue, sources) {
  if (!issue || issue.version !== 1 || !Array.isArray(issue.features) || issue.features.length < 2 || issue.features.length > 4) throw new Error('invalid_issue');
  return {
    version: 1, number: text(issue.number, 16), date: text(issue.date, 60), title: text(issue.title, 140),
    preheader: text(issue.preheader, 180), intro: text(issue.intro, 1400), hero: shot(issue.hero, sources),
    features: issue.features.map(f => ({ title: text(f.title, 100), label: text(f.label, 50), body: text(f.body, 1000), image: shot(f.image, sources) })),
    next: text(issue.next, 1000), buildNote: text(issue.buildNote, 500),
  };
}
const p = (s, extra = '') => `<p style="margin:0 0 18px;color:#e9dcc3;font:16px/1.65 Arial,Helvetica,sans-serif;${extra}">${esc(s)}</p>`;
const link = (href, label) => `<a href="${esc(href)}" style="color:#d2a866;text-decoration:underline;text-underline-offset:3px;">${esc(label)}</a>`;
const button = (href, label) => `<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#d2a866" style="background-color:#d2a866;"><a href="${esc(href)}" style="display:inline-block;padding:15px 22px;color:#120f16;text-decoration:none;font:bold 16px/1.4 Arial,Helvetica,sans-serif;">${esc(label)} &rarr;</a></td></tr></table>`;
function photo(image) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:0 6px 6px 0;background-color:#7e6c93;"><a href="${esc(image.href)}"><img src="${esc(image.src)}" width="604" alt="${esc(image.alt)}" style="display:block;width:100%;max-width:604px;height:auto;border:0;background-color:#252030;color:#e9dcc3;font:14px/1.5 Arial,Helvetica,sans-serif;"></a></td></tr></table><p style="margin:10px 0 0;color:#bfb0cf;font:12px/1.6 Arial,Helvetica,sans-serif;">${esc(image.caption)}</p>`;
}
function shell({ title, preheader, content, footer, issueLabel = 'THE DEVELOPMENT LETTERS', preview = false }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${esc(title)}</title><style>body{margin:0;padding:0}table{border-collapse:collapse}img{border:0;outline:none;text-decoration:none}a{word-break:break-word}@media screen and (max-width:600px){.email-pad{padding-left:22px!important;padding-right:22px!important}.email-title{font-size:34px!important;line-height:1.12!important}.email-heading{font-size:25px!important}.email-meta{font-size:10px!important}}</style></head><body bgcolor="#120f16" style="margin:0;padding:0;background-color:#120f16;color:#e9dcc3;-webkit-text-size-adjust:100%;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;mso-hide:all;">${esc(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#120f16"><tr><td align="center" style="padding:24px 8px;"><!--[if mso]><table role="presentation" width="680"><tr><td><![endif]--><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1b1720" style="width:100%;max-width:680px;background-color:#1b1720;border:1px solid #615564;"><tr><td class="email-pad" style="padding:26px 36px;border-bottom:1px solid #615564;"><table role="presentation" width="100%"><tr><td width="34" valign="middle"><a href="${SITE}/"><img src="${MARK}" alt="" width="24" height="28" style="display:block;border:0;"></a></td><td valign="middle"><a href="${SITE}/" style="color:#e9dcc3;text-decoration:none;font:30px/1.1 Georgia,'Times New Roman',serif;">Chimera</a></td><td align="right" valign="middle" class="email-meta" style="color:#bfb0cf;font:11px/1.6 Arial,Helvetica,sans-serif;letter-spacing:1px;">${esc(issueLabel)}</td></tr></table></td></tr>${preview ? `<tr><td class="email-pad" style="padding:12px 36px;background-color:#30272b;color:#d2a866;font:bold 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:1px;">PREVIEW &middot; FOR NIC ONLY &middot; NOT A CAMPAIGN</td></tr>` : ''}${content}<tr><td class="email-pad" style="padding:28px 36px;border-top:1px solid #615564;background-color:#120f16;">${footer}</td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
}
function footerHTML(unsubscribeURL, senderFooter, preview) {
  return `<p style="margin:0 0 12px;color:#bfb0cf;font:12px/1.7 Arial,Helvetica,sans-serif;">${esc(senderFooter)}</p><p style="margin:0 0 12px;color:#b3a6a6;font:12px/1.7 Arial,Helvetica,sans-serif;">${preview ? 'Sent only to Nic for review. This preview does not join or activate a mailing list.' : 'You subscribed to occasional Chimera updates. Leave whenever you need to.'}</p><p style="margin:0;font:12px/1.7 Arial,Helvetica,sans-serif;">${link(unsubscribeURL, 'Unsubscribe')} &nbsp;&middot;&nbsp; ${link(SITE+'/', 'projectchimera.dev')}</p>`;
}
export function issueText(issue) {
  return [`LETTERS FROM CHIMERA · ${issue.number} · ${issue.date}`, issue.title, issue.intro, issue.hero.caption, issue.hero.href,
    ...issue.features.flatMap(f => [f.title, f.body, f.image.caption, f.image.href]),
    "WHAT'S NEXT", issue.next, `${SITE}/roadmap/`, issue.buildNote, `Read the record: ${SITE}/updates/`, '— Nichalas'].join('\n\n');
}
export function renderIssue(issue, { unsubscribeURL, senderFooter, preview = false }) {
  const blocks = issue.features.map((f, i) => `<tr><td class="email-pad" style="padding:32px 36px;border-top:1px solid #443b49;"><p style="margin:0 0 10px;color:#d2a866;font:bold 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:2px;">0${i+1} &nbsp;/&nbsp; ${esc(f.label.toUpperCase())}</p><h2 class="email-heading" style="margin:0 0 16px;color:#e9dcc3;font:29px/1.15 Georgia,'Times New Roman',serif;">${esc(f.title)}</h2>${p(f.body)}${photo(f.image)}<p style="margin:18px 0 0;font:13px/1.5 Arial,Helvetica,sans-serif;">${link(f.image.href, 'Read this update →')}</p></td></tr>`).join('');
  const content = `<tr><td class="email-pad" style="padding:34px 36px 28px;"><p style="margin:0 0 16px;color:#d2a866;font:11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:2px;">LETTER ${esc(issue.number)} &nbsp;&middot;&nbsp; ${esc(issue.date.toUpperCase())}</p><h1 class="email-title" style="margin:0 0 22px;color:#e9dcc3;font:43px/1.08 Georgia,'Times New Roman',serif;">${esc(issue.title)}</h1>${p(issue.intro)}${photo(issue.hero)}</td></tr>${blocks}<tr><td class="email-pad" style="padding:30px 36px;background-color:#252030;border-top:1px solid #7e6c93;"><p style="margin:0 0 10px;color:#d2a866;font:bold 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:2px;">WHAT'S NEXT</p>${p(issue.next)}<p style="margin:0 0 24px;font:13px/1.5 Arial,Helvetica,sans-serif;">${link(SITE+'/roadmap/', 'Follow the roadmap →')}</p>${p(issue.buildNote,'color:#bfb0cf;font-size:13px;border-left:2px solid #d2a866;padding-left:14px;')}${button(SITE+'/updates/','Read the record')}${p('— Nichalas','margin-top:24px;margin-bottom:0;font-family:Georgia,serif;')}</td></tr>`;
  return {
    html: shell({ title: issue.title, preheader: issue.preheader, content, footer: footerHTML(unsubscribeURL, senderFooter, preview), issueLabel: 'THE PAINTED WORLD', preview }),
    text: `${preview ? 'PREVIEW FOR NIC ONLY. Not a campaign.\n\n' : ''}${issueText(issue)}\n\n${senderFooter}\n${preview ? 'This preview does not join or activate a mailing list.' : 'You subscribed to Chimera updates.'}\nUnsubscribe: ${unsubscribeURL}\n${SITE}/`,
  };
}
export function renderConfirmation(confirmURL) {
  return {
    text: `You asked for occasional Chimera development updates and demo news.\n\nConfirm your subscription:\n${confirmURL}\n\nThis link expires in 24 hours. If you did not sign up, ignore this email.\n\nChimera · https://projectchimera.dev/`,
    html: shell({ title: 'Keep a thread with Chimera', preheader: 'Confirm your email to receive occasional letters from the painted world.', issueLabel: 'KEEP A THREAD', content: `<tr><td class="email-pad" style="padding:38px 36px;"><p style="margin:0 0 16px;color:#d2a866;font:11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:2px;">LETTERS FROM CHIMERA</p><h1 class="email-title" style="margin:0 0 22px;color:#e9dcc3;font:40px/1.1 Georgia,serif;">A little closer<br>to the painted world.</h1>${p('You asked for occasional Chimera development updates and demo news. Confirm your email and you will hear when there is something new to see or play.')}${button(confirmURL,'Confirm my subscription')}<p style="margin:24px 0 0;color:#bfb0cf;font:13px/1.7 Arial,Helvetica,sans-serif;">This link expires in 24 hours. If you did not sign up, ignore this email. You have not joined the active list until you confirm.</p></td></tr>`, footer: `<p style="margin:0;color:#bfb0cf;font:12px/1.7 Arial,Helvetica,sans-serif;">Chimera, a game by Nichalas Barnes.<br>${link(SITE+'/', 'Visit projectchimera.dev')}</p>` }),
  };
}
export function renderPlainNewsletter(subject, body, { unsubscribeURL, senderFooter }) {
  const paragraphs = body.split(/\n\s*\n/).map(s => p(s)).join('');
  return { text: `${body}\n\n${senderFooter}\nYou subscribed to Chimera updates.\nUnsubscribe: ${unsubscribeURL}`, html: shell({ title: subject, preheader: subject, content: `<tr><td class="email-pad" style="padding:36px;"><h1 class="email-title" style="color:#e9dcc3;font:38px/1.15 Georgia,serif;margin:0 0 24px;">${esc(subject)}</h1>${paragraphs}</td></tr>`, footer: footerHTML(unsubscribeURL,senderFooter,false) }) };
}
