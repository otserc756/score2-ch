(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var TOL = 0.1; // punti percentuali

  function pct(p) { return L.score2.compute(p).risk * 100; }
  function base(sex, region) {
    return { age: 50, sex: sex, smoker: true, sbp: 140, totalChol: 6.3, hdl: 1.4, region: region };
  }

  // Esempio ufficiale ESC: 50 anni, fumatore, PAS 140, CT 6.3, HDL 1.4, nelle 4 regioni
  [
    ['low', 6.3, 4.3],
    ['moderate', 8.1, 5.2],
    ['high', 8.8, 7.1],
    ['veryHigh', 15.1, 14.1]
  ].forEach(function (row) {
    test('SCORE2 esempio ESC, regione ' + row[0] + ': M ' + row[1] + '%, F ' + row[2] + '%', function () {
      assert.near(pct(base('male', row[0])), row[1], TOL, 'uomo');
      assert.near(pct(base('female', row[0])), row[2], TOL, 'donna');
    });
  });

  // Altri casi, regione a basso rischio: età, sesso, fumo, PAS, CT, HDL → atteso %
  [
    [45, 'male', false, 130, 5.5, 1.2, 2.4],
    [45, 'female', true, 130, 5.5, 1.5, 2.6],
    [55, 'male', true, 140, 6.0, 1.1, 8.5],
    [55, 'female', false, 125, 5.0, 1.6, 2.0],
    [69, 'male', true, 140, 5.23, 1.24, 12.9],
    [69, 'female', true, 150, 6.5, 1.3, 11.5]
  ].forEach(function (c) {
    test('SCORE2 low: ' + c.slice(0, 6).join(' ') + ' → ' + c[6] + '%', function () {
      assert.near(pct({ age: c[0], sex: c[1], smoker: c[2], sbp: c[3], totalChol: c[4], hdl: c[5], region: 'low' }), c[6], TOL);
    });
  });

  test('SCORE2: la regione predefinita è "low"', function () {
    var p = base('male');
    delete p.region;
    assert.near(pct(p), 6.3, TOL);
  });

  test('SCORE2: sesso o regione non validi generano un errore', function () {
    assert.throws(function () { L.score2.compute({ age: 50, sex: 'x', smoker: false, sbp: 120, totalChol: 5, hdl: 1.3 }); });
    assert.throws(function () { L.score2.compute(Object.assign(base('male'), { region: 'mars' })); });
  });
})();
