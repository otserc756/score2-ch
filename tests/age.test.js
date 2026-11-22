(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var A = L.age;
  function d(s) { return A.parseSwissDate(s); }

  test('Data: formato gg.mm.aaaa', function () {
    assert.deepEqual(d('05.03.1960'), { year: 1960, month: 3, day: 5 });
    assert.deepEqual(d('5.3.1960'), { year: 1960, month: 3, day: 5 });
    assert.deepEqual(d(' 05/03/1960 '), { year: 1960, month: 3, day: 5 });
  });

  test('Data: valori non validi', function () {
    ['31.02.2020', '29.02.2021', '00.01.2000', '12.13.2000', '1960-03-05', '05.03.60', '', 'abc'].forEach(function (s) {
      assert.equal(d(s), null, s);
    });
    assert.equal(A.parseSwissDate(null), null);
  });

  test('Data: 29 febbraio in anno bisestile', function () {
    assert.deepEqual(d('29.02.2020'), { year: 2020, month: 2, day: 29 });
  });

  test('Data: formattazione con zeri', function () {
    assert.equal(A.formatSwissDate({ year: 1960, month: 3, day: 5 }), '05.03.1960');
  });

  test('Età: il giorno del compleanno conta già', function () {
    assert.equal(A.ageInYears(d('22.11.1966'), d('22.11.2026')), 60);
  });

  test('Età: il giorno prima del compleanno', function () {
    assert.equal(A.ageInYears(d('22.11.1966'), d('21.11.2026')), 59);
  });

  test('Età: mese successivo / precedente', function () {
    assert.equal(A.ageInYears(d('15.06.1980'), d('14.07.2026')), 46);
    assert.equal(A.ageInYears(d('15.06.1980'), d('16.05.2026')), 45);
  });

  test('Età: nati il 29 febbraio compiono gli anni il 1° marzo negli anni non bisestili', function () {
    assert.equal(A.ageInYears(d('29.02.1956'), d('28.02.2026')), 69);
    assert.equal(A.ageInYears(d('29.02.1956'), d('01.03.2026')), 70);
    assert.equal(A.ageInYears(d('29.02.1956'), d('29.02.2028')), 72);
  });

  test('Età: visita prima della nascita → null', function () {
    assert.equal(A.ageInYears(d('01.01.2000'), d('31.12.1999')), null);
  });

  test('Età: nascita e visita nello stesso giorno → 0', function () {
    assert.equal(A.ageInYears(d('01.01.2000'), d('01.01.2000')), 0);
  });
})();
