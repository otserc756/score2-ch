(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var C = L.categories;

  function cat(model, age, pct) { return C.fromScore(model, age, pct / 100).category; }

  // età, rischio %, categoria attesa (SCORE2 / SCORE2-OP, ESC 2021)
  [
    [45, 2.4, 'lowModerate'], [45, 2.5, 'high'], [45, 7.4, 'high'], [45, 7.5, 'veryHigh'],
    [49, 2.6, 'high'],
    [50, 2.6, 'lowModerate'], [50, 4.9, 'lowModerate'], [50, 5.0, 'high'], [69, 9.9, 'high'], [69, 10.0, 'veryHigh'],
    [70, 7.4, 'lowModerate'], [70, 7.5, 'high'], [89, 14.9, 'high'], [89, 15.0, 'veryHigh']
  ].forEach(function (c) {
    var model = c[0] >= 70 ? 'SCORE2-OP' : 'SCORE2';
    test('Categoria ' + model + ': ' + c[0] + ' anni, ' + c[1] + '% → ' + c[2], function () {
      assert.equal(cat(model, c[0], c[1]), c[2]);
    });
  });

  // SCORE2-Diabetes (ESC 2023): soglie fisse 5 / 10 / 20 %
  [
    [4.9, 'low'], [5.0, 'moderate'], [9.9, 'moderate'], [10.0, 'high'], [19.9, 'high'], [20.0, 'veryHigh'], [35, 'veryHigh']
  ].forEach(function (c) {
    test('Categoria SCORE2-Diabetes: ' + c[0] + '% → ' + c[1], function () {
      assert.equal(cat('SCORE2-Diabetes', 60, c[0]), c[1]);
      assert.equal(C.fromScore('SCORE2-Diabetes', 60, c[0] / 100).scheme, 'ESC2023-DM');
    });
  });

  test('Categoria sul valore arrotondato: 7.46% a 45 anni è mostrato 7.5% → molto alto', function () {
    var r = C.fromScore('SCORE2', 45, 0.0746);
    assert.equal(r.percent, 7.5);
    assert.equal(r.category, 'veryHigh');
    assert.equal(C.fromScore('SCORE2', 45, 0.07449).category, 'high');
  });

  test('Modello sconosciuto → errore', function () {
    assert.throws(function () { C.fromScore('Framingham', 50, 0.1); });
  });

  test('worst(): la categoria più grave', function () {
    assert.equal(C.worst('lowModerate', 'high'), 'high');
    assert.equal(C.worst(null, 'veryHigh', 'high'), 'veryHigh');
    assert.equal(C.worst('moderate', null), 'moderate');
    assert.equal(C.worst(null, null), null);
  });

  // Soglie fisse ESC/EAS 2025 (solo informazione per il medico)
  [
    [1.9, 'low'], [2.0, 'moderate'], [9.9, 'moderate'], [10.0, 'high'], [19.9, 'high'], [20.0, 'veryHigh']
  ].forEach(function (c) {
    test('Categoria ESC/EAS 2025: ' + c[0] + '% → ' + c[1], function () {
      assert.equal(C.fromScore2025('SCORE2', c[0] / 100).category, c[1]);
      assert.equal(C.fromScore2025('SCORE2-OP', c[0] / 100).category, c[1]);
    });
  });

  test('Categoria ESC/EAS 2025: non applicata a SCORE2-Diabetes', function () {
    assert.equal(C.fromScore2025('SCORE2-Diabetes', 0.15), null);
  });

  test('Obiettivi non-HDL per categoria (basso < 3.8)', function () {
    assert.equal(C.nonHdlTarget('veryHigh'), 2.2);
    assert.equal(C.nonHdlTarget('high'), 2.6);
    assert.equal(C.nonHdlTarget('moderate'), 3.4);
    assert.equal(C.nonHdlTarget('low'), 3.8);
  });

  test('Obiettivi LDL per categoria', function () {
    assert.deepEqual(C.ldlTarget('veryHigh'), { ldlBelow: 1.4, minReductionPct: 50 });
    assert.deepEqual(C.ldlTarget('high'), { ldlBelow: 1.8, minReductionPct: 50 });
    assert.equal(C.ldlTarget('moderate').ldlBelow, 2.6);
    assert.equal(C.ldlTarget('low').ldlBelow, 3.0);
    assert.equal(C.ldlTarget('lowModerate').ldlBelow, 2.6);
    assert.equal(C.ldlTarget('sconosciuta'), null);
  });
})();
