(function () {
  'use strict';
  var h = typeof require === 'function' ? require('./harness.js') : ESCTest;
  var test = h.test, assert = h.assert, L = h.lib;
  var W = L.whatif, A = L.assessment;

  // Esempio della riga per Axenita
  var axenita = { age: 69, sex: 'male', smoker: true, diabetes: false, sbp: 140, totalChol: 5.23, hdl: 1.24, region: 'low' };

  function ids(r) { return r.scenarios.map(function (s) { return s.id; }); }
  function byId(r, id) { return r.scenarios.filter(function (s) { return s.id === id; })[0]; }

  test('Cosa cambia se: fumatore con PAS 140 → smettere, PAS 130, CT −1, tutti insieme', function () {
    var r = W.scenarios(axenita);
    assert.equal(r.basePercent, 12.9);
    assert.deepEqual(ids(r), ['quitSmoking', 'sbp130', 'tcMinus1', 'all']);
    r.scenarios.forEach(function (s) { assert.ok(s.percent < r.basePercent, s.id); });
    var all = byId(r, 'all');
    r.scenarios.forEach(function (s) { assert.ok(all.percent <= s.percent, 'tutti insieme ≤ ' + s.id); });
    assert.near(byId(r, 'quitSmoking').deltaPoints, byId(r, 'quitSmoking').percent - 12.9, 0.05);
  });

  test('Cosa cambia se: non fumatore con PAS ≤ 130 → solo CT −1, senza "tutti insieme"', function () {
    var r = W.scenarios({ age: 55, sex: 'female', smoker: false, diabetes: false, sbp: 125, totalChol: 5.0, hdl: 1.6, region: 'low' });
    assert.deepEqual(ids(r), ['tcMinus1']);
  });

  test('Cosa cambia se: CT −1 non proposto se porterebbe CT sotto HDL', function () {
    var r = W.scenarios({ age: 55, sex: 'female', smoker: false, diabetes: false, sbp: 125, totalChol: 2.5, hdl: 1.6, region: 'low' });
    assert.deepEqual(ids(r), []);
  });

  test('Cosa cambia se: HbA1c 53 solo per SCORE2-Diabetes con HbA1c > 53', function () {
    var dm = { age: 60, sex: 'male', smoker: false, diabetes: true, sbp: 140, totalChol: 5.5, hdl: 1.3,
      ageAtDiagnosis: 50, hba1c: 70, egfr: 60, region: 'low' };
    var r = W.scenarios(dm);
    assert.equal(r.model, 'SCORE2-Diabetes');
    assert.ok(ids(r).indexOf('hba1c53') >= 0);
    assert.ok(byId(r, 'hba1c53').percent < r.basePercent);
    assert.ok(ids(W.scenarios(Object.assign({}, dm, { hba1c: 50 }))).indexOf('hba1c53') < 0);
    var op = W.scenarios(Object.assign({}, dm, { age: 75 }));
    assert.equal(op.model, 'SCORE2-OP');
    assert.ok(ids(op).indexOf('hba1c53') < 0);
  });

  test('Cosa cambia se: null se il calcolo di base non è possibile', function () {
    assert.equal(W.scenarios(Object.assign({}, axenita, { age: 30 })), null);
  });

  test('Valutazione: esempio Axenita → 12.9%, molto alto, obiettivo LDL < 1.4, non-HDL 3.99', function () {
    var r = A.assess(axenita, {});
    assert.equal(r.calc.model, 'SCORE2');
    assert.equal(r.score.percent, 12.9);
    assert.equal(r.category, 'veryHigh');
    assert.equal(r.categoryFromConditions, false);
    assert.equal(r.ldlTarget.ldlBelow, 1.4);
    assert.near(r.lipids.nonHdl, 3.99, 1e-9);
    assert.equal(r.lipids.ldl, null);
  });

  test('Valutazione: ASCVD alza la categoria a molto alto anche con score basso', function () {
    var p = { age: 45, sex: 'female', smoker: false, diabetes: false, sbp: 120, totalChol: 5, hdl: 1.6, region: 'low' };
    var base = A.assess(p, {});
    assert.equal(base.category, 'lowModerate');
    var r = A.assess(p, { ascvd: true });
    assert.equal(r.score.category, 'lowModerate');
    assert.equal(r.category, 'veryHigh');
    assert.equal(r.categoryFromConditions, true);
    assert.equal(r.checklist.scoreApplies, false);
    assert.equal(r.ldlTarget.ldlBelow, 1.4);
  });

  test('Valutazione: condizioni valide anche se l\'età è fuori range per lo score', function () {
    var r = A.assess({ age: 35, sex: 'male', smoker: false, diabetes: false, sbp: 130, totalChol: 9, hdl: 1.2, region: 'low' }, { fh: 'fh' });
    assert.equal(r.calc.ok, false);
    assert.equal(r.score, null);
    assert.equal(r.category, 'high');
    assert.equal(r.categoryFromConditions, true);
    assert.equal(r.suggestions.markedFactor, true);
    assert.equal(r.whatIf, null);
  });

  test('Valutazione: LDL misurato ha la precedenza su Friedewald', function () {
    var p = Object.assign({}, axenita, { triglycerides: 1.5 });
    var f = A.assess(p, {});
    assert.equal(f.lipids.ldlSource, 'friedewald');
    assert.near(f.lipids.ldl, 5.23 - 1.24 - 1.5 / 2.2, 1e-9);
    var m = A.assess(Object.assign({ ldlMeasured: 3.2 }, p), {});
    assert.equal(m.lipids.ldlSource, 'measured');
    assert.equal(m.lipids.ldl, 3.2);
  });

  test('Valutazione: trigliceridi ≥ 4.5 → LDL non calcolato e segnalato', function () {
    var r = A.assess(Object.assign({}, axenita, { triglycerides: 5 }), {});
    assert.equal(r.lipids.ldl, null);
    assert.equal(r.lipids.ldlSource, 'friedewaldNotValid');
  });

  test('Valutazione: suggerisce IRC dai valori di eGFR e ACR', function () {
    var r = A.assess(Object.assign({}, axenita, { egfr: 40, acrMgG: 50 }), {});
    assert.equal(r.suggestions.ckd, 'severe');
  });
})();
