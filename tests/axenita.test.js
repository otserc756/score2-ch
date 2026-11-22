(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var X = L.axenita, A = L.assessment;

  function line(input, checks, lang) { return X.buildLine(A.assess(input, checks || {}), input, lang || 'it'); }

  var ex = { age: 69, sex: 'male', smoker: true, diabetes: false, sbp: 140, totalChol: 5.23, hdl: 1.24, region: 'low' };

  test('Axenita: esempio della specifica', function () {
    assert.equal(line(ex),
      'SCORE2 (regione a basso rischio): 12.9% a 10 anni – rischio molto alto ' +
      '(M, 69 a, fumatore, PAS 140, CT 5.23, HDL 1.24, non-HDL 3.99 mmol/L). ' +
      'Obiettivo LDL <1.4 mmol/L e riduzione ≥50%.');
  });

  test('Axenita: stesso esempio in tedesco, senza "ß"', function () {
    var s = line(ex, {}, 'de');
    assert.equal(s,
      'SCORE2 (Region mit niedrigem Risiko): 12.9% in 10 Jahren – Risiko sehr hoch ' +
      '(M, 69 J, Raucher, BD syst. 140, GC 5.23, HDL 1.24, Non-HDL 3.99 mmol/L). ' +
      'LDL-Ziel <1.4 mmol/L und Senkung ≥50%.');
    assert.ok(s.indexOf('ß') < 0);
  });

  test('Axenita: categoria ESC/EAS 2025 solo se l\'opzione è attiva', function () {
    var a = A.assess(ex, {});
    var off = X.buildLine(a, ex, 'it');
    var on = X.buildLine(a, ex, 'it', { esc2025: true });
    assert.ok(off.indexOf('ESC/EAS 2025') < 0, off);
    assert.ok(on.indexOf('– rischio molto alto (ESC/EAS 2025: alto) (M, 69 a') > 0, on);
    var de = X.buildLine(a, ex, 'de', { esc2025: true });
    assert.ok(de.indexOf('Risiko sehr hoch (ESC/EAS 2025: hoch)') > 0, de);
  });

  test('Axenita: nessun dato anagrafico anche se presente nell\'input', function () {
    var p = Object.assign({ firstName: 'Mario', lastName: 'Rossi', birthDate: '15.03.1957' }, ex);
    var s = line(p);
    ['Mario', 'Rossi', '1957'].forEach(function (x) { assert.ok(s.indexOf(x) < 0, x); });
  });

  test('Axenita: donna non fumatrice, PA con diastolica, LDL calcolato e misurato', function () {
    var p = { age: 55, sex: 'female', smoker: false, diabetes: false, sbp: 125, dbp: 80, totalChol: 5.0, hdl: 1.6, triglycerides: 1.1, region: 'low' };
    var s = line(p);
    assert.ok(s.indexOf('(F, 55 a, non fumatrice, PA 125/80, CT 5, HDL 1.6, non-HDL 3.4, LDL calc. 2.9 mmol/L)') > 0, s);
    assert.ok(s.indexOf('rischio basso-moderato') > 0, s);
    assert.ok(/Obiettivo LDL <2\.6 mmol\/L \(<3 se rischio basso\)\.$/.test(s), s);
    var m = line(Object.assign({ ldlMeasured: 3.1 }, p));
    assert.ok(m.indexOf('LDL 3.1 mmol/L') > 0, m);
  });

  test('Axenita: SCORE2-Diabetes con età alla diagnosi, HbA1c ed eGFR', function () {
    var p = { age: 60, sex: 'male', smoker: false, diabetes: true, sbp: 140, totalChol: 5.5, hdl: 1.3,
      ageAtDiagnosis: 50, hba1c: 70, egfr: 60, region: 'low' };
    var s = line(p);
    assert.ok(s.indexOf('SCORE2-Diabetes (regione a basso rischio): 12.9% a 10 anni – rischio alto') === 0, s);
    assert.ok(s.indexOf('diabete tipo 2 dai 50 a, HbA1c 70 mmol/mol, PAS 140, eGFR 60') > 0, s);
  });

  test('Axenita: ASCVD → score non applicabile e categoria dalla condizione', function () {
    var p = { age: 45, sex: 'female', smoker: false, diabetes: false, sbp: 120, totalChol: 5, hdl: 1.6, region: 'low' };
    var s = line(p, { ascvd: true });
    assert.ok(s.indexOf('a 10 anni, score non applicabile – rischio molto alto per ASCVD accertata (') > 0, s);
    assert.ok(s.indexOf('Obiettivo LDL <1.4') > 0, s);
  });

  test('Axenita: condizione non decisiva per la categoria è comunque segnalata', function () {
    var s = line(ex, { markedFactor: true });
    assert.ok(s.indexOf('rischio molto alto; controllo preliminare: fattore singolo marcatamente elevato (') > 0, s);
  });

  test('Axenita: score non calcolabile ma categoria dalla checklist', function () {
    var p = { age: 35, sex: 'male', smoker: false, diabetes: false, sbp: 130, totalChol: 9, hdl: 1.2, region: 'low' };
    var s = line(p, { fh: 'fh' });
    assert.ok(s.indexOf('Rischio CV alto per ipercolesterolemia familiare; score non calcolabile (M, 35 a') === 0, s);
  });

  test('Axenita: valori fuori dall\'intervallo del modello segnalati', function () {
    var s = line(Object.assign({}, ex, { sbp: 210 }));
    assert.ok(s.indexOf('Valori fuori dall\'intervallo del modello: PAS.') > 0, s);
  });

  test('Axenita: regione diversa da "low" indicata', function () {
    assert.ok(line(Object.assign({}, ex, { region: 'high' })).indexOf('SCORE2 (regione ad alto rischio)') === 0);
  });

  test('Axenita: niente riga senza risultato', function () {
    assert.equal(line({ sex: 'male' }), null);
    assert.equal(X.buildLine(null, {}, 'it'), null);
  });
})();
