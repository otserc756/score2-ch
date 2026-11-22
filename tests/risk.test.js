(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var R = L.risk;

  function patient(extra) {
    return Object.assign({
      age: 55, sex: 'male', smoker: false, diabetes: false,
      sbp: 130, totalChol: 5.5, hdl: 1.3, region: 'low'
    }, extra);
  }
  var dmData = { diabetes: true, ageAtDiagnosis: 50, hba1c: 53, egfr: 80 };

  function codes(list, field) {
    return list.filter(function (e) { return !field || e.field === field; }).map(function (e) { return e.code; });
  }

  // --- Confini di età e scelta del modello ---
  [
    [39, false, null, 'age_below_40'],
    [40, false, 'SCORE2', null],
    [69, false, 'SCORE2', null],
    [40, true, 'SCORE2-Diabetes', null],
    [69, true, 'SCORE2-Diabetes', null],
    [70, false, 'SCORE2-OP', null],
    [70, true, 'SCORE2-OP', null],
    [89, false, 'SCORE2-OP', null],
    [89, true, 'SCORE2-OP', null],
    [90, false, null, 'age_above_89'],
    [90, true, null, 'age_above_89']
  ].forEach(function (c) {
    test('Modello a ' + c[0] + ' anni' + (c[1] ? ' con diabete' : '') + ': ' + (c[2] || 'nessun calcolo'), function () {
      var s = R.selectModel(c[0], c[1]);
      assert.equal(s.model, c[2]);
      assert.equal(s.reason, c[3]);
    });
  });

  test('Età fuori range: nessun calcolo e messaggio', function () {
    var r = R.calculate(patient({ age: 39 }));
    assert.equal(r.ok, false);
    assert.equal(r.risk, null);
    assert.deepEqual(codes(r.errors, 'age'), ['age_below_40']);
    assert.deepEqual(codes(R.calculate(patient({ age: 90 })).errors, 'age'), ['age_above_89']);
  });

  // --- calculate() usa il modello giusto e dà lo stesso valore del modulo ---
  test('calculate: 69 M fumatore → SCORE2 12.9%', function () {
    var r = R.calculate(patient({ age: 69, smoker: true, sbp: 140, totalChol: 5.23, hdl: 1.24 }));
    assert.equal(r.ok, true);
    assert.equal(r.model, 'SCORE2');
    assert.near(r.risk * 100, 12.9, 0.1);
  });

  test('calculate: diabete a 60 anni → SCORE2-Diabetes', function () {
    var r = R.calculate(patient(Object.assign({ age: 60, sbp: 140, totalChol: 5.5, hdl: 1.3 }, dmData,
      { ageAtDiagnosis: 60, hba1c: 50, egfr: 90 })));
    assert.equal(r.model, 'SCORE2-Diabetes');
    assert.near(r.risk * 100, 8.4, 0.1);
  });

  test('calculate: 75 anni con diabete → SCORE2-OP, senza bisogno di HbA1c ed eGFR', function () {
    var r = R.calculate(patient({ age: 75, diabetes: true }));
    assert.equal(r.ok, true);
    assert.equal(r.model, 'SCORE2-OP');
    assert.deepEqual(codes(r.warnings), ['op_diabetes']);
    assert.deepEqual(codes(R.calculate(patient({ age: 75 })).warnings), []);
  });

  test('calculate: regione predefinita "low" se non indicata', function () {
    var p = patient({ age: 69, smoker: true, sbp: 140, totalChol: 5.23, hdl: 1.24 });
    delete p.region;
    var r = R.calculate(p);
    assert.equal(r.region, 'low');
    assert.near(r.risk * 100, 12.9, 0.1);
  });

  test('calculate: la regione cambia il risultato', function () {
    var low = R.calculate(patient({ region: 'low' })).risk;
    var high = R.calculate(patient({ region: 'veryHigh' })).risk;
    assert.ok(high > low);
  });

  // --- Validazione degli input ---
  test('Validazione: campi obbligatori mancanti', function () {
    var v = R.validate({});
    ['sex', 'smoker', 'diabetes', 'age', 'sbp', 'totalChol', 'hdl'].forEach(function (f) {
      assert.ok(codes(v.errors, f).indexOf('required') >= 0, 'manca ' + f);
    });
    assert.equal(v.valid, false);
  });

  test('Validazione: paziente completo è valido, senza avvisi', function () {
    var v = R.validate(patient());
    assert.equal(v.valid, true);
    assert.equal(v.errors.length, 0);
    assert.equal(v.warnings.length, 0);
  });

  test('Validazione: valori non numerici', function () {
    var v = R.validate(patient({ sbp: '140', hdl: NaN }));
    assert.deepEqual(codes(v.errors, 'sbp'), ['not_a_number']);
    assert.deepEqual(codes(v.errors, 'hdl'), ['not_a_number']);
  });

  test('Validazione: valori implausibili bloccano il calcolo', function () {
    assert.deepEqual(codes(R.validate(patient({ sbp: 400 })).errors, 'sbp'), ['implausible']);
    assert.deepEqual(codes(R.validate(patient({ totalChol: 0.5 })).errors, 'totalChol'), ['implausible']);
    assert.equal(R.calculate(patient({ sbp: 400 })).ok, false);
  });

  test('Validazione: HDL uguale o superiore al colesterolo totale', function () {
    assert.deepEqual(codes(R.validate(patient({ totalChol: 2, hdl: 2 })).errors, 'hdl'), ['hdl_not_below_total']);
  });

  test('Validazione: valori fuori dal range del modello danno un avviso ma si calcola', function () {
    var r = R.calculate(patient({ sbp: 210, totalChol: 11 }));
    assert.equal(r.ok, true);
    assert.deepEqual(codes(r.warnings).sort(), ['outside_model_range', 'outside_model_range']);
    assert.deepEqual(codes(r.warnings, 'sbp'), ['outside_model_range']);
  });

  test('Validazione: diabete 40–69 richiede età alla diagnosi, HbA1c ed eGFR', function () {
    var v = R.validate(patient({ diabetes: true }));
    ['ageAtDiagnosis', 'hba1c', 'egfr'].forEach(function (f) {
      assert.deepEqual(codes(v.errors, f), ['required'], f);
    });
  });

  test('Validazione: età alla diagnosi successiva all\'età attuale', function () {
    var v = R.validate(patient(Object.assign({}, dmData, { age: 55, ageAtDiagnosis: 60 })));
    assert.deepEqual(codes(v.errors, 'ageAtDiagnosis'), ['after_current_age']);
  });

  test('Validazione: sesso e regione non validi', function () {
    assert.deepEqual(codes(R.validate(patient({ sex: 'M' })).errors, 'sex'), ['required']);
    assert.deepEqual(codes(R.validate(patient({ region: 'svizzera' })).errors, 'region'), ['invalid']);
  });
})();
