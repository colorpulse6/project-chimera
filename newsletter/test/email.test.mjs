import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { normalizeIssue, renderIssue, renderConfirmation } from '../src/email.mjs';
import { previewPayload, sendOwnerPreview } from '../preview.mjs';

import { sources, sampleIssue } from './email-fixture.mjs';
const options = { unsubscribeURL: 'https://newsletter.example/unsubscribe?id=test&token=fake', senderFooter: 'Chimera test identity' };

test('rich issue includes every reviewed image, readable captions, text fallback and real footer', () => {
  const rendered = renderIssue(normalizeIssue(sampleIssue(),sources),options);
  assert.equal((rendered.html.match(/<img /g)||[]).length,5); // mark + hero + 3 features
  for (const word of ['Rex','Flowers','Lake','Unsubscribe','projectchimera.dev']) { assert.ok(rendered.html.includes(word)); assert.ok(rendered.text.includes(word)); }
  assert.match(rendered.html,/max-width:680px/);assert.match(rendered.html,/@media screen and \(max-width:600px\)/);
  assert.ok(Buffer.byteLength(rendered.html)<80000,'Below Gmail clipping size with room for transport overhead');
  assert.doesNotMatch(rendered.html,/<script|<iframe|<svg|display:grid|display:flex|@import|<form/i);
  assert.match(rendered.html,/href="https:\/\/newsletter.example\/unsubscribe\?id=test&amp;token=fake"/);
});

test('issue review rejects offsite/unreviewed images, invalid feature counts and private paths', () => {
  for (const change of [i=>i.hero.src='https://other.example/image.jpg',i=>i.hero.src='javascript:alert(1)',i=>i.hero.href='https://projectchimera.dev/updates/unreviewed/',i=>i.features=[],i=>i.features.push(...i.features),i=>i.intro='/Users/private/story']) {
    const issue=sampleIssue();change(issue);assert.throws(()=>normalizeIssue(issue,sources));
  }
  const issue=sampleIssue();issue.title='<script>unsafe</script>';
  assert.match(renderIssue(normalizeIssue(issue,sources),options).html,/&lt;script&gt;unsafe&lt;\/script&gt;/);
});

test('confirmation keeps the original signed link, expiry and inactive-until-confirmed rule', () => {
  const url='https://newsletter.example/confirm?id=test&token=fake';const rendered=renderConfirmation(url);
  assert.match(rendered.html,/Confirm my subscription/);assert.match(rendered.html,/24 hours/);assert.match(rendered.html,/until you confirm/);
  assert.match(rendered.html,/id=test&amp;token=fake/);assert.equal(rendered.text.match(/https:\/\/\S+/)[0],url);
});

test('preview cannot target another address, a list, CC or BCC', () => {
  const draft={subject:'Chimera preview',sources,issue:sampleIssue()};
  const env={FROM_EMAIL:'Chimera <test@example.com>',MAIL_FOOTER:'Test identity',CHIMERA_NEWSLETTER_PREVIEW_UNSUBSCRIBE_URL:'https://chimera-newsletter.colorpulse.workers.dev/unsubscribe?id=test&token=fake'};
  assert.throws(()=>previewPayload(draft,env,'other@example.com'));
  assert.throws(()=>previewPayload(draft,env,['colorpulse@gmail.com','other@example.com']));
  const payload=previewPayload(draft,env,'colorpulse@gmail.com');
  assert.deepEqual(payload.to,['colorpulse@gmail.com']);assert.equal(payload.cc,undefined);assert.equal(payload.bcc,undefined);
  assert.match(payload.html,/FOR NIC ONLY/);assert.match(payload.text,/Not a campaign/);
});

test('preview durable claim blocks duplicate and interrupted sends without using campaign APIs', async () => {
  const root=await mkdtemp(join(tmpdir(),'chimera-preview-test-'));let calls=0;
  const draft={subject:'Chimera preview',sources,issue:sampleIssue()};
  const env={RESEND_API_KEY:'fake-test-key',FROM_EMAIL:'Test <test@example.com>',MAIL_FOOTER:'Test identity',CHIMERA_NEWSLETTER_PREVIEW_UNSUBSCRIBE_URL:'https://chimera-newsletter.colorpulse.workers.dev/unsubscribe?id=test&token=fake'};
  const transport=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');assert.deepEqual(JSON.parse(options.body).to,['colorpulse@gmail.com']);calls++;throw new Error('Unknown outcome');};
  try {
    await assert.rejects(sendOwnerPreview(draft,env,'colorpulse@gmail.com',{root,transport}),/reconciliation/);
    await assert.rejects(sendOwnerPreview(draft,env,'colorpulse@gmail.com',{root,transport}),/already attempted/);
    assert.equal(calls,1);
  } finally {await rm(root,{recursive:true});}
});
