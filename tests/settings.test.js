(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var S = L.settings;

  // Archivio finto, così il test non tocca le impostazioni vere del browser
  function memoryStorage() {
    var data = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
      setItem: function (k, v) { data[k] = String(v); },
      removeItem: function (k) { delete data[k]; },
      dump: function () { return data; }
    };
  }

  var PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  test('Impostazioni: valori non validi sostituiti dai predefiniti', function () {
    var s = S.sanitize({ uiLanguage: 'en', sheetLanguage: 'de', region: 'mars', practice: { name: 42, phone: '091 000 00 00' } });
    assert.equal(s.uiLanguage, 'it');
    assert.equal(s.sheetLanguage, 'de');
    assert.equal(s.region, 'low');
    assert.equal(s.practice.name, '');
    assert.equal(s.practice.phone, '091 000 00 00');
  });

  test('Impostazioni: chiavi sconosciute scartate (nessun dato del paziente)', function () {
    var s = S.sanitize({ patient: { name: 'Mario' }, sbp: 140, practice: { name: 'Studio', extra: 'x' } });
    assert.equal(s.patient, undefined);
    assert.equal(s.sbp, undefined);
    assert.equal(s.practice.extra, undefined);
    assert.deepEqual(Object.keys(s).sort(), ['axenitaEsc2025', 'practice', 'region', 'sheetLanguage', 'uiLanguage']);
  });

  test('Impostazioni: opzione ESC/EAS 2025 per la riga Axenita (predefinita: no)', function () {
    assert.equal(S.sanitize({}).axenitaEsc2025, false);
    assert.equal(S.sanitize({ axenitaEsc2025: true }).axenitaEsc2025, true);
    assert.equal(S.sanitize({ axenitaEsc2025: 'sì' }).axenitaEsc2025, false);
  });

  test('Impostazioni: testi troppo lunghi troncati a 300 caratteri', function () {
    var long = new Array(501).join('a');
    assert.equal(S.sanitize({ practice: { address: long } }).practice.address.length, 300);
  });

  test('Impostazioni: logo accettato solo come immagine in data URL', function () {
    assert.equal(S.isValidLogo(PNG), true);
    assert.equal(S.isValidLogo('https://example.com/logo.png'), false);
    assert.equal(S.isValidLogo('data:text/html;base64,PHNjcmlwdD4='), false);
    assert.equal(S.sanitize({ practice: { logo: 'javascript:alert(1)' } }).practice.logo, '');
    assert.equal(S.sanitize({ practice: { logo: PNG } }).practice.logo, PNG);
  });

  test('Impostazioni: salva e ricarica', function () {
    var st = memoryStorage();
    assert.equal(S.storageAvailable(st), true);
    assert.equal(S.save({ uiLanguage: 'de', sheetLanguage: 'it', region: 'low', practice: { name: 'Studio X' } }, st), true);
    var s = S.load(st);
    assert.equal(s.uiLanguage, 'de');
    assert.equal(s.practice.name, 'Studio X');
    S.clear(st);
    assert.equal(S.load(st).uiLanguage, S.defaults().uiLanguage);
  });

  test('Impostazioni: archivio danneggiato → predefinite', function () {
    var st = memoryStorage();
    st.setItem(S.KEY, '{non json');
    assert.deepEqual(S.load(st), S.defaults());
  });

  test('Impostazioni: esporta e reimporta', function () {
    var orig = S.sanitize({ uiLanguage: 'de', region: 'moderate', practice: { name: 'Studio', logo: PNG } });
    var back = S.importJson(S.exportJson(orig));
    assert.deepEqual(back, orig);
  });

  test('Avviso iniziale: da mostrare finché non viene confermato', function () {
    var st = memoryStorage();
    assert.equal(S.disclaimerAccepted(st), false);
    assert.equal(S.acceptDisclaimer(st), true);
    assert.equal(S.disclaimerAccepted(st), true);
    assert.equal(st.getItem(S.DISCLAIMER_KEY), String(S.DISCLAIMER_VERSION));
  });

  test('Avviso iniziale: si ripresenta se cambia la versione del testo', function () {
    var st = memoryStorage();
    st.setItem(S.DISCLAIMER_KEY, String(S.DISCLAIMER_VERSION - 1));
    assert.equal(S.disclaimerAccepted(st), false);
  });

  test('Avviso iniziale: senza archivio si mostra sempre', function () {
    var broken = { getItem: function () { throw new Error('no'); }, setItem: function () { throw new Error('no'); }, removeItem: function () {} };
    assert.equal(S.disclaimerAccepted(broken), false);
    assert.equal(S.acceptDisclaimer(broken), false);
  });

  test('Impostazioni: file estraneo rifiutato', function () {
    assert.throws(function () { S.importJson('{"foo":1}'); });
    assert.throws(function () { S.importJson('non json'); });
  });
})();
