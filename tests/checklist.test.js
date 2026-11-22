(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var K = L.checklist;

  // eGFR, ACR (mg/g), classe attesa
  [
    [25, null, 'severe'], [25, 10, 'severe'],
    [40, 10, 'moderate'], [40, 29, 'moderate'], [40, 31, 'severe'], [40, null, 'moderate'],
    [50, 10, 'none'], [50, 30, 'moderate'], [50, 300, 'moderate'], [50, 301, 'severe'], [50, null, 'needsAcr'],
    [75, 100, 'none'], [75, 300, 'none'], [75, 301, 'moderate'], [75, null, 'needsAcr'],
    [null, 50, 'unknown']
  ].forEach(function (c) {
    test('IRC: eGFR ' + c[0] + ', ACR ' + c[1] + ' mg/g → ' + c[2], function () {
      assert.equal(K.classifyCkd(c[0], c[1]), c[2]);
    });
  });

  test('ACR: 3 mg/mmol ≈ 26.5 mg/g, 30 mg/mmol ≈ 265 mg/g', function () {
    assert.near(L.units.acrMgMmolToMgG(3), 26.52, 0.01);
    assert.near(L.units.acrMgGToMgMmol(30), 3.39, 0.01);
  });

  test('Danno d\'organo severo nel diabete (ESC 2023)', function () {
    assert.equal(K.diabetesSevereTod(40, null), true);
    assert.equal(K.diabetesSevereTod(50, 30), true);
    assert.equal(K.diabetesSevereTod(50, 20), false);
    assert.equal(K.diabetesSevereTod(80, 350), true);
    assert.equal(K.diabetesSevereTod(80, 100), false);
    assert.equal(K.diabetesSevereTod(80, null), null);
    assert.equal(K.diabetesSevereTod(80, 10, true), true);
  });

  test('Suggerimento: fattore singolo marcatamente elevato', function () {
    assert.deepEqual(K.suggest({ totalChol: 8.1 }).markedFactors, ['totalChol']);
    assert.deepEqual(K.suggest({ totalChol: 8.0 }).markedFactors, []);
    assert.deepEqual(K.suggest({ ldl: 5.0 }).markedFactors, ['ldl']);
    assert.deepEqual(K.suggest({ sbp: 180 }).markedFactors, ['bp']);
    assert.deepEqual(K.suggest({ sbp: 150, dbp: 110 }).markedFactors, ['bp']);
    assert.deepEqual(K.suggest({ sbp: 179, dbp: 109 }).markedFactors, []);
    assert.equal(K.suggest({ sbp: 185 }).markedFactor, true);
  });

  test('Suggerimento: il danno d\'organo da diabete si propone solo ai diabetici', function () {
    assert.equal(K.suggest({ diabetes: false, egfr: 40 }).diabetesSevereTod, false);
    assert.equal(K.suggest({ diabetes: true, egfr: 40 }).diabetesSevereTod, true);
    assert.equal(K.suggest({ diabetes: true, egfr: 40 }).ckd, 'moderate');
  });

  test('Checklist vuota: nessuna condizione, lo score si applica', function () {
    var e = K.evaluate({}, {});
    assert.equal(e.category, null);
    assert.equal(e.scoreApplies, true);
    assert.equal(e.conditions.length, 0);
  });

  test('Checklist: ASCVD → molto alto, score non applicabile', function () {
    var e = K.evaluate({ ascvd: true });
    assert.equal(e.category, 'veryHigh');
    assert.equal(e.scoreApplies, false);
  });

  test('Checklist: IRC moderata → alto; severa → molto alto', function () {
    assert.equal(K.evaluate({ ckd: 'moderate' }).category, 'high');
    assert.equal(K.evaluate({ ckd: 'severe' }).category, 'veryHigh');
    assert.equal(K.evaluate({ ckd: 'none' }).category, null);
  });

  test('Checklist: FH → alto; FH con altro fattore maggiore → molto alto', function () {
    assert.equal(K.evaluate({ fh: 'fh' }).category, 'high');
    assert.equal(K.evaluate({ fh: 'fhWithRiskFactor' }).category, 'veryHigh');
  });

  test('Checklist: fattore marcato → almeno alto, score da interpretare con cautela', function () {
    var e = K.evaluate({ markedFactor: true });
    assert.equal(e.category, 'high');
    assert.equal(e.scoreApplies, true);
    assert.equal(e.conditions[0].scoreApplies, 'caution');
  });

  test('Checklist: danno d\'organo da diabete ignorato se il paziente non è diabetico', function () {
    assert.equal(K.evaluate({ diabetesSevereTod: true }, { diabetes: false }).category, null);
    assert.equal(K.evaluate({ diabetesSevereTod: true }, { diabetes: true }).category, 'veryHigh');
  });

  test('Checklist: più condizioni → vale la più grave', function () {
    var e = K.evaluate({ markedFactor: true, ckd: 'severe', fh: 'fh' });
    assert.equal(e.category, 'veryHigh');
    assert.equal(e.conditions.length, 3);
    assert.equal(e.scoreApplies, false);
  });
})();
