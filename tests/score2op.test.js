(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var TOL = 0.1;

  function pct(p) { return L.score2op.compute(p).risk * 100; }

  test('SCORE2-OP esempio ESC, low, 75 anni, fumatore, PAS 140, CT 5.5, HDL 1.3: M 18.6%, F 15.2%', function () {
    var p = { age: 75, smoker: true, diabetes: false, sbp: 140, totalChol: 5.5, hdl: 1.3, region: 'low' };
    assert.near(pct(Object.assign({ sex: 'male' }, p)), 18.6, TOL, 'uomo');
    assert.near(pct(Object.assign({ sex: 'female' }, p)), 15.2, TOL, 'donna');
  });

  [
    [70, 'male', false, 140, 5.5, 1.3, 9.3],
    [75, 'male', true, 150, 6.0, 1.2, 22.2],
    [75, 'female', false, 140, 6.0, 1.6, 9.5],
    [82, 'female', true, 160, 5.0, 1.4, 23.5],
    [85, 'male', false, 130, 4.5, 1.1, 22.4]
  ].forEach(function (c) {
    test('SCORE2-OP low: ' + c.slice(0, 6).join(' ') + ' → ' + c[6] + '%', function () {
      assert.near(pct({ age: c[0], sex: c[1], smoker: c[2], diabetes: false, sbp: c[3], totalChol: c[4], hdl: c[5], region: 'low' }), c[6], TOL);
    });
  });

  test('SCORE2-OP: il diabete aumenta il rischio', function () {
    var p = { age: 75, sex: 'female', smoker: false, sbp: 140, totalChol: 5.5, hdl: 1.3, region: 'low' };
    assert.ok(pct(Object.assign({ diabetes: true }, p)) > pct(Object.assign({ diabetes: false }, p)));
  });
})();
