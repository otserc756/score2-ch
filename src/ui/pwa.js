/*
 * Registra il service worker per l'uso offline e l'installazione come app.
 * Solo su https (GitHub Pages): da file:// non è possibile, e in sviluppo su localhost
 * la cache darebbe fastidio. Per provarlo in locale: index.html?sw
 */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const forced = /[?&]sw\b/.test(location.search);
  if (location.protocol !== 'https:' && !(local && forced)) return;
  if (local && !forced) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* l'app funziona comunque online */ });
  });
})();
