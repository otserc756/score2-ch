(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var U = L.units;

  test('Colesterolo: mg/dL ↔ mmol/L', function () {
    assert.near(U.cholMgdlToMmol(200), 5.172, 0.001);
    assert.near(U.cholMgdlToMmol(50), 1.293, 0.001);
    assert.near(U.cholMmolToMgdl(5.0), 193.35, 0.01);
    assert.near(U.cholMmolToMgdl(U.cholMgdlToMmol(187)), 187, 1e-9);
  });

  test('Trigliceridi: mg/dL ↔ mmol/L', function () {
    assert.near(U.tgMgdlToMmol(150), 1.694, 0.001);
    assert.near(U.tgMmolToMgdl(2.0), 177.14, 0.01);
  });

  test('HbA1c: % → mmol/mol', function () {
    assert.near(U.hba1cPercentToMmolMol(7), 53.0, 0.05);
    assert.near(U.hba1cPercentToMmolMol(6.5), 47.5, 0.05);
    assert.near(U.hba1cPercentToMmolMol(8), 63.9, 0.05);
  });

  test('HbA1c: mmol/mol → %', function () {
    assert.near(U.hba1cMmolMolToPercent(53), 7.0, 0.01);
    assert.near(U.hba1cMmolMolToPercent(U.hba1cPercentToMmolMol(9.1)), 9.1, 1e-9);
  });

  test('Creatinina: µmol/L ↔ mg/dL', function () {
    assert.near(U.creatinineUmolToMgdl(88.4), 1.0, 1e-9);
    assert.near(U.creatinineMgdlToUmol(0.8), 70.72, 1e-9);
  });

  test('Non-HDL', function () {
    assert.near(U.nonHdl(5.23, 1.24), 3.99, 1e-9);
  });

  test('Friedewald: TG < 4.5 mmol/L', function () {
    assert.near(U.friedewaldLdl(5.5, 1.3, 1.5), 3.518, 0.001);
  });

  test('Friedewald: non calcolato con TG ≥ 4.5 o TG mancanti', function () {
    assert.equal(U.friedewaldLdl(7, 1, 4.5), null);
    assert.equal(U.friedewaldLdl(7, 1, 6), null);
    assert.equal(U.friedewaldLdl(5.5, 1.3, null), null);
    assert.equal(U.friedewaldLdl(5.5, 1.3, undefined), null);
  });

  test('Numeri con virgola o punto decimale', function () {
    assert.equal(U.parseDecimal('5,23'), 5.23);
    assert.equal(U.parseDecimal(' 5.23 '), 5.23);
    assert.equal(U.parseDecimal('140'), 140);
    assert.equal(U.parseDecimal(6.3), 6.3);
    assert.ok(isNaN(U.parseDecimal('')));
    assert.ok(isNaN(U.parseDecimal('abc')));
    assert.ok(isNaN(U.parseDecimal('5,2,3')));
    assert.ok(isNaN(U.parseDecimal(null)));
  });
})();
