(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var E = L.egfr;

  // Valori di riferimento calcolati con l'equazione CKD-EPI 2021 (Inker 2021),
  // arrotondati come nel calcolatore NKF.
  [
    [70.72, 60, 'female', 84],   // 0.8 mg/dL
    [88.4, 50, 'male', 92],      // 1.0 mg/dL
    [61.88, 40, 'male', 119],    // 0.7 mg/dL (sotto κ: ramo α)
    [176.8, 70, 'male', 35],     // 2.0 mg/dL
    [53.04, 30, 'female', 124]   // 0.6 mg/dL (sotto κ)
  ].forEach(function (c) {
    test('CKD-EPI 2021: creatinina ' + c[0] + ' µmol/L, ' + c[1] + ' anni, ' + c[2] + ' → ' + c[3], function () {
      assert.equal(Math.round(E.ckdEpi2021(c[0], c[1], c[2])), c[3]);
    });
  });

  test('CKD-EPI 2021: a parità di creatinina ed età la donna ha un eGFR diverso dall\'uomo', function () {
    assert.ok(E.ckdEpi2021(88.4, 50, 'female') !== E.ckdEpi2021(88.4, 50, 'male'));
  });

  test('CKD-EPI 2021: input non validi', function () {
    assert.throws(function () { E.ckdEpi2021(0, 50, 'male'); });
    assert.throws(function () { E.ckdEpi2021(80, 50, 'x'); });
  });
})();
