/* Device: marks <html data-device="phone"> on phones and tablets, so a page can swap
   a Mac download for something a phone can do with it. ?device=phone|mac overrides,
   for previewing. Rebinds on every page the client router shows. */
function isPhone(): boolean {
  const q = new URLSearchParams(location.search).get('device');
  if (q === 'phone') return true;
  if (q === 'mac') return false;
  const n = navigator as Navigator & { userAgentData?: { mobile?: boolean } };
  if (n.userAgentData?.mobile === true) return true;
  const ua = navigator.userAgent;
  const ipadAsMac = /Mac/.test(navigator.platform) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod|Android|Mobile/i.test(ua) || ipadAsMac;
}
function mark() {
  document.documentElement.dataset.device = isPhone() ? 'phone' : 'desk';
}
function bind() {
  mark();
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = '1';
    const label = b.textContent;
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy!);
        b.textContent = 'Copied';
      } catch {
        b.textContent = 'Could not copy';
      }
      setTimeout(() => { b.textContent = label; }, 2000);
    });
  });
}
document.addEventListener('astro:page-load', bind);
mark();
