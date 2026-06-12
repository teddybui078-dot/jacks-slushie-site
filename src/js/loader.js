export function initLoader() {
  const el = document.getElementById('loader');
  const pct = el.querySelector('[data-loader-pct]');

  return {
    setProgress(p) {
      pct.textContent = `${Math.round(p * 100)}%`;
    },
    dismiss() {
      el.classList.add('is-done');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      // safety net in case the transition never fires (background tab)
      setTimeout(() => el.isConnected && el.remove(), 700);
    },
  };
}
