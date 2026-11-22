/* Versione dell'app. La GitHub Action sostituisce "dev" con l'identificativo della pubblicazione. */
(function (root) {
  'use strict';
  var NS = (root.ESCScore = root.ESCScore || {});
  NS.version = { app: '1.0.0', build: 'dev' };
})(typeof globalThis !== 'undefined' ? globalThis : this);
