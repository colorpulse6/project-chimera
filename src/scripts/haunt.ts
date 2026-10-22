/* The haunt. Small disturbances, all of them off under prefers-reduced-motion.
   Runs once per full load; rebinds on every page the client router shows.

   - every page title phases like Kai, and headings decode from static as they arrive
   - now and then a word loses its fill, or the record corrects itself in front of you
   - the strip under the navigation corrupts a glyph and repairs it
   - frames tear into slices on hover and, rarely, on their own
   - a second cursor answers yours from the other side of the screen, a fraction late
   - the hero painting runs through the mirror shader
   - the clock in the corner keeps time; sometimes it loses a few seconds and finds them again
   - the site counts your loops; the strip and the hero notice when you come back
   - leave the tab and the title changes its mind
   - while the hum is on, the page makes small sounds for what it does
   - past the chapel, the hum drops an octave */
import { mountMirror, type Mirror } from './mirror';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const base = document.body.dataset.base ?? '/';
const pad = (n: number) => String(n).padStart(2, '0');

let timers: number[] = [];
const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.push(id); return id; };
const every = (fn: () => void, min: number, max: number, first = rand(min, max)) => {
  const tick = () => { fn(); later(tick, rand(min, max)); };
  later(tick, first);
};
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

/* ---------- loops: the site counts how many times you have come back */
const LOOP = (() => {
  let n = 0;
  try { n = Number(localStorage.getItem('chimera-loop') || 0) + 1; if (!Number.isFinite(n) || n < 1) n = 1; localStorage.setItem('chimera-loop', String(n)); } catch { n = 1; }
  return n;
})();
type Anchor = { path: string; t: number; title: string };
const anchors = (): Anchor[] => { try { return JSON.parse(sessionStorage.getItem('chimera-anchors') || '[]'); } catch { return []; } };
function stabilise() {
  const list = anchors();
  const path = location.pathname.replace(base, '/');
  if (list.at(-1)?.path !== path) list.push({ path, t: Date.now(), title: document.title.replace(/ · Chimera$/, '') });
  try { sessionStorage.setItem('chimera-anchors', JSON.stringify(list.slice(-40))); } catch { /* full */ }
}

/* ---------- sound: only while the hum is on, which the visitor chose */
let ctx: AudioContext | null = null;
const humOn = () => { const a = document.getElementById('hum-audio') as HTMLAudioElement | null; return !!a && !a.paused; };
function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
function tone(freq: number, gain: number, decay: number, type: OscillatorType = 'sine') {
  if (!humOn()) return;
  try {
    const c = ac();
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + decay);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + decay + 0.05);
  } catch { /* no audio */ }
}
function hiss(ms: number, gain = 0.03) {
  if (!humOn()) return;
  try {
    const c = ac();
    const n = Math.floor(c.sampleRate * ms / 1000);
    const b = c.createBuffer(1, n, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(); s.buffer = b;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.7;
    const g = c.createGain(); g.gain.value = gain;
    s.connect(f).connect(g).connect(c.destination); s.start();
  } catch { /* no audio */ }
}
const sfx = {
  tick: () => tone(1900, 0.04, 0.09),
  thud: () => { tone(46, 0.5, 0.6); hiss(120, 0.02); },
  ink: () => hiss(180, 0.05),
  tear: () => { tone(220, 0.03, 0.05, 'square'); hiss(60, 0.02); },
  word: () => tone(3200, 0.015, 0.04),
};

/* ---------- titles phase; headings decode */
const GLYPHS = '▮▯░▒·×_ΔΞΣ';
function phaseTitles() {
  document.querySelectorAll('main h1').forEach((h) => {
    if (h.querySelector('.phase') || h.children.length) return;
    const text = h.textContent ?? '';
    const span = document.createElement('span');
    span.className = 'phase'; span.dataset.text = text; span.textContent = text;
    h.replaceChildren(span);
  });
}
const decoded = new WeakSet<Element>();
function decode(el: HTMLElement) {
  const target = (el.querySelector('.phase') as HTMLElement | null) ?? el;
  if (target.children.length) return;
  const text = target.textContent ?? '';
  if (!text.trim() || text.length > 70) return;
  const start = performance.now(); const dur = 380 + text.length * 16;
  const step = () => {
    const k = Math.min(1, (performance.now() - start) / dur);
    const n = Math.floor(k * text.length);
    target.textContent = text.split('').map((ch, i) => (i < n || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
    if (k < 1) requestAnimationFrame(step); else target.textContent = text;
  };
  requestAnimationFrame(step);
}
let decoder: IntersectionObserver | null = null;
function watchHeadings() {
  decoder?.disconnect();
  if (reduced) return;
  decoder = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting && !decoded.has(e.target)) { decoded.add(e.target); decode(e.target as HTMLElement); decoder!.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('main h1, main h2').forEach((h) => decoder!.observe(h));
}

/* ---------- a word loses its fill */
function flickerWord() {
  const paras = Array.from(document.querySelectorAll('main p, main li, main dd')).filter((p) => (p.textContent ?? '').split(' ').length > 6);
  if (!paras.length) return;
  const p = pick(paras);
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) if ((n.textContent ?? '').trim().split(' ').length > 3) nodes.push(n as Text);
  if (!nodes.length) return;
  const node = pick(nodes);
  const words = (node.textContent ?? '').split(' ');
  const i = Math.floor(Math.random() * words.length);
  if (words[i].length < 4) return;
  const before = words.slice(0, i).join(' ') + (i ? ' ' : '');
  const after = (i < words.length - 1 ? ' ' : '') + words.slice(i + 1).join(' ');
  const span = document.createElement('span');
  span.className = 'phase phase-once'; span.dataset.text = words[i]; span.textContent = words[i];
  const parent = node.parentNode!;
  parent.insertBefore(document.createTextNode(before), node);
  parent.insertBefore(span, node);
  node.textContent = after;
  sfx.word();
  later(() => { span.replaceWith(document.createTextNode(span.textContent ?? '')); parent.normalize(); }, 700);
}

/* ---------- the record corrects itself */
const DICT: [RegExp, string][] = [
  [/\bpainted\b/, 'drawn'], [/\bbuilt\b/, 'written'], [/\btown\b/, 'anchor'], [/\bboy\b/, 'subject'],
  [/\bremember(s|ed)?\b/, 'record'], [/\bgame\b/, 'record'], [/\breal\b/, 'painted'], [/\bKai\b/, 'KAI_7.34'],
  [/\bhero\b/, 'subject'], [/\bstory\b/, 'loop'], [/\bhome\b/, 'anchor'], [/\bsister\b/, 'construct'],
  [/\bmorning\b/, 'the same morning'], [/\bfinished\b/, 'deferred'], [/\bright\b/, 'right'],
];
function correct() {
  const nodes: [Text, RegExp, string][] = [];
  const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT, {
    acceptNode: (t) => (t.parentElement && /^(P|LI|DD|TD|FIGCAPTION)$/.test(t.parentElement.tagName) && (t.textContent ?? '').length > 30 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  let t: Node | null;
  while ((t = walker.nextNode())) {
    const text = t.textContent ?? '';
    for (const [re, to] of DICT) if (re.test(text)) { nodes.push([t as Text, re, to]); break; }
  }
  if (!nodes.length) return;
  const [node, re, to] = pick(nodes);
  const text = node.textContent ?? '';
  const m = re.exec(text)!;
  const span = document.createElement('span');
  span.className = 'correct';
  const del = document.createElement('del'); del.textContent = m[0];
  const ins = document.createElement('ins'); ins.textContent = to;
  span.append(del, ins);
  const after = document.createTextNode(text.slice(m.index + m[0].length));
  node.textContent = text.slice(0, m.index);
  node.parentNode!.insertBefore(span, node.nextSibling);
  node.parentNode!.insertBefore(after, span.nextSibling);
  sfx.tick();
  later(() => { span.classList.add('undo'); }, 2600);
  later(() => { span.replaceWith(document.createTextNode(m[0])); node.parentNode?.normalize(); }, 3000);
}

/* ---------- the strip corrupts */
let stripRestore: (() => void) | null = null;
const strip = {
  extra: () => {
    const p = document.querySelector('.scroll p');
    if (!p || p.dataset.extra) return;
    p.dataset.extra = String(LOOP);
    const lines: string[] = [];
    if (LOOP >= 3) lines.push('you have been here before', 'the record remembers you');
    if (LOOP >= 7) lines.push('stop winding the clock');
    if (LOOP >= 12) lines.push('loop ' + LOOP + ', subject compliant');
    if (!lines.length) return;
    const half = p.children.length / 2;
    const mk = (l: string) => { const s = document.createElement('span'); s.textContent = l; s.className = 'late'; return s; };
    lines.forEach((l) => p.appendChild(mk(l)));
    lines.forEach((l) => p.insertBefore(mk(l), p.children[half]));
  },
  corrupt: () => {
    const spans = document.querySelectorAll<HTMLElement>('.scroll span');
    if (!spans.length) return;
    const s = pick(Array.from(spans));
    const text = s.textContent ?? '';
    if (text.length < 4) return;
    const i = Math.floor(Math.random() * text.length);
    s.textContent = text.slice(0, i) + GLYPHS[Math.floor(Math.random() * 7)] + text.slice(i + 1);
    sfx.tick();
    stripRestore = () => { s.textContent = text; stripRestore = null; };
    later(() => stripRestore?.(), 160);
  },
};

/* ---------- frames tear */
let lastTear = 0;
function tear(img: HTMLImageElement) {
  const layer = document.getElementById('haunt-layer');
  if (!layer || reduced || !img.currentSrc || !img.complete) return;
  const now = performance.now();
  if (now - lastTear < 900) return;
  lastTear = now;
  const r = img.getBoundingClientRect();
  if (r.width < 80 || r.bottom < 0 || r.top > innerHeight) return;
  const n = 3 + Math.floor(Math.random() * 3);
  const frag = document.createDocumentFragment();
  const slices: HTMLElement[] = [];
  for (let i = 0; i < n; i++) {
    const top = Math.random() * r.height;
    const h = 5 + Math.random() * r.height * 0.16;
    const s = document.createElement('div');
    s.className = 'slice';
    s.style.cssText = `left:${r.left}px;top:${r.top + top}px;width:${r.width}px;height:${h}px;background-image:url("${img.currentSrc}");background-size:${r.width}px ${r.height}px;background-position:0 ${-top}px;transform:translateX(${(Math.random() * 2 - 1) * 20}px);filter:hue-rotate(${Math.random() < 0.5 ? -50 : 50}deg) saturate(1.8) contrast(1.2)`;
    slices.push(s); frag.appendChild(s);
  }
  layer.replaceChildren(frag);
  sfx.tear();
  later(() => slices.forEach((s) => { s.style.transform = `translateX(${(Math.random() * 2 - 1) * 12}px)`; }), 70);
  later(() => slices.forEach((s) => { s.style.transform = `translateX(${(Math.random() * 2 - 1) * 4}px)`; s.style.filter = 'none'; }), 130);
  later(() => { layer.replaceChildren(); }, 190);
}
function tearRandom() {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('main img')).filter((i) => { const r = i.getBoundingClientRect(); return r.width > 120 && r.top < innerHeight && r.bottom > 0; });
  if (imgs.length) tear(pick(imgs));
}

/* ---------- the other cursor */
function cursorEcho() {
  const el = document.getElementById('cursor-echo');
  if (!el || !fine || reduced || el.dataset.bound) return;
  el.dataset.bound = '1';
  let tx = -100, ty = -100, x = -100, y = -100, shown = false, running = false;
  const loop = () => {
    const gx = innerWidth - tx, gy = ty;
    x += (gx - x) * 0.055; y += (gy - y) * 0.055;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    if (Math.abs(gx - x) + Math.abs(gy - y) > 0.3) requestAnimationFrame(loop); else running = false;
  };
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!shown) { shown = true; el.classList.add('on'); } if (!running) { running = true; requestAnimationFrame(loop); } }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { shown = false; el.classList.remove('on'); });
}

/* ---------- the clock keeps time and no one winds it */
function hud() {
  const el = document.getElementById('hud');
  if (!el) return;
  const subject = el.querySelector<HTMLElement>('.hud-subject')!;
  const loopEl = el.querySelector<HTMLElement>('.hud-loop')!;
  const timeEl = el.querySelector<HTMLElement>('.hud-time')!;
  const state = el.querySelector<HTMLElement>('.hud-state')!;
  const echo = document.documentElement.hasAttribute('data-echo');
  subject.textContent = echo ? 'ELARA_0.00' : 'KAI_7.34';
  state.textContent = echo ? 'ECHO' : document.querySelector('main h1')?.textContent?.trim().toUpperCase().slice(0, 18) || 'ANCHORED';
  loopEl.textContent = 'LOOP ' + pad(LOOP);
  if (el.dataset.bound) return;
  el.dataset.bound = '1';
  let offset = 0, stuck = false;
  const draw = () => {
    const d = new Date(Date.now() + offset);
    timeEl.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad).join(':');
  };
  setInterval(draw, 250);
  // these outlive page swaps, so they do not use the page-scoped timer list
  const slip = () => {
    if (!stuck) {
      stuck = true; offset = -3000; el.classList.add('slip'); sfx.tick();
      setTimeout(() => { offset = 0; stuck = false; el.classList.remove('slip'); }, rand(2000, 5000));
    }
    setTimeout(slip, rand(15000, 45000));
  };
  const flicker = () => {
    const was = subject.textContent;
    subject.textContent = pick(['ELARA_?', 'SUBJECT ░░░', 'KAI_7.33', 'NO SUBJECT']);
    setTimeout(() => { if (subject.textContent !== was) subject.textContent = was; }, 120);
    setTimeout(flicker, rand(20000, 60000));
  };
  if (!reduced) { setTimeout(slip, rand(15000, 45000)); setTimeout(flicker, rand(20000, 60000)); }
  draw();
}

/* ---------- leave the tab and the title changes its mind */
function tabWatch() {
  if ((document.body as any)._tabWatched) return;
  (document.body as any)._tabWatched = true;
  const icon = () => document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  const dot = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231b1720'/%3E%3Ccircle cx='16' cy='16' r='9' fill='%23d24a34'/%3E%3C/svg%3E";
  let kept = { title: document.title, icon: icon()?.href ?? '' };
  document.addEventListener('astro:page-load', () => { kept = { title: document.title, icon: icon()?.href ?? '' }; });
  document.addEventListener('visibilitychange', () => {
    const link = icon();
    if (document.hidden) {
      kept = { title: document.title, icon: link?.href ?? '' };
      document.title = pick(['the anchor drifts', 'come back to the courtyard', 'the clock is still running', 'you left the painting', 'deviation noted']);
      if (link) link.href = dot;
    } else {
      document.title = kept.title;
      if (link && kept.icon) link.href = kept.icon;
    }
  });
}

/* ---------- scroll: the deeper you go, the less paint is left */
function drain() {
  if ((document.body as any)._drain) return;
  (document.body as any)._drain = true;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const k = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    document.documentElement.style.setProperty('--drain', k.toFixed(3));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  document.addEventListener('astro:page-load', update);
  update();
}

/* ---------- the typewriter, for pages that speak slowly */
function typewriter() {
  document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => {
    if (el.dataset.typed) return;
    el.dataset.typed = '1';
    const lines = Array.from(el.children) as HTMLElement[];
    const texts = lines.map((l) => l.textContent ?? '');
    lines.forEach((l) => { l.textContent = ''; l.style.visibility = 'hidden'; });
    if (reduced) { lines.forEach((l, i) => { l.textContent = texts[i]; l.style.visibility = ''; }); return; }
    let li = 0, ci = 0;
    const step = () => {
      if (li >= lines.length) { el.classList.add('done'); return; }
      const l = lines[li]; l.style.visibility = '';
      if (ci === 0 && l.dataset.pause) { later(step, Number(l.dataset.pause)); l.dataset.pause = ''; return; }
      l.textContent = texts[li].slice(0, ++ci);
      if (Math.random() < 0.02) sfx.tick();
      if (ci >= texts[li].length) { li++; ci = 0; later(step, rand(260, 700)); }
      else later(step, texts[li][ci - 1] === ' ' ? rand(20, 60) : rand(12, 34));
    };
    later(step, 500);
  });
}

/* ---------- anchors page: your saves this loop */
function renderAnchors() {
  const list = document.getElementById('anchor-list');
  if (!list) return;
  const mine = anchors();
  list.replaceChildren(...mine.map((a, i) => {
    const li = document.createElement('li');
    const d = new Date(a.t);
    const cell = (cls: string, text: string) => { const s = document.createElement('span'); s.className = cls; s.textContent = text; return s; };
    li.append(cell('slot', pad(i + 1)), cell('where', a.title || a.path), cell('when', [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad).join(':')), cell('st', 'STABILISED'));
    return li;
  }));
  const count = document.getElementById('anchor-count');
  if (count) count.textContent = `Loop ${pad(LOOP)}. ${mine.length} anchor${mine.length === 1 ? '' : 's'} stabilised this loop.`;
}

/* ---------- returning visitors */
function remember() {
  document.querySelectorAll<HTMLElement>('[data-loop]').forEach((el) => { el.textContent = 'loop ' + pad(LOOP); });
  const asof = document.querySelector<HTMLElement>('.hero .asof');
  if (asof && LOOP > 1 && !asof.dataset.loop) {
    asof.dataset.loop = '1';
    asof.textContent = (LOOP < 4 ? 'You have been here before. ' : `This is your loop ${LOOP}. The painting has not changed; check. `) + asof.textContent;
  }
  const tulips = document.querySelectorAll<HTMLElement>('.tulips span');
  if (tulips.length) {
    tulips.forEach((t) => t.classList.remove('wrong'));
    tulips[(LOOP * 7 + 3) % tulips.length]?.classList.add('wrong');
  }
}

/* ---------- past the chapel: the hum drops an octave */
function pitch() {
  const audio = document.getElementById('hum-audio') as HTMLAudioElement | null;
  if (!audio) return;
  const echo = document.documentElement.hasAttribute('data-echo');
  (audio as any).preservesPitch = false;
  (audio as any).mozPreservesPitch = false;
  audio.playbackRate = echo ? 0.5 : 1;
}

/* ---------- her name */
function secret() {
  if ((document.body as any)._secret) return;
  (document.body as any)._secret = true;
  let buf = '';
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.tagName === 'INPUT') return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    if (buf.endsWith('elara')) { buf = ''; sfx.thud(); location.assign(base + 'echo/'); }
  });
  document.querySelector('.hum')?.addEventListener('click', () => { try { ac(); } catch { /* none */ } });
}

/* ---------- media parsed in by the router arrives inert */
function wakeMedia() {
  document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((v) => {
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) v.load();
    if (v.paused) v.play().catch(() => {});
  });
}

/* ---------- the mirror on the hero */
let mirror: Mirror | null = null;
function hero() {
  mirror?.stop(); mirror = null;
  const host = document.querySelector<HTMLElement>('[data-mirror]');
  if (!host) return;
  const img = host.querySelector('img'); const canvas = host.querySelector('canvas');
  if (!img || !canvas) return;
  mirror = mountMirror(host, img, canvas, () => sfx.ink());
}

/* ---------- schedule */
function schedule() {
  clearTimers();
  if (reduced) return;
  every(flickerWord, 14000, 32000, rand(6000, 14000));
  every(strip.corrupt, 6000, 14000, rand(3000, 8000));
  every(correct, 18000, 45000, rand(9000, 20000));
  every(tearRandom, 10000, 26000, rand(5000, 12000));
}

function pageLoad() {
  schedule();
  stabilise();
  phaseTitles();
  watchHeadings();
  wakeMedia(); later(wakeMedia, 1200);
  strip.extra();
  remember();
  hud();
  pitch();
  typewriter();
  renderAnchors();
  hero();
}

document.addEventListener('astro:page-load', pageLoad);
document.addEventListener('astro:before-swap', () => { mirror?.stop(); mirror = null; clearTimers(); stripRestore?.(); });
document.addEventListener('astro:after-swap', () => { sfx.thud(); });
document.addEventListener('pointerover', (e) => {
  const img = (e.target as HTMLElement | null)?.closest?.('main img') as HTMLImageElement | null;
  if (img && fine) tear(img);
}, { passive: true });

cursorEcho();
tabWatch();
drain();
secret();
