(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var TOL = 0.1;

  function pct(p) { return L.score2diabetes.compute(p).risk * 100; }
  function both(p, expM, expF) {
    assert.near(pct(Object.assign({ sex: 'male' }, p)), expM, TOL, 'uomo');
    assert.near(pct(Object.assign({ sex: 'female' }, p)), expF, TOL, 'donna');
  }

  var ex1 = { age: 60, smoker: false, sbp: 140, totalChol: 5.5, hdl: 1.3, ageAtDiagnosis: 60, hba1c: 50, egfr: 90, region: 'low' };

  test('SCORE2-Diabetes esempio ESC 1 (diagnosi a 60, HbA1c 50, eGFR 90): M 8.4%, F 6.1%', function () {
    both(ex1, 8.4, 6.1);
  });

  test('SCORE2-Diabetes esempio ESC 2 (diagnosi a 50, HbA1c 70, eGFR 60): M 12.9%, F 9.8%', function () {
    both(Object.assign({}, ex1, { ageAtDiagnosis: 50, hba1c: 70, egfr: 60 }), 12.9, 9.8);
  });

  test('SCORE2-Diabetes esempio ESC 3 (come 1, fumatore): M 11.8%, F 9.2%', function () {
    both(Object.assign({}, ex1, { smoker: true }), 11.8, 9.2);
  });

  // età, sesso, fumo, PAS, CT, HDL, età alla diagnosi, HbA1c, eGFR → atteso %
  [
    [55, 'male', true, 145, 5.8, 1.0, 48, 58, 75, 14.0],
    [65, 'female', false, 135, 5.0, 1.5, 60, 53, 55, 9.2],
    [45, 'male', false, 130, 6.2, 1.1, 42, 64, 95, 5.5]
  ].forEach(function (c) {
    test('SCORE2-Diabetes low: ' + c.slice(0, 9).join(' ') + ' → ' + c[9] + '%', function () {
      assert.near(pct({
        age: c[0], sex: c[1], smoker: c[2], sbp: c[3], totalChol: c[4], hdl: c[5],
        ageAtDiagnosis: c[6], hba1c: c[7], egfr: c[8], region: 'low'
      }), c[9], TOL);
    });
  });
})();
