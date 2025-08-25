export function initCollapsible(root) {
  const box  = root.querySelector('[data-collapsible]');
  const fade = root.querySelector('[data-collapsible-fade]');
  const btn  = root.querySelector('[data-collapsible-toggle]');
  const bp   = parseInt(root.dataset.breakpoint || '768', 10);
  if (!box || !btn) return;

  const setCollapsed = (c) => {
    box.dataset.collapsed = c ? 'true' : 'false';
    fade && fade.classList.toggle('hidden', !c);
    btn.textContent = c ? 'Leer más' : 'Ver menos';
  };

  const apply = () => {
    if (window.innerWidth >= bp) { setCollapsed(false); btn.classList.add('hidden'); }
    else { setCollapsed(true); btn.classList.remove('hidden'); }
  };

  apply();
  window.addEventListener('resize', apply);
  btn.addEventListener('click', () => setCollapsed(box.dataset.collapsed !== 'true'));
}

export function initAllCollapsibles() {
  document.querySelectorAll('[data-collapsible-root]').forEach(initCollapsible);
}