/*
 * Scelta automatica del modello, validazione degli input e calcolo del rischio.
 *
 *   40–69 anni, senza diabete     → SCORE2
 *   40–69 anni, diabete tipo 2    → SCORE2-Diabetes
 *   70–89 anni, con/senza diabete → SCORE2-OP (il diabete è una variabile del modello)
 *   < 40 o > 89 anni              → nessun calcolo
 *
 * Input normalizzato (unità già convertite dall'interfaccia):
 *   { age, sex:'male'|'female', smoker:boolean, diabetes:boolean, sbp (mmHg),
 *     totalChol, hdl (mmol/L), ageAtDiagnosis, hba1c (mmol/mol), egfr (mL/min/1.73 m²),
 *     region:'low'|'moderate'|'high'|'veryHigh' }
 */
(function (root) {
  'use strict';
  var isNode = typeof module === 'object' && module.exports;
  var NS = isNode ? null : root.ESCScore;
  var calibration = isNode ? require('./calibration.js') : NS.calibration;
  var score2 = isNode ? require('./score2.js') : NS.score2;
  var score2op = isNode ? require('./score2op.js') : NS.score2op;
  var score2diabetes = isNode ? require('./score2diabetes.js') : NS.score2diabetes;

  var MODELS = { SCORE2: 'SCORE2', SCORE2_DIABETES: 'SCORE2-Diabetes', SCORE2_OP: 'SCORE2-OP' };

  var AGE_MIN = 40, AGE_MAX = 89, AGE_OP_MIN = 70;

  // Valori fisiologicamente implausibili: errore, nessun calcolo.
  var HARD_LIMITS = {
    age: [0, 120],
    sbp: [60, 300],
    totalChol: [1, 20],
    hdl: [0.1, 5],
    hba1c: [15, 200],
    egfr: [1, 250],
    ageAtDiagnosis: [0, 120]
  };

  // Valori plausibili ma fuori dall'intervallo tipico dei dati usati per il modello:
  // si calcola comunque, con un avviso. Intervalli prudenziali, da rivedere sulle
  // pubblicazioni originali (vedi docs/).
  var MODEL_RANGES = {
    sbp: [100, 200],
    totalChol: [3, 10],
    hdl: [0.5, 3],
    hba1c: [20, 150],
    egfr: [15, 150]
  };

  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /** Sceglie il modello in base a età e diabete. */
  function selectModel(age, diabetes) {
    if (!isNum(age)) return { model: null, reason: 'age_missing' };
    if (age < AGE_MIN) return { model: null, reason: 'age_below_40' };
    if (age > AGE_MAX) return { model: null, reason: 'age_above_89' };
    if (age >= AGE_OP_MIN) return { model: MODELS.SCORE2_OP, reason: null };
    return { model: diabetes ? MODELS.SCORE2_DIABETES : MODELS.SCORE2, reason: null };
  }

  /**
   * Controlla l'input. errors: impediscono il calcolo. warnings: il calcolo procede.
   * Ogni voce è { field, code, range? } da tradurre nell'interfaccia.
   */
  function validate(input) {
    var errors = [], warnings = [];
    var i = input || {};

    function need(field, ok) { if (!ok) errors.push({ field: field, code: 'required' }); }
    function checkNumber(field, required) {
      var v = i[field];
      if (v === null || v === undefined || v === '') { if (required) need(field, false); return; }
      if (!isNum(v)) { errors.push({ field: field, code: 'not_a_number' }); return; }
      var h = HARD_LIMITS[field];
      if (h && (v < h[0] || v > h[1])) { errors.push({ field: field, code: 'implausible', range: h }); return; }
      var r = MODEL_RANGES[field];
      if (r && (v < r[0] || v > r[1])) warnings.push({ field: field, code: 'outside_model_range', range: r });
    }

    need('sex', i.sex === 'male' || i.sex === 'female');
    need('smoker', typeof i.smoker === 'boolean');
    need('diabetes', typeof i.diabetes === 'boolean');
    if (i.region !== undefined && calibration.REGIONS.indexOf(i.region) < 0) {
      errors.push({ field: 'region', code: 'invalid' });
    }
    checkNumber('age', true);
    checkNumber('sbp', true);
    checkNumber('totalChol', true);
    checkNumber('hdl', true);

    if (isNum(i.totalChol) && isNum(i.hdl) && i.hdl >= i.totalChol) {
      errors.push({ field: 'hdl', code: 'hdl_not_below_total' });
    }

    var sel = selectModel(i.age, i.diabetes);
    if (isNum(i.age) && !sel.model) errors.push({ field: 'age', code: sel.reason });

    if (sel.model === MODELS.SCORE2_DIABETES) {
      checkNumber('ageAtDiagnosis', true);
      checkNumber('hba1c', true);
      checkNumber('egfr', true);
      if (isNum(i.ageAtDiagnosis) && isNum(i.age) && i.ageAtDiagnosis > i.age) {
        errors.push({ field: 'ageAtDiagnosis', code: 'after_current_age' });
      }
    }

    return { valid: errors.length === 0, errors: errors, warnings: warnings, model: sel.model };
  }

  /**
   * Calcola il rischio a 10 anni.
   * @returns {{ok:boolean, model:string|null, region:string, risk:number|null,
   *            uncalibrated:number|null, errors:Array, warnings:Array}} risk in 0–1
   */
  function calculate(input) {
    var p = Object.assign({ region: 'low' }, input);
    var v = validate(p);
    var out = {
      ok: false, model: v.model, region: p.region, risk: null, uncalibrated: null,
      errors: v.errors, warnings: v.warnings
    };
    if (!v.valid) return out;

    var r;
    if (v.model === MODELS.SCORE2) r = score2.compute(p);
    else if (v.model === MODELS.SCORE2_DIABETES) r = score2diabetes.compute(p);
    else r = score2op.compute(p);

    out.ok = true;
    out.risk = r.risk;
    out.uncalibrated = r.uncalibrated;
    return out;
  }

  var api = {
    MODELS: MODELS,
    AGE_MIN: AGE_MIN, AGE_MAX: AGE_MAX, AGE_OP_MIN: AGE_OP_MIN,
    HARD_LIMITS: HARD_LIMITS,
    MODEL_RANGES: MODEL_RANGES,
    selectModel: selectModel,
    validate: validate,
    calculate: calculate
  };

  if (isNode) module.exports = api;
  else NS.risk = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
