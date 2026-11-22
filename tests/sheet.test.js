(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var S = L.sheet, A = L.assessment;

  var settings = { sheetLanguage: 'de', region: 'low', practice: { name: 'Studio' } };
  var patient = { firstName: 'Mario', lastName: 'Rossi', birth: { year: 1957, month: 3, day: 15 }, visit: { year: 2026, month: 11, day: 22 } };

  function model(input, checks) {
    return S.buildModel(A.assess(input, checks || {}), { input: input, patient: patient }, settings);
  }
  function row(m, key) { return m.rows.filter(function (r) { return r.key === key; })[0]; }

  var ex = { age: 69, sex: 'male', smoker: true, diabetes: false, sbp: 140, totalChol: 5.23, hdl: 1.24, triglycerides: 1.5, region: 'low' };

  test('Foglio: lingua indipendente dall\'interfaccia e dati del paziente presenti', function () {
    var m = model(ex);
    assert.equal(m.lang, 'de');
    assert.equal(m.patient.lastName, 'Rossi');
    assert.equal(m.practice.name, 'Studio');
  });

  test('Foglio: rischio, "su 100 persone" e scala ESC 2021 a 3 livelli', function () {
    var m = model(ex);
    assert.equal(m.risk.percent, 12.9);
    assert.equal(m.risk.perHundred, 13);
    assert.equal(m.risk.category, 'veryHigh');
    assert.deepEqual(m.risk.scale, ['lowModerate', 'high', 'veryHigh']);
    assert.equal(m.risk.fromConditions, false);
  });

  test('Foglio: SCORE2-Diabetes usa la scala a 4 livelli', function () {
    var m = model({ age: 60, sex: 'male', smoker: false, diabetes: true, sbp: 140, totalChol: 5.5, hdl: 1.3, ageAtDiagnosis: 50, hba1c: 70, egfr: 60, region: 'low' });
    assert.deepEqual(m.risk.scale, ['low', 'moderate', 'high', 'veryHigh']);
    assert.equal(row(m, 'hba1c').status, 'above');
  });

  test('Foglio: valori accanto agli obiettivi con stato raggiunto / da migliorare', function () {
    var m = model(ex);
    assert.equal(row(m, 'sbp').status, 'above');
    assert.equal(row(m, 'ldl').targetValue, 1.4);
    assert.equal(row(m, 'ldl').status, 'above');
    assert.equal(row(m, 'nonHdl').targetValue, 2.2);
    assert.equal(row(m, 'smoking').status, 'above');
    assert.equal(row(m, 'hba1c'), undefined);
    var ok = model(Object.assign({}, ex, { sbp: 125, smoker: false }));
    assert.equal(row(ok, 'sbp').status, 'ok');
    assert.equal(row(ok, 'smoking').status, 'ok');
  });

  test('Foglio: con ASCVD niente percentuale né scenari', function () {
    var m = model(ex, { ascvd: true });
    assert.equal(m.risk.percent, null);
    assert.equal(m.risk.fromConditions, true);
    assert.equal(m.whatIf, null);
    assert.equal(m.risk.category, 'veryHigh');
  });

  test('Foglio: scenari "cosa cambia se" presenti quando lo score si applica', function () {
    var m = model(ex);
    assert.equal(m.whatIf.base, 12.9);
    assert.deepEqual(m.whatIf.scenarios.map(function (s) { return s.id; }), ['quitSmoking', 'sbp130', 'tcMinus1', 'all']);
  });

  test('Foglio: da 3 a 4 consigli, prima il fumo', function () {
    var m = model(ex);
    assert.ok(m.tips.length >= 3 && m.tips.length <= 4, m.tips.join());
    assert.equal(m.tips[0], 'smoking');
    var ns = model(Object.assign({}, ex, { smoker: false, sbp: 120 }));
    assert.ok(ns.tips.indexOf('smoking') < 0);
    assert.ok(ns.tips.length >= 3 && ns.tips.length <= 4);
  });

  test('Foglio: ogni consiglio ha titolo e testo in italiano e tedesco', function () {
    ['smoking', 'bloodPressure', 'diabetes', 'diet', 'activity', 'medication', 'checkups'].forEach(function (k) {
      ['it', 'de'].forEach(function (lang) {
        assert.ok(L.i18n.t(lang, 'sheet.tips.' + k + '.title') !== 'sheet.tips.' + k + '.title', lang + ' ' + k);
        assert.ok(L.i18n.t(lang, 'sheet.tips.' + k + '.text') !== 'sheet.tips.' + k + '.text', lang + ' ' + k);
      });
    });
  });

  test('Foglio: intervalli della scala', function () {
    assert.equal(S.rangeText('ESC2021', { high: 5, veryHigh: 10 }, 0), '< 5%');
    assert.equal(S.rangeText('ESC2021', { high: 5, veryHigh: 10 }, 1), '5–10%');
    assert.equal(S.rangeText('ESC2023-DM', { moderate: 5, high: 10, veryHigh: 20 }, 3), '≥ 20%');
  });

  test('Foglio: niente foglio senza risultato', function () {
    assert.equal(model({ sex: 'male' }), null);
  });
})();
