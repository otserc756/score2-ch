(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var I = L.i18n;

  function diff(a, b) { return a.filter(function (k) { return b.indexOf(k) < 0; }); }

  test('Traduzioni: italiano e tedesco hanno le stesse chiavi', function () {
    var it = I.keys(I.dict('it')), de = I.keys(I.dict('de'));
    assert.deepEqual(diff(it, de), [], 'mancano in de');
    assert.deepEqual(diff(de, it), [], 'mancano in it');
  });

  test('Traduzioni: nessun testo vuoto', function () {
    I.LANGS.forEach(function (lang) {
      I.keys(I.dict(lang)).forEach(function (k) {
        assert.ok(I.t(lang, k).trim().length > 0, lang + ': ' + k + ' vuoto');
      });
    });
  });

  test('Traduzioni: gli stessi segnaposto {…} in tutte le lingue', function () {
    function ph(s) { return (s.match(/\{\w+\}/g) || []).sort().join(','); }
    I.keys(I.dict('it')).forEach(function (k) {
      assert.equal(ph(I.t('de', k)), ph(I.t('it', k)), k);
    });
  });

  test('Tedesco: convenzione svizzera, mai "ß"', function () {
    I.keys(I.dict('de')).forEach(function (k) { assert.ok(I.t('de', k).indexOf('ß') < 0, k); });
    JSON.stringify(L.reminders.de).split('').forEach(function (c, i) { if (c === 'ß') assert.ok(false, 'ß nei promemoria, posizione ' + i); });
    Object.keys(L.reminders.sources).forEach(function (k) {
      assert.ok(L.reminders.sources[k].label.de.indexOf('ß') < 0, k);
    });
  });

  test('t(): segnaposto, chiave mancante e lingua sconosciuta', function () {
    assert.equal(I.t('it', 'categories.label', { category: 'alto' }), 'Rischio alto');
    assert.equal(I.t('de', 'categories.label', { category: 'hoch' }), 'Risiko hoch');
    assert.equal(I.t('it', 'non.esiste'), 'non.esiste');
    assert.equal(I.t('fr', 'actions.copy'), 'Copia');
  });

  test('Promemoria: tedesco con la stessa struttura e le stesse fonti dell\'italiano', function () {
    var it = L.reminders.it, de = L.reminders.de;
    assert.equal(de.sections.length, it.sections.length);
    it.sections.forEach(function (sec, i) {
      assert.equal(de.sections[i].id, sec.id);
      assert.equal(de.sections[i].items.length, sec.items.length, sec.id);
      sec.items.forEach(function (item, j) {
        assert.deepEqual(de.sections[i].items[j].sources, item.sources, sec.id + ' #' + j);
      });
    });
  });

  test('Ogni codice di errore e avviso del motore ha un testo', function () {
    ['required', 'not_a_number', 'implausible', 'hdl_not_below_total', 'age_below_40', 'age_above_89',
      'age_missing', 'after_current_age', 'invalid'].forEach(function (c) {
      I.LANGS.forEach(function (lang) { assert.ok(I.t(lang, 'errors.' + c) !== 'errors.' + c, lang + ' ' + c); });
    });
    ['outside_model_range', 'op_diabetes'].forEach(function (c) {
      I.LANGS.forEach(function (lang) { assert.ok(I.t(lang, 'warnings.' + c) !== 'warnings.' + c, lang + ' ' + c); });
    });
    Object.keys(L.checklist.RULES).forEach(function (c) {
      I.LANGS.forEach(function (lang) { assert.ok(I.t(lang, 'conditions.' + c) !== 'conditions.' + c, lang + ' ' + c); });
    });
    ['quitSmoking', 'sbp130', 'tcMinus1', 'hba1c53', 'all'].forEach(function (c) {
      I.LANGS.forEach(function (lang) { assert.ok(I.t(lang, 'whatIf.' + c) !== 'whatIf.' + c, lang + ' ' + c); });
    });
  });
})();
