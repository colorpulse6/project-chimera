/* Records: a tile with data-dialog opens the dialog of that id. Arriving with the
   tile's hash opens it too, so the old anchors (world/#street, characters/#greta)
   still land on the thing they name. Rebinds on every page the client router shows. */
function open(d: HTMLDialogElement, hash?: string) {
  if (d.open) return;
  d.showModal();
  document.documentElement.classList.add('record-open');
  if (hash) try { history.replaceState(null, '', `#${hash}`); } catch { /* ignore */ }
}
function init() {
  document.querySelectorAll<HTMLElement>('[data-dialog]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('click', (e) => {
      const d = document.getElementById(el.dataset.dialog!) as HTMLDialogElement | null;
      if (!d) return;
      e.preventDefault();
      open(d, el.id || undefined);
    });
  });
  document.querySelectorAll<HTMLDialogElement>('dialog.record').forEach((d) => {
    if (d.dataset.bound) return;
    d.dataset.bound = '1';
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => {
      if (!document.querySelector('dialog.record[open]')) document.documentElement.classList.remove('record-open');
    });
  });
  fromHash();
}
function fromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const el = document.getElementById(hash);
  const id = el?.dataset.dialog;
  if (!id) return;
  const d = document.getElementById(id) as HTMLDialogElement | null;
  if (d) { el!.scrollIntoView({ block: 'center' }); open(d); }
}
document.addEventListener('astro:page-load', init);
window.addEventListener('hashchange', fromHash);
document.addEventListener('astro:before-swap', () => {
  document.querySelectorAll<HTMLDialogElement>('dialog.record[open]').forEach((d) => d.close());
  document.documentElement.classList.remove('record-open');
});
