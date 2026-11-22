/*
 * Impostazioni dello studio: lingue, regione di rischio, intestazione.
 * Sono l'UNICA cosa salvata dall'app (localStorage del browser). I dati del paziente no.
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;

  var KEY = 'escscore.settings.v1';
  var LANGS = ['it', 'de'];
  var REGIONS = ['low', 'moderate', 'high', 'veryHigh'];
  var PRACTICE_FIELDS = ['name', 'doctors', 'specialty', 'address', 'phone', 'email'];
  var MAX_TEXT = 300;
  var MAX_LOGO_BYTES = 300 * 1024;
  // Un data URL in base64 è circa 4/3 della dimensione del file.
  var MAX_LOGO_CHARS = Math.ceil(MAX_LOGO_BYTES * 4 / 3) + 100;

  var BUILTIN = {
    uiLanguage: 'it',
    sheetLanguage: 'it',
    region: 'low',
    axenitaEsc2025: false,
    practice: { name: '', doctors: '', specialty: '', address: '', phone: '', email: '', logo: '' }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function str(v, max) {
    return typeof v === 'string' ? v.slice(0, max) : '';
  }

  function isValidLogo(v) {
    return typeof v === 'string' && v.length <= MAX_LOGO_CHARS &&
      /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+\/=]+$/.test(v);
  }

  /** Tiene solo le chiavi note con valori validi; il resto prende il valore di `base`. */
  function sanitize(obj, base) {
    var b = base ? clone(base) : clone(BUILTIN);
    var o = obj && typeof obj === 'object' ? obj : {};
    var out = {
      uiLanguage: LANGS.indexOf(o.uiLanguage) >= 0 ? o.uiLanguage : b.uiLanguage,
      sheetLanguage: LANGS.indexOf(o.sheetLanguage) >= 0 ? o.sheetLanguage : b.sheetLanguage,
      region: REGIONS.indexOf(o.region) >= 0 ? o.region : b.region,
      axenitaEsc2025: typeof o.axenitaEsc2025 === 'boolean' ? o.axenitaEsc2025 : !!b.axenitaEsc2025,
      practice: {}
    };
    var p = o.practice && typeof o.practice === 'object' ? o.practice : {};
    PRACTICE_FIELDS.forEach(function (f) {
      out.practice[f] = typeof p[f] === 'string' ? str(p[f], MAX_TEXT) : (b.practice[f] || '');
    });
    out.practice.logo = isValidLogo(p.logo) ? p.logo : (p.logo === '' ? '' : (b.practice.logo || ''));
    return out;
  }

  /** Impostazioni predefinite: quelle integrate, sovrascritte da config.js. */
  function defaults() {
    var cfg = !isNode && root.ESC_CONFIG ? root.ESC_CONFIG : {};
    return sanitize(cfg, BUILTIN);
  }

  function getStorage(storage) {
    if (storage) return storage;
    try { return root.localStorage || null; } catch (e) { return null; }
  }

  /** true se il browser permette di salvare (file://, navigazione privata, ecc. possono impedirlo). */
  function storageAvailable(storage) {
    var s = getStorage(storage);
    if (!s) return false;
    try { s.setItem(KEY + '.test', '1'); s.removeItem(KEY + '.test'); return true; } catch (e) { return false; }
  }

  function load(storage) {
    var base = defaults();
    var s = getStorage(storage);
    if (!s) return base;
    try {
      var raw = s.getItem(KEY);
      return raw ? sanitize(JSON.parse(raw), base) : base;
    } catch (e) { return base; }
  }

  /** Salva; restituisce false se non è stato possibile. */
  function save(settings, storage) {
    var s = getStorage(storage);
    if (!s) return false;
    try { s.setItem(KEY, JSON.stringify(sanitize(settings, defaults()))); return true; } catch (e) { return false; }
  }

  function clear(storage) {
    var s = getStorage(storage);
    if (s) { try { s.removeItem(KEY); } catch (e) { /* niente da fare */ } }
  }

  function exportJson(settings) {
    return JSON.stringify({ app: 'score2-ch', version: 1, settings: sanitize(settings, defaults()) }, null, 2);
  }

  /** Legge un file esportato. Lancia un errore se non è un file di impostazioni dell'app. */
  function importJson(text) {
    var data = JSON.parse(text);
    if (!data || data.app !== 'score2-ch' || typeof data.settings !== 'object') {
      throw new Error('Formato non riconosciuto');
    }
    return sanitize(data.settings, defaults());
  }

  var api = {
    KEY: KEY,
    MAX_LOGO_BYTES: MAX_LOGO_BYTES,
    BUILTIN: BUILTIN,
    sanitize: sanitize,
    isValidLogo: isValidLogo,
    defaults: defaults,
    storageAvailable: storageAvailable,
    load: load,
    save: save,
    clear: clear,
    exportJson: exportJson,
    importJson: importJson
  };

  if (isNode) module.exports = api;
  else (root.ESCScore = root.ESCScore || {}).settings = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
