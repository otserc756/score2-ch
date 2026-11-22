/*
 * Gestione delle traduzioni. I testi stanno in src/i18n/<lingua>.js.
 * Per aggiungere una lingua: copiare it.js in fr.js, tradurre, aggiungere 'fr' a LANGS
 * e includere lo script in index.html.
 *
 * Segnaposto: "{nome}" viene sostituito con params.nome.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? {} : (root.ESCScore = root.ESCScore || {});

  var LANGS = ['it', 'de'];
  var FALLBACK = 'it';

  function dict(lang) {
    var all = isNode ? { it: require('./it.js'), de: require('./de.js') } : (NS.i18nData || {});
    return all[lang] || all[FALLBACK] || {};
  }

  function lookup(obj, key) {
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (obj === null || typeof obj !== 'object' || !(parts[i] in obj)) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  /** Traduce una chiave ("sezione.voce") nella lingua indicata. */
  function t(lang, key, params) {
    var s = lookup(dict(lang), key);
    if (s === undefined && lang !== FALLBACK) s = lookup(dict(FALLBACK), key);
    if (typeof s !== 'string') return key;
    if (params) {
      s = s.replace(/\{(\w+)\}/g, function (m, name) {
        return params[name] !== undefined && params[name] !== null ? String(params[name]) : m;
      });
    }
    return s;
  }

  /** Elenco piatto di tutte le chiavi di un dizionario (per i test di completezza). */
  function keys(obj, prefix) {
    var out = [];
    Object.keys(obj).forEach(function (k) {
      var full = prefix ? prefix + '.' + k : k;
      if (obj[k] !== null && typeof obj[k] === 'object') out = out.concat(keys(obj[k], full));
      else out.push(full);
    });
    return out;
  }

  var api = { LANGS: LANGS, FALLBACK: FALLBACK, t: t, keys: keys, dict: dict };
  if (isNode) module.exports = api;
  else NS.i18n = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
