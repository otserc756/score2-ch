/*
 * Versione dell'app. La GitHub Action sostituisce "dev" con l'identificativo della pubblicazione.
 * channel 'beta': l'app mostra l'etichetta BETA; per la versione definitiva usare ''.
 */
(function (root) {
  'use strict';
  var NS = (root.ESCScore = root.ESCScore || {});
  NS.version = { app: '0.9.2', channel: 'beta', build: 'dev' };
})(typeof globalThis !== 'undefined' ? globalThis : this);
