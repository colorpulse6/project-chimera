/* Small disturbances. Every page title phases like Kai; now and then one word on the
   page loses its fill for a few frames; the strip under the navigation corrupts a
   letter and repairs it. All of it is off under prefers-reduced-motion. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
let wordTimer = 0;
let stripTimer = 0;

function phaseTitles() {
  document.querySelectorAll('main h1').forEach((h) => {
    if (h.querySelector('.phase') || h.children.length) return;
    const text = h.textContent ?? '';
    const span = document.createElement('span');
    span.className = 'phase';
    span.dataset.text = text;
    span.textContent = text;
    h.replaceChildren(span);
  });
}

function flickerWord() {
  const paras = Array.from(document.querySelectorAll('main p, main li, main dd')).filter((p) => (p.textContent ?? '').split(' ').length > 6);
  if (!paras.length) return;
  const p = paras[Math.floor(Math.random() * paras.length)];
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) if ((n.textContent ?? '').trim().split(' ').length > 3) nodes.push(n as Text);
  if (!nodes.length) return;
  const node = nodes[Math.floor(Math.random() * nodes.length)];
  const words = (node.textContent ?? '').split(' ');
  const i = Math.floor(Math.random() * words.length);
  if (words[i].length < 4) return;
  const before = words.slice(0, i).join(' ') + (i ? ' ' : '');
  const after = (i < words.length - 1 ? ' ' : '') + words.slice(i + 1).join(' ');
  const span = document.createElement('span');
  span.className = 'phase phase-once';
  span.dataset.text = words[i];
  span.textContent = words[i];
  const parent = node.parentNode!;
  parent.insertBefore(document.createTextNode(before), node);
  parent.insertBefore(span, node);
  node.textContent = after;
  setTimeout(() => { span.replaceWith(document.createTextNode(span.textContent ?? '')); parent.normalize(); }, 700);
}

const glyphs = '▮▯░▒·×_';
function corruptStrip() {
  const spans = document.querySelectorAll<HTMLElement>('.scroll span');
  if (!spans.length) return;
  const s = spans[Math.floor(Math.random() * spans.length)];
  const text = s.textContent ?? '';
  if (text.length < 4) return;
  const i = Math.floor(Math.random() * text.length);
  s.textContent = text.slice(0, i) + glyphs[Math.floor(Math.random() * glyphs.length)] + text.slice(i + 1);
  setTimeout(() => { s.textContent = text; }, 160);
}

function schedule() {
  clearTimeout(wordTimer); clearTimeout(stripTimer);
  if (reduced) return;
  const word = () => { flickerWord(); wordTimer = window.setTimeout(word, rand(14000, 32000)); };
  const strip = () => { corruptStrip(); stripTimer = window.setTimeout(strip, rand(6000, 14000)); };
  wordTimer = window.setTimeout(word, rand(6000, 14000));
  stripTimer = window.setTimeout(strip, rand(3000, 8000));
}

/* Media parsed by the client router arrives inert (no source selected). Kick it. */
function wakeMedia() {
  document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((v) => {
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) v.load();
    if (v.paused) v.play().catch(() => {});
  });
}

document.addEventListener('astro:page-load', () => { phaseTitles(); wakeMedia(); setTimeout(wakeMedia, 1200); schedule(); });
