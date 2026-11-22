/*
 * Service worker: rende l'app disponibile offline dopo la prima apertura.
 * Salva in cache solo i file dell'app (mai dati del paziente: l'app non li invia né li salva).
 *
 * Aggiornamenti: la GitHub Action sostituisce BUILD a ogni pubblicazione. Il browser vede
 * un sw.js diverso, scarica i file nuovi e li usa dalla riapertura successiva dell'app.
 */
'use strict';

const BUILD = 'dev';
const CACHE = 'score2-' + BUILD;

const FILES = [
  './',
  'index.html',
  'config.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'src/version.js',
  'src/styles/app.css',
  'src/styles/print.css',
  'src/calc/calibration.js',
  'src/calc/score2.js',
  'src/calc/score2op.js',
  'src/calc/score2diabetes.js',
  'src/calc/units.js',
  'src/calc/egfr.js',
  'src/calc/age.js',
  'src/calc/risk.js',
  'src/calc/categories.js',
  'src/calc/checklist.js',
  'src/calc/whatif.js',
  'src/calc/assessment.js',
  'src/reminders/sources.js',
  'src/reminders/reminders.it.js',
  'src/reminders/reminders.de.js',
  'src/i18n/it.js',
  'src/i18n/de.js',
  'src/i18n/i18n.js',
  'src/ui/settings.js',
  'src/ui/axenita.js',
  'src/ui/sheet.js',
  'src/ui/pwa.js',
  'src/ui/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('score2-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Prima la cache (funziona offline), poi la rete per i file non ancora salvati.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req))
  );
});
