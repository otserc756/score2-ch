/*
 * Casi confrontati con i calcolatori MDCalc il 22.11.2026 (vedi docs/confronto-mdcalc.md).
 * Sono quelli NON già presi dagli esempi ESC: servono come controllo indipendente.
 */
(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var TOL = 0.1;

  function sex(s) { return s === 'M' ? 'male' : 'female'; }
  function pct(r) { return r.risk * 100; }

  // età, sesso, fumo, PAS, CT, HDL, regione → % MDCalc
  [
    [40, 'F', false, 110, 4.2, 1.8, 'low', 0.4],
    [62, 'M', false, 175, 7.8, 0.9, 'low', 12.9]
  ].forEach(function (c) {
    test('MDCalc SCORE2: ' + c.slice(0, 7).join(' ') + ' → ' + c[7] + '%', function () {
      assert.near(pct(L.score2.compute({ age: c[0], sex: sex(c[1]), smoker: c[2], sbp: c[3], totalChol: c[4], hdl: c[5], region: c[6] })), c[7], TOL);
    });
  });

  // età, sesso, diabete, fumo, PAS, CT, HDL, regione → % MDCalc
  [
    [78, 'F', true, false, 145, 5.2, 1.3, 'low', 21.4],
    [72, 'M', true, true, 155, 6.1, 1.0, 'low', 35.2],
    [89, 'M', true, false, 170, 4.0, 1.0, 'low', 32.3],
    [75, 'M', false, true, 140, 5.5, 1.3, 'high', 27.8]
  ].forEach(function (c) {
    test('MDCalc SCORE2-OP: ' + c.slice(0, 8).join(' ') + ' → ' + c[8] + '%', function () {
      assert.near(pct(L.score2op.compute({ age: c[0], sex: sex(c[1]), diabetes: c[2], smoker: c[3], sbp: c[4], totalChol: c[5], hdl: c[6], region: c[7] })), c[8], TOL);
    });
  });

  // età, sesso, fumo, PAS, CT, HDL, età diagnosi, HbA1c, eGFR, regione → % MDCalc
  [
    [50, 'F', true, 160, 6.8, 0.9, 40, 86, 35, 'low', 27.5],
    [68, 'M', false, 120, 4.0, 1.6, 66, 44, 110, 'low', 9.3],
    [60, 'M', false, 140, 5.5, 1.3, 50, 70, 60, 'moderate', 17.2]
  ].forEach(function (c) {
    test('MDCalc SCORE2-Diabetes: ' + c.slice(0, 10).join(' ') + ' → ' + c[10] + '%', function () {
      assert.near(pct(L.score2diabetes.compute({
        age: c[0], sex: sex(c[1]), smoker: c[2], sbp: c[3], totalChol: c[4], hdl: c[5],
        ageAtDiagnosis: c[6], hba1c: c[7], egfr: c[8], region: c[9]
      })), c[10], TOL);
    });
  });
})();
